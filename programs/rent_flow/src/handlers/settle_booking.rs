use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{self, Token2022},
    token_interface::{self, Mint, TokenAccount, TokenInterface},
};
use crate::state::BookingObligation;
use crate::error::ErrorCode; // Required for custom safety sensors

#[derive(Accounts)]
pub struct SettleBooking<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        seeds = [b"obligation", nft_mint.key().as_ref()],
        bump = obligation.bump,
        // INVARIANT: Prevent double-settlement and verify ownership
        constraint = !obligation.is_settled @ ErrorCode::AlreadySettled,
        constraint = obligation.host_wallet == host.key() @ ErrorCode::NotHubOwner,
    )]
    pub obligation: Account<'info, BookingObligation>,

    // --- Repayment Corridor ---
    pub usdc_mint: InterfaceAccount<'info, Mint>, 
    #[account(mut)]
    pub host_usdc_ata: InterfaceAccount<'info, TokenAccount>, // Source of Cash
    #[account(mut)]
    pub vault_usdc_ata: InterfaceAccount<'info, TokenAccount>, // Destination (Liquidity Pool)

    // --- Asset Release Corridor ---
    pub nft_mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub vault_nft_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub host_nft_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,   // For USDC (Standard SPL)
    pub token_2022_program: Program<'info, Token2022>,     // For NFT
    pub clock: Sysvar<'info, Clock>,
}
pub fn handler(ctx: Context<SettleBooking>) -> Result<()> {
    let clock = &ctx.accounts.clock;
    let obligation = &mut ctx.accounts.obligation;
    
    // 📐 THE MATH: Fixed-Point Calculation
    let principal = obligation.booking_value; // The original USDC disbursed
    
    // Assume a fixed 10% Yield for this example (1000 BPS)
    let yield_bps: u64 = 1000; 
    let mut total_repayment = principal
        .checked_add(
            principal.checked_mul(yield_bps).ok_or(ErrorCode::MathOverflow)?
            .checked_div(10_000).ok_or(ErrorCode::MathOverflow)?
        ).ok_or(ErrorCode::MathOverflow)?;

    // 🚩 PENALTY SENSOR: Early Exit Check
    if clock.unix_timestamp < obligation.end_date {
        let penalty_bps: u64 = 500; // 5% Penalty
        let penalty_amount = principal
            .checked_mul(penalty_bps).ok_or(ErrorCode::MathOverflow)?
            .checked_div(10_000).ok_or(ErrorCode::MathOverflow)?;
            
        total_repayment = total_repayment.checked_add(penalty_amount).ok_or(ErrorCode::MathOverflow)?;
        msg!("Early Exit Detected. 5% Penalty Applied: {} USDC", penalty_amount);
    }

    // --- CPI 1: REPAYMENT (Host -> Vault) ---
    // Rule: Host must authorize the transfer of USDC to clear the debt.
    token_interface::transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token_interface::TransferChecked {
                from: ctx.accounts.host_usdc_ata.to_account_info(),
                mint: ctx.accounts.usdc_mint.to_account_info(),
                to: ctx.accounts.vault_usdc_ata.to_account_info(),
                authority: ctx.accounts.host.to_account_info(),
            },
        ),
        total_repayment,
        ctx.accounts.usdc_mint.decimals,
    )?;

    // --- CPI 2: RELEASE (Vault -> Host) ---
    // Rule: Use PDA seeds to release the "Hostage" NFT.
    let mint_key = ctx.accounts.nft_mint.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"obligation",
        mint_key.as_ref(),
        &[obligation.bump],
    ]];

    token_2022::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_2022_program.to_account_info(),
            token_2022::TransferChecked {
                from: ctx.accounts.vault_nft_ata.to_account_info(),
                mint: ctx.accounts.nft_mint.to_account_info(),
                to: ctx.accounts.host_nft_ata.to_account_info(),
                authority: obligation.to_account_info(),
            },
            signer_seeds,
        ),
        1, 0
    )?;

    // --- EXIT: FINAL STATE ---
    obligation.is_settled = true;
    obligation.is_locked = false;

    Ok(())
}
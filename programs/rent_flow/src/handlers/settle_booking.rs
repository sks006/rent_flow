use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{self, Token2022, TransferChecked},
    token_interface::{Mint, TokenAccount},
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
        // INVARIANT: Prevent double-settlement. 
        // Logic: If already settled, the handler is unreachable.
        constraint = !obligation.is_settled @ ErrorCode::AlreadySettled,
        constraint = obligation.host_wallet == host.key() @ ErrorCode::NotHubOwner,
    )]
    pub obligation: Account<'info, BookingObligation>,

    pub nft_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        // INVARIANT: Associated Token Account (ATA) check.
        // We verify the vault is actually owned by the PDA obligation.
        associated_token::authority = obligation,
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program,
    )]
    pub vault_nft_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub host_nft_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_2022_program: Program<'info, Token2022>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<SettleBooking>) -> Result<()> {
    // ---------------------------------------------------------
    // 1. THE TEMPORAL GUARD (The Speedometer)
    // ---------------------------------------------------------
    // WHY: Solana's 'Clock' sysvar provides the only trusted timestamp.
    // RULE: We cannot release collateral until the rental contract expires.
    require!(
        ctx.accounts.clock.unix_timestamp >= ctx.accounts.obligation.end_date,
        ErrorCode::BookingNotYetEnded
    );

    // ---------------------------------------------------------
    // 2. THE SIGNER SEEDS (The Virtual Key)
    // ---------------------------------------------------------
    // WHY: The 'obligation' PDA owns the NFT, but a PDA has no private key.
    // RULE: To authorize a CPI, the program must provide the seeds used to 
    // generate that PDA. The runtime validates these seeds + bump.
    let mint_key = ctx.accounts.nft_mint.key();
    let seeds = &[
        b"obligation",
        mint_key.as_ref(),
        &[ctx.accounts.obligation.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    // ---------------------------------------------------------
    // 3. THE TRANSFER CPI (Physical Move)
    // ---------------------------------------------------------
    // WHY: 'transfer_checked' is a Token-2022 requirement for safety.
    // RULE: It ensures the decimals (0 for NFTs) match the Mint's definition.
    let cpi_program = ctx.accounts.token_2022_program.to_account_info();
    let cpi_accounts = TransferChecked {
        from: ctx.accounts.vault_nft_ata.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.host_nft_ata.to_account_info(),
        authority: ctx.accounts.obligation.to_account_info(), 
    };

    // 'new_with_signer' injects our virtual signature into the CPI.
    token_2022::transfer_checked(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
        1, 
        0, 
    )?;

    // ---------------------------------------------------------
    // 4. STATE FINALIZATION (The Logbook Update)
    // ---------------------------------------------------------
    // WHY: This is the "Exit" transformation. 
    // RULE: Mutate state AFTER the CPI succeeds to ensure atomicity.
    let obligation = &mut ctx.accounts.obligation;
    obligation.is_locked = false;
    obligation.is_settled = true;

    msg!("Race Complete: NFT returned to Host. Obligation Settled.");
    Ok(())
}
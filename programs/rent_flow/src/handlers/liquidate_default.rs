use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};
use anchor_spl::token_2022::{self, Token2022, TransferChecked};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::BookingObligation;
use crate::error::ErrorCode;
use crate::state::PoolVault;

#[derive(Accounts)]
pub struct LiquidateDefault<'info> {
    #[account(mut)]
    pub liquidator: Signer<'info>,

    #[account(
        mut,
        seeds = [b"obligation", nft_mint.key().as_ref()],
        bump = obligation.bump,
        // RULE: Only liquidate if not already settled and past due
        constraint = !obligation.is_settled @ ErrorCode::AlreadySettled,
    )]
    pub obligation: Account<'info, BookingObligation>,

    pub nft_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = obligation,
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program,
    )]
    pub vault_nft_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = liquidator,
        associated_token::authority = pool_vault,
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program,
    )]
    pub pool_nft_ata: InterfaceAccount<'info, TokenAccount>,

    pub pool_vault: Account<'info, PoolVault>,
    
    pub token_2022_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

pub fn handler(ctx: Context<LiquidateDefault>) -> Result<()> {
    let clock = &ctx.accounts.clock;
    let obligation = &mut ctx.accounts.obligation;

    // 1. THE GRACE PERIOD SENSOR (7 days expressed in seconds)
    const GRACE_PERIOD: i64 = 60 * 60 * 24 * 7; 
    let liquidation_threshold = obligation.end_date.checked_add(GRACE_PERIOD).unwrap();

    require!(
        clock.unix_timestamp > liquidation_threshold,
        ErrorCode::GracePeriodNotOver
    );

    // 2. THE SEIZURE (PDA Signing)
    let mint_key = ctx.accounts.nft_mint.key();
    let seeds = &[
        b"obligation",
        mint_key.as_ref(),
        &[obligation.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    // Move the "Sportscar" from the Host's vault to the Investor's Pool
    token_2022::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_2022_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.vault_nft_ata.to_account_info(),
                mint: ctx.accounts.nft_mint.to_account_info(),
                to: ctx.accounts.pool_nft_ata.to_account_info(),
                authority: obligation.to_account_info(),
            },
            signer_seeds,
        ),
        1, 0,
    )?;

    // 3. EXIT: Mark as Default
    obligation.is_settled = true; // Prevents future settlement attempts
    // obligation.status = Status::Defaulted; 

    msg!("Liquidation Complete: Asset Seized for Investors.");
    Ok(())
}
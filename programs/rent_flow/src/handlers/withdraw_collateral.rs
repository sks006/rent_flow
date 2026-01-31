use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};
use anchor_spl::token_2022::Token2022;
use anchor_spl::associated_token::AssociatedToken;
use crate::state::BookingObligation;
use crate::error::ErrorCode;


#[derive(Accounts)]
pub struct WithdrawCollateral<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

  #[account(
        mut,
        seeds = [b"obligation", nft_mint.key().as_ref()],
        bump = obligation.bump,
        // MUST be settled (Payment verified)
        constraint = obligation.is_settled @ ErrorCode::NotYetSettled,
        // MUST be unlocked (Lien/Rental period finished)
        constraint = !obligation.is_locked @ ErrorCode::ObligationStillLocked,
        // MUST be the original host
        constraint = obligation.host_wallet == host.key() @ ErrorCode::NotAuthorizedOwner,
        // OPTIONAL: Reclaim rent by closing the account
        close = host 
    )]
    pub obligation: Account<'info, BookingObligation>,

    pub nft_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::authority = obligation, // The PDA currently holds the title
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program,
    )]
    pub vault_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = host,
        associated_token::authority = host, // The User's driveway
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program,
    )]
    pub host_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_2022_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<WithdrawCollateral>) -> Result<()> {
    // ---------------------------------------------------------
    // 1. THE SIGNER SEEDS (The Virtual Key)
    // ---------------------------------------------------------
    let mint_key = ctx.accounts.nft_mint.key();
    let seeds = &[
        b"obligation",
        mint_key.as_ref(),
        &[ctx.accounts.obligation.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    // ---------------------------------------------------------
    // 2. THE TRANSFER CPI (Physical Move)
    // ---------------------------------------------------------
    let cpi_program = ctx.accounts.token_2022_program.to_account_info();
    let cpi_accounts = anchor_spl::token_2022::TransferChecked {
        from: ctx.accounts.vault_ata.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.host_ata.to_account_info(),
        authority: ctx.accounts.obligation.to_account_info(),
    };

    anchor_spl::token_2022::transfer_checked(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
        1,
        0,
    )?;

    msg!("Asset Withdrawn: Collateral returned to Host.");
    Ok(())
}
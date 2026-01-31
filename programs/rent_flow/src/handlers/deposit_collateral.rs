use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self, Token2022, TransferChecked},
    token_interface::{Mint, TokenAccount},
};
use crate::state::BookingObligation;

#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        // CONSTRAINT: The obligation must belong to this host
        constraint = obligation.host_wallet == host.key(),
        // SEEDS: How did we derive the obligation in mint_booking.rs?
        seeds = [b"obligation", nft_mint.key().as_ref()],
        bump = obligation.bump,
    )]
    pub obligation: Account<'info, BookingObligation>,

    pub nft_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub host_nft_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = host,
        // SEEDS: This vault should be owned by the obligation PDA
        associated_token::authority = obligation, 
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program
    )]
    pub vault_nft_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_2022_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<DepositCollateral>) -> Result<()> {
    // 1. Trace the Data: Identify the Host (Signer) and the Target Vault
    let token_program = ctx.accounts.token_2022_program.to_account_info();
    
    // 2. Transformation: Create the CPI Context for a Transfer
    let cpi_accounts = TransferChecked {
        from: ctx.accounts.host_nft_ata.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.vault_nft_ata.to_account_info(),
        authority: ctx.accounts.host.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(token_program, cpi_accounts);

    // 3. Execution: Move the NFT (Amount: 1, Decimals: 0)
    token_2022::transfer_checked(cpi_ctx, 1, 0)?;

    // 4. State Update: The Logical Lock
    let obligation = &mut ctx.accounts.obligation;
    obligation.is_locked = true;

    msg!("Asset Secured: Booking {} is now locked collateral.", obligation.booking_id);
    Ok(())
}

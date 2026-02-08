use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::{Position, PoolVault};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct WithdrawLiquidity<'info> {
    #[account(mut)]
    pub investor: Signer<'info>,

    #[account(
        init,
        payer = investor,
        space = 8 + Position::INIT_SPACE,
        seeds = [b"position", investor.key().as_ref()],
        bump
    )]
    pub position: Account<'info, Position>,

    #[account(
        mut,
        seeds = [b"pool_vault"],
        bump = pool_vault.bump,
    )]
    pub pool_vault: Account<'info, PoolVault>,

    #[account(
        mut,
        associated_token::authority = investor,
        associated_token::mint = usdc_mint,
    )]
    pub investor_usdc_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::authority = pool_vault,
        associated_token::mint = usdc_mint,
    )]
    pub pool_usdc_ata: InterfaceAccount<'info, TokenAccount>,

    pub usdc_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum InvestmentTerm {
    OneMonth,
    ThreeMonths,
    SixMonths,
    TwelveMonths,
}

pub fn handler(ctx: Context<WithdrawLiquidity>) -> Result<()> {
    // [TRANSFORMATION] 1. Extract state to local variables
    // We do this to satisfy the borrow checker and avoid working on a 'closed' account
    let principal = ctx.accounts.position.principal;
    let realized_profit = ctx.accounts.position.realized_profit;
    let pool_bump = ctx.accounts.pool_vault.bump;
    let usdc_decimals = ctx.accounts.usdc_mint.decimals;

    let total_payout = principal
        .checked_add(realized_profit)
        .ok_or(ErrorCode::MathOverflow)?;

    // [SIGNER SEEDS] 2. The PoolVault PDA must sign the transfer
    let seeds = &[
        b"pool_vault".as_ref(),
        &[pool_bump],
    ];
    let signer_seeds = &[&seeds[..]];

    // [CPI] 3. Execute the Transfer
    // Move the fuel (USDC) from the Pool to the Investor's driveway
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = TransferChecked {
        from: ctx.accounts.pool_usdc_ata.to_account_info(),
        mint: ctx.accounts.usdc_mint.to_account_info(),
        to: ctx.accounts.investor_usdc_ata.to_account_info(),
        authority: ctx.accounts.pool_vault.to_account_info(),
    };

    transfer_checked(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
        total_payout,
        usdc_decimals,
    )?;

    // [STATE] 4. Update the Global Pool state
    // The PoolVault survives this instruction, so we mutate it.
    let pool_vault = &mut ctx.accounts.pool_vault;
    pool_vault.total_liquidity_tracked = pool_vault.total_liquidity_tracked
        .checked_sub(total_payout)
        .ok_or(ErrorCode::MathOverflow)?;

    // NOTE: We do NOT need to set position.principal = 0; 
    // The 'close = investor' constraint wipes the account data automatically.

    msg!("Liquidity Withdrawn: {} USDC (Principal + Profit Share)", total_payout);
    Ok(())
}
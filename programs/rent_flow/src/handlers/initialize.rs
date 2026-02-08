use anchor_lang::prelude::*;
use crate::state::{IntegratorConfig, PoolVault};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + IntegratorConfig::INIT_SPACE,
        seeds = [b"integrator", integration_wallet.key().as_ref()],
        bump
    )]
    pub integration_config: Account<'info, IntegratorConfig>,

    /// CHECK: Used only for seed derivation
    pub integration_wallet: UncheckedAccount<'info>,
    
    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + PoolVault::INIT_SPACE,
        seeds = [b"pool_vault"],
        bump
    )]
    pub pool_vault: Account<'info, PoolVault>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    msg!("Starting initialization...");
    let config = &mut ctx.accounts.integration_config;
    config.authority = ctx.accounts.authority.key();
    config.is_active = true;
    config.bump = ctx.bumps.integration_config;
    msg!("Config set. Authority: {}", config.authority);

    let pool_vault = &mut ctx.accounts.pool_vault;
    pool_vault.bump = ctx.bumps.pool_vault;
    msg!("Pool Vault set. Bump: {}", pool_vault.bump);

    msg!("Integrator Config Initialized Success");
    Ok(())
}

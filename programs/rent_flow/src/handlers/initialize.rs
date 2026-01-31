use anchor_lang::prelude::*;
use crate::state::IntegratorConfig;

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

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let config = &mut ctx.accounts.integration_config;
    config.authority = ctx.accounts.authority.key();
    config.is_active = true;
    config.bump = ctx.bumps.integration_config;

    msg!("Integrator Config Initialized: {}", config.authority);
    Ok(())
}

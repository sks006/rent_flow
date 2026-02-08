use anchor_lang::prelude::*;

declare_id!("29u6Rxe7tsrWFoUifHfvyYMqn3n9CBe5BmzuiPLk3CEJ");

pub mod constants;
pub mod error;
pub mod handlers;
pub mod state;

#[allow(ambiguous_glob_reexports)]
pub use handlers::*;
pub use state::*;

#[program]
pub mod rent_flow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        handlers::initialize::handler(ctx)
    }

    pub fn add_token(ctx: Context<InitializeSupportedToken>, ltv_bps: u16) -> Result<()> {
        handlers::init_vault::handler(ctx, ltv_bps)
    }

    pub fn mint_booking(ctx: Context<MintBooking>, booking_data: BookingProof) -> Result<()> {
        handlers::mint_booking::handler(ctx, booking_data)
    }

    pub fn deposit_collateral(ctx: Context<DepositCollateral>, funding_amount: u64) -> Result<()> {
        handlers::deposit_collateral::handler(ctx, funding_amount)
    }

    pub fn settle_booking(ctx: Context<SettleBooking>) -> Result<()> {
        handlers::settle_booking::handler(ctx)
    }

    pub fn withdraw_liquidity(ctx: Context<WithdrawLiquidity>) -> Result<()> {
        handlers::withdraw_liquidity::handler(ctx)
    }

    pub fn liquidate_default(ctx: Context<LiquidateDefault>) -> Result<()> {
        handlers::liquidate_default::handler(ctx)
    }
}

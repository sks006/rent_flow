use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod handlers;
pub mod state;

// These re-exports can be helpful but aren't strictly necessary
pub use constants::*;
pub use state::*;
pub use handlers::*;



declare_id!("CAgTPGTnb17aTrdz8Z9DWnDYK2HDiR7K5iSJiTY2CGFS");

#[program]
pub mod rent_flow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        handlers::initialize::handler(ctx)
    }

    pub fn add_token(ctx: Context<InitializeSupportedToken>, ltv: u16) -> Result<()> {
        handlers::init_vault::handler(ctx, ltv)
    }

    // Add other instruction handlers
    pub fn mint_booking(ctx: Context<MintBooking>, booking_data: BookingProof) -> Result<()> {
        handlers::mint_booking::handler(ctx, booking_data)
    }

    pub fn lock_cycle(ctx: Context<LockCycle>) -> Result<()> {
        handlers::lock_cycle::handler(ctx)
    }

    // Add more handlers for deposit_collateral, withdraw_liquidity, etc.
}
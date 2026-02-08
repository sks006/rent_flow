use anchor_lang::prelude::*;
use crate::state::BookingObligation;
use crate::error::ErrorCode;

use anchor_spl::token_interface::Mint;



#[derive(Accounts)]
pub struct LockCycle<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
       seeds = [b"obligation", nft_mint.key().as_ref()],
       bump = booking_obligation.bump, 
        // Rule: Ensure the host signing IS the host stored in the data
        constraint = booking_obligation.host_wallet == host.key() @ ErrorCode::NotHubOwner
    )]
    pub booking_obligation: Account<'info, BookingObligation>,

    pub nft_mint: InterfaceAccount<'info, Mint>,
}

pub fn handler(ctx: Context<LockCycle>) -> Result<()> {
    // 1. Point to the data account in memory
    let obligation = &mut ctx.accounts.booking_obligation;
    
    // 2. Rule: Validate state before mutation
    // If car is already in the 'Locked' garage, trigger an error
    require!(!obligation.is_locked, ErrorCode::AlreadyLocked);
    
    // 3. Transformation: Update the state
    obligation.is_locked = true;

    msg!("Sportscar Asset Locked: {}", obligation.booking_id);
    
    Ok(()) // 4. Exit: Runtime persists 'obligation.is_locked = true' to the ledger
}
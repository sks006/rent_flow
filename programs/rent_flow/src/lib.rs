pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("CAgTPGTnb17aTrdz8Z9DWnDYK2HDiR7K5iSJiTY2CGFS");

#[program]
pub mod rent_flow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    pub fn add_token(ctx:Context<InitializeSupportedToken>,ltv:u16)->Result<()>{
        InitializeSupportedToken::handler(ctx)
    }
}

use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct WithdrawLiquidity {}

pub fn handler(_ctx: Context<WithdrawLiquidity>) -> Result<()> {
    Ok(())
}

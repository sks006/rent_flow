use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DepositCollateral {}

pub fn handler(_ctx: Context<DepositCollateral>) -> Result<()> {
    Ok(())
}

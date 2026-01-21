use anchor_lang::prelude::*;

#[account]
pub struct BookingObligation{
host:Pubkey,
borrow:Pubkey,
value:u64,
borrowed_amount:u64,
locked_status:bool,
expiry:i64,
}

impl BookingObligation {
    pub const SIZE:usize=32+32+8+8+1+8;
}
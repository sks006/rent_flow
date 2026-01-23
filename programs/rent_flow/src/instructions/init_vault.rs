use anchor_lang::prelude::*;



#[derive(Accounts)]

pub struct InitializeSupportedToken<'info>{

    #[account(mut)]
    admin:Signer<'info>,

    mint:Account<'info, Mint>,

 // Hint for the Vault constraint:
#[account(
    init,
    payer = admin,
    token::mint = mint,
    token::authority = supported_token, // The metadata account is the boss of the vault
    
    
)]

}



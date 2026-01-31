/* STEP 1: Import the Flexible Traits
  We use 'anchor_spl::token_interface' instead of 'anchor_spl::token'.
  This provides InterfaceAccount and TokenInterface, which allow
  our program to interact with both Token and Token-2022 programs.
*/
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{ Mint, TokenAccount, TokenInterface };
use crate::state::SupportedToken;

/* STEP 2: Define the Validation Struct (InitializeSupportedToken)
  We use Interface types to ensure compatibility with Token-2022 extensions.
  
  
  A. The Admin (Signer): 
     Remains a standard Signer. Marked 'mut' to pay for account allocation.
     
  B. The Mint (InterfaceAccount<'info, Mint>): 
     Using InterfaceAccount allows this to be a legacy Mint or a Token-2022 Mint.
     
  C. The SupportedToken PDA (Account<'info, SupportedToken>):
     This is your custom state account from state.rs.
     Rules:
     - 'init': Allocates the account on-chain.
     - 'space': 8 (discriminator) + SupportedToken::SIZE.
     - 'seeds': Hardcoded string + the mint's public key for uniqueness.
     
  D. The Token Vault (InterfaceAccount<'info, TokenAccount>):
     - 'init': Creates the vault.
     - 'token::mint': Links the vault to our mint.
     - 'token::authority': Sets the 'supported_token' PDA as the owner.
     - 'token::token_program': CRITICAL. Links the vault to the specific 
        program (Token or Token-2022) identified in Step E.
     
  E. The Flexible Token Program:
     Using 'Interface<'info, TokenInterface>' allows the caller to pass 
     either Token Program ID or Token-2022 Program ID.
*/
#[derive(Accounts)]
pub struct InitializeSupportedToken<'info> {
    #[account(mut)]
    admin: Signer<'info>,
    mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        payer = admin,
        space = SupportedToken::SIZE,
        seeds = [b"vault", mint.key().as_ref()],
      bump  
        
    )
    
    ]
    pub supported_token: Account<'info, SupportedToken>,

    #[account(
        init,
        payer = admin,
        token::mint = mint,
        token::authority = supported_token, // The PDA controls the funds 🏦
        token::token_program = flexible_token_program
    )]
    pub token_vault: InterfaceAccount<'info, TokenAccount>,

    pub flexible_token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

/* STEP 3: Implement the Handler Function
  The handler logic remains lean, focusing on persisting the configuration:
  
  A. Access the account: let supported_token = &mut ctx.accounts.supported_token;
  
  B. Data Assignment:
     - Set 'supported_token.mint' to the mint's key.
     - Set 'supported_token.ltv_bps' from the instruction argument.
     - Set 'supported_token.bump' from the context.
     - Set 'supported_token.is_active' to true.
     
  C. Exit: return Ok(());
*/
pub fn handler(ctx: Context<InitializeSupportedToken>, ltv_bps: u16) -> Result<()> {
    // 1. Reference the account from the context
    let supported_token = &mut ctx.accounts.supported_token;
    
    // 2. Assign the data
    supported_token.mint = ctx.accounts.mint.key();
    supported_token.ltv_bps = ltv_bps; // Use the passed argument!
    supported_token.is_active = true;
    
    // 3. Access the specific bump discovered by Anchor
    supported_token.bump = ctx.bumps.supported_token;
    
    Ok(())
}


// 1. State Linking 🔗
// Think of state.rs as the Database Schema and init_vault.rs as the API Endpoint.

// The Connection: When you write let support_token = &mut ctx.accounts.supported_token;, you are telling the Solana runtime: "Go to the address derived from these seeds, load the raw bytes stored there, and map them onto my SupportedToken struct."

// The Logic: Your handler doesn't just "calculate" values; it mutates the state. By assigning support_token.ltv_bps = 5000;, you are physically changing the bits on the ledger so that the next instruction (like a loan request) can read them and know the rules.

// 2. The Role of the Struct 🛡️
// The InitializeSupportedToken struct is a Declarative Security Guard.

// Validation: Before your handler code ever runs, Anchor performs a massive checklist. It checks:

// Did the admin actually sign? ✍️

// Does the mint account actually exist? 🪙

// Is the supported_token address correctly derived from the seeds? 🔑

// Initialization: The init constraint is special. It tells the System Program to create a new account, allocate the space, and transfer the "Rent" (Lamports) from the payer.

// 3. The "Manual" Alternative 🕹️
// If you didn't create that InitializeSupportedToken struct, you would have to write "Raw Solana" code. This involves:

// Manually calling next_account_info for every single account.

// Writing manual if statements to check every signature.

// Manually calling the System Program to create the account.

// Manually checking that the PDA seeds match.

// Without the struct, your code would be 5x longer and 10x more likely to have a security vulnerability. Anchor's structs turn "Checklist Security" into "Type-System Security."
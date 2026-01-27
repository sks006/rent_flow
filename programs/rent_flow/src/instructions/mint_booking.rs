use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::instructions as instructions_sysvar;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self, Token2022, MintTo},
    token_interface::{Mint, TokenAccount},
};
use crate::state::{IntegratorConfig, BookingObligation};
use crate::error::ErrorCode;

// ============================================
// CONTEXT: THE STAGE
// ============================================

#[derive(Accounts)]
pub struct MintBooking<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    // [AUTHORITY] The Integrator Config acts as the "Manager" of this protocol.
    // It holds the authority to sign for the Mint (mint authority).
    #[account(
        seeds = [b"integrator", integration_wallet.key().as_ref()],
        bump = integration_config.bump,
        constraint = integration_config.is_active @ ErrorCode::IntegratorNotAuthorized
    )]
    pub integration_config: Account<'info, IntegratorConfig>,

    /// CHECK: Used only for seed derivation
    pub integration_wallet: UncheckedAccount<'info>,

    // [THE VESSEL] The uninitialized Mint account. 
    // This will become the NFT representing the booking.
    #[account(mut, signer)]
    pub nft_mint: InterfaceAccount<'info, Mint>,

    // [THE VAULT] The Host's pocket where the NFT will live.
    // We use "init_if_needed" to be friendly to first-time users.
    #[account(
        init_if_needed,
        payer = host,
        associated_token::authority = host,
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program
    )]
    pub host_ata: InterfaceAccount<'info, TokenAccount>, 

    // [THE MEMORY] This PDA stores the "Soul" of the asset—data that doesn't fit on the token.
    // Start date, end date, value, etc. It is inextricably linked to the Mint Address.
    #[account(
        init,
        payer = host,
        space = 8 + BookingObligation::INIT_SPACE,
        seeds = [b"obligation", nft_mint.key().as_ref()],
        bump
    )]
    pub booking_obligation: Account<'info, BookingObligation>,

    // [THE INSPECTOR] This Sysvar allows us to look at other instructions in this transaction.
    // We need this to verify the Ed25519 signature "truth" from the Oracle.
    /// CHECK: Validated by constraint check in handler
    #[account(address = instructions_sysvar::ID)]
    pub instructions: AccountInfo<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_2022_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// [THE BLUEPRINT] The raw data packet coming from the outside world.
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BookingProof {
    pub booking_id: String,
    pub amount: u64,
    pub start_date: i64,
    pub end_date: i64,
    pub host_wallet: Pubkey,
    pub oracle_pubkey: Pubkey,
}

#[event]
pub struct BookingMinted {
    pub booking_id: String,
    pub nft_mint: Pubkey,
    pub host: Pubkey,
    pub value: u64,
    pub expiry: i64,
}

// ============================================
// THE LOGIC: BIRTH OF AN ASSET
// ============================================

pub fn handler(ctx: Context<MintBooking>, booking_data: BookingProof) -> Result<()> {
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;

    // --------------------------------------------
    // PHASE 1: VERIFYING THE TRUTH (Oracle Check)
    // --------------------------------------------
    
    // [LOGIC] Temporal Sanity Check
    // We cannot tokenize a booking that has already happened.
    require!(booking_data.start_date > current_timestamp, ErrorCode::BookingAlreadyStarted);

    // [DATA PIPELINE] Reconstructing the Sealed Message
    // The Oracle signed a specific byte array off-chain. We must recreate that 
    // exact array here to verify the signature matches the data provided.
    let mut message_buffer = Vec::new();
    booking_data.booking_id.serialize(&mut message_buffer)?; 
    message_buffer.extend_from_slice(&booking_data.amount.to_le_bytes());
    message_buffer.extend_from_slice(&booking_data.start_date.to_le_bytes());
    message_buffer.extend_from_slice(&booking_data.end_date.to_le_bytes());
    message_buffer.extend_from_slice(booking_data.host_wallet.as_ref());

    // [INTROSPECTION] Looking into the Past
    // We check the "Instructions Sysvar" to see the instruction that ran *just before* this one.
    // That previous instruction claims to be an Ed25519 signature verification.
    let ixs = ctx.accounts.instructions.to_account_info();
    let current_index = instructions_sysvar::load_current_index_checked(&ixs)?;
    
    // Safety Check: Ensure there actually IS a previous instruction.
    require_gte!(current_index, 1, ErrorCode::InvalidInstructionIndex);
    
    // Load the previous instruction (Ed25519)
    let ed25519_ix = instructions_sysvar::load_instruction_at_checked(
        (current_index - 1) as usize, 
        &ixs
    )?;

    // Verify the previous program was indeed the Ed25519 Native Program
    require_keys_eq!(ed25519_ix.program_id, anchor_lang::solana_program::ed25519_program::ID, ErrorCode::InvalidProgramId);

    // NOTE: At this point in production code, you would parse `ed25519_ix.data` 
    // to ensure the signature matches `message_buffer` and `booking_data.oracle_pubkey`.
    // If that passes, we accept `booking_data` as THE TRUTH.

    // --------------------------------------------
    // PHASE 2: FORGING THE VESSEL (Token-2022)
    // --------------------------------------------
    
    // The Program ID that will govern the rules of this token (likely this program itself).
    let compliance_hook_program_id = ctx.program_id; 

    // [CONSTRUCTION] Installing the "Conscience" (Transfer Hook)
    // Before we even create the Mint, we inject the Transfer Hook extension.
    // This tells the token: "Before you move, call 'compliance_hook_program_id' to ask for permission."
    token_2022::initialize_transfer_hook(
        CpiContext::new(
            ctx.accounts.token_2022_program.to_account_info(),
            token_2022::InitializeTransferHook {
                mint: ctx.accounts.nft_mint.to_account_info(),
            }
        ),
        Some(ctx.accounts.integration_config.key()), // Authority to update the hook later
        Some(compliance_hook_program_id)             // The Program ID to call back to
    )?;

    // [CONSTRUCTION] Initializing the Mint
    // We create a token with 0 decimals (Non-Fungible).
    // The `integration_config` (our PDA) keeps the Mint Authority, so only WE can mint/burn.
    token_2022::initialize_mint2(
        CpiContext::new(
            ctx.accounts.token_2022_program.to_account_info(),
            token_2022::InitializeMint2 {
                mint: ctx.accounts.nft_mint.to_account_info(),
            }
        ),
        0, // Decimals: 0 (NFT)
        &ctx.accounts.integration_config.key(), // Mint Auth
        Some(&ctx.accounts.integration_config.key()) // Freeze Auth
    )?;

    // [ACTIVATION] Linking the Hook
    // Now that the mint exists, we formally register the Transfer Hook.
    // We need our PDA seeds to sign this administrative action.
    let signer_seeds: &[&[u8]] = &[
        b"integrator",
        ctx.accounts.integration_wallet.key().as_ref(),
        &[ctx.accounts.integration_config.bump],
    ];

    token_2022::set_transfer_hook(
        CpiContext::new_with_signer(
            ctx.accounts.token_2022_program.to_account_info(),
            token_2022::SetTransferHook {
                mint: ctx.accounts.nft_mint.to_account_info(),
                authority: ctx.accounts.integration_config.to_account_info(),
            },
            &[signer_seeds]
        ),
        compliance_hook_program_id
    )?;

    // --------------------------------------------
    // PHASE 3: GIVING IT LIFE (Minting & State)
    // --------------------------------------------

    // [MINTING] The Breath of Life
    // We mint exactly ONE token into the Host's wallet.
    // This token is now the legal representation of the booking on-chain.
    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_2022_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.nft_mint.to_account_info(),
                to: ctx.accounts.host_ata.to_account_info(),
                authority: ctx.accounts.integration_config.to_account_info(),
            },
            &[signer_seeds]
        ),
        1 // Amount: 1
    )?;

    // [PERSISTENCE] Writing the Memory
    // The token is just an ID. The details (Value, Dates, LTV) go into the Obligation Account.
    let obligation = &mut ctx.accounts.booking_obligation;
    
    // [FINANCE] Calculating Loan-to-Value (LTV)
    // We determine how much liquidity this asset can unlock (e.g., 50% of booking value).
    let ltv_basis_points: u64 = 5000; // 50.00%
    let principal_calculation = booking_data.amount
        .checked_mul(ltv_basis_points)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::MathOverflow)?;

    // Storing the facts. These are now immutable relative to the booking ID.
    obligation.booking_id = booking_data.booking_id.clone();
    obligation.booking_value = booking_data.amount;
    obligation.max_principal = principal_calculation;
    obligation.start_date = booking_data.start_date;
    obligation.end_date = booking_data.end_date;
    obligation.host_wallet = booking_data.host_wallet;
    obligation.integrator_wallet = ctx.accounts.integration_wallet.key();
    obligation.nft_mint = ctx.accounts.nft_mint.key();
    obligation.is_locked = false;  // Asset starts unlocked
    obligation.is_settled = false; // Asset starts unsettled

    // --------------------------------------------
    // PHASE 4: ANNOUNCEMENT (Event Emission)
    // --------------------------------------------

    // [PUBLIC BROADCAST]
    // We emit an event so indexers (like The Graph or Helius) know a new RWA has been born.
    emit!(BookingMinted {
        booking_id: booking_data.booking_id,
        nft_mint: ctx.accounts.nft_mint.key(),
        host: ctx.accounts.host.key(),
        value: booking_data.amount,
        expiry: booking_data.end_date,
    });

    msg!("Booking Minted Successfully: {}", ctx.accounts.nft_mint.key());

    Ok(())
}
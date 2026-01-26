// // ============================================
// // STEP 1: VALIDATE ORACLE PROOF
// // Rule: Deterministic Verification
// // ============================================
use anchor_lang::prelude::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct MintBooking<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        seeds = [b"integrator", integration_wallet.key().as_ref()],
        bump = integration_config.bump,
        constraint = integration_config.is_active @ ErrorCode::IntegratorNotAuthorized
    )]
    pub integration_config: Account<'info, IntegratorConfig>,

    pub integration_wallet: SystemAccount<'info>,

    #[account(
        init,
        payer = host,
        // Rule: Dynamic Space Invariant (Requires importing spl_token_2022::extension::ExtensionType)
        space = ExtensionType::get_account_len::<Mint>(&[ExtensionType::TransferHook]),
        owner = token_2022_program.key()
    )]
    pub nft_mint: Signer<'info>,

    #[account(
        init,
        payer = host,
        space = 8 + BookingObligation::INIT_SPACE, // Rule: Account Size Invariant
        seeds = [b"obligation", nft_mint.key().as_ref()], // Rule: Identity Invariance
        bump
    )]
    pub booking_obligation: Account<'info, BookingObligation>,

    pub token_2022_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// // Rule: Temporal Validity

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct BookingProof {
    pub booking_id: String, // Unique identifier from booking platform
    pub amount: u64, // Booking value in lamports
    pub start_date: i64, // Booking start timestamp
    pub end_date: i64, // Booking end timestamp
    pub host_wallet: Pubkey, // Host's wallet address
    pub signature: [u8; 64], // Oracle's ed25519 signature
    pub oracle_pubkey: Pubkey, // Oracle that signed this proof
    // Rule (Serialization Invariance): The message buffer used for signature
    // verification must exactly match the Oracle's off-chain format.
}

// IF current_timestamp > booking_data.start_date:
//     ERROR: BookingAlreadyStarted // Cannot factor a booking that has already begun
pub fn handler(ctx: Context<MintBooking>, booking_data: BookingProof) -> Result<()> {
    // Access the network clock
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;
    // Rule: Temporal Validity
    // We must ensure the booking hasn't started yet.
    require!(booking_data.start_date > current_timestamp, ErrorCode::BookingAlreadyStarted);
    let mut message_buffer = Vec::new();

    // Rule: Borsh String Serialization
    // We must serialize the string with its length prefix
    booking_data.booking_id.serialize(&mut message_buffer)?;

    // Rule: Fixed-Length Packing
    // Use extend_from_slice for primitive types
    message_buffer.extend_from_slice(&booking_data.amount.to_le_bytes());
    message_buffer.extend_from_slice(&booking_data.start_date.to_le_bytes());
    message_buffer.extend_from_slice(&booking_data.end_date.to_le_bytes());
    message_buffer.extend_from_slice(booking_data.host_wallet.as_ref());
    // Pseudocode for the data comparison
    let pubkey_offset = u16::from_le_bytes(data[8..10].try_into().unwrap()) as usize;
    let message_offset = u16::from_le_bytes(data[12..14].try_into().unwrap()) as usize;
    let message_size = u16::from_le_bytes(data[14..16].try_into().unwrap()) as usize;

    // Rule: Identity Invariance
    require_keys_eq!(
        Pubkey::new_from_array(data[pubkey_offset..pubkey_offset + 32].try_into().unwrap()),
        authorized_oracle_pubkey,
        ErrorCode::InvalidOracleKey
    );

    // Rule: Data Integrity
    require!(
        &data[message_offset..message_offset + message_size] == message_buffer.as_slice(),
        ErrorCode::OracleMessageMismatch
    );
    // Rule: Semantic Linkage
    // Ensure the precompile is actually looking at the key we are checking
    let header_pk_offset = u16::from_le_bytes(data[4..6].try_into().unwrap()) as usize;

    require_eq!(
        header_pk_offset,
        16, // The hardcoded offset where we expect the Oracle key
        ErrorCode::InvalidOffset
    );
    Ok(())
}

// ============================================
// STEP 2: CALCULATED ACCOUNT ALLOCATION
// Rule (Dynamic Space): Use ExtensionType helper to calculate exact bytes needed
// ============================================

// 2.1: Calculate Mint account size with TransferHook extension
// Use: ExtensionType::get_account_len::<Mint>(&[ExtensionType::TransferHook])

// 2.2: Calculate Obligation account size
// Use: 8 + BookingObligation::INIT_SPACE (discriminator + state)

// 2.3: Runtime allocates correct lamports for rent-exemption
// No constants: size calculated dynamically at runtime

// ============================================
// STEP 3: TOKEN-2022 ATOMIC INITIALIZATION
// Transformation: nft_mint becomes a specialized asset
// ============================================

// 3.1: Rule (Order of Operations): MUST initialize TransferHook BEFORE InitializeMint
// Use: initialize_with_transfer_hook() extension-first pattern

// 3.2: Initialize mint with extensions
// Set: decimals = 0 (NFT), mint_authority = program PDA, freeze_authority = program PDA

// 3.3: Rule (Authority Isolation): Mint authority set to Program PDA
// No private key can ever mint these tokens - only program-controlled operations

// 3.4: Set transfer hook program ID to compliance_hook program
// Links: nft_mint -> compliance_hook program for all transfers

// ============================================
// STEP 4: ASSET CREATION & DATA PERSISTENCE
// Data Flow: host_ata → mint_to → BookingObligation state
// ============================================

// 4.1: Initialize host's Associated Token Account (if missing)
// Use: create_associated_token_account_idempotent pattern

// 4.2: Mint exactly 1 token to host's ATA
// Invariant: One booking = One NFT token (amount: 1)

// 4.3: Initialize BookingObligation PDA
// PDA seeds: ["obligation", nft_mint.key()]
// Bump: stored for future verification

// 4.4: Set obligation financials with checked arithmetic
// principal_due = booking_data.amount.checked_mul(LTV_RATIO).checked_div(100)
// Use: .checked_mul() and .checked_div() for safety

// 4.5: Set all BookingObligation fields
// booking_id, booking_value, start_date, end_date, expiry_date
// host_wallet, integrator_wallet, locked_status = false, is_settled = false

// ============================================
// STEP 5: EVENT EMISSION & EXIT
// Transformation: Emit event for off-chain indexers
// ============================================

// 5.1: Emit BookingMinted event with all relevant data
// Fields: booking_id, nft_mint, host, value, expiry

// 5.2: Rule (Finality): All state must be consistent before return
// Verify: All accounts updated, no partial writes

// 5.3: Return Ok(()) - Transaction complete

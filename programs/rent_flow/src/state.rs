// Step 1: Import the necessary Anchor framework components
// Anchor provides prelude that includes commonly used types and traits
use anchor_lang::prelude::*;

// Step 2: Define the account structure using the #[account] attribute macro
// This macro tells Anchor that this struct represents an on-chain account
#[account]
pub struct BookingObligation {
    // Step 3: Define the account fields
    
    // Pubkey is a public key type (32 bytes) - stores the host's wallet address
    host: Pubkey,
    
    // Pubkey (32 bytes) - stores the borrower's wallet address  
    mint: Pubkey,
    
    // u64 (8 bytes) - unsigned 64-bit integer for the total value/amount
    value: u64,
    
    // u64 (8 bytes) - unsigned 64-bit integer for the amount currently borrowed
    borrowed_amount: u64,
    
    // bool (1 byte) - boolean flag indicating if the obligation is locked
    // true = locked/cannot be modified, false = active/can be modified
    locked_status: bool,
    
    // i64 (8 bytes) - signed 64-bit integer for timestamp expiration
    // Typically represents Unix timestamp when the booking obligation expires
    expiry: i64,
}

// Step 4: Implement methods for the BookingObligation struct
impl BookingObligation {
    // Step 5: Define a constant for the account size
    // This is REQUIRED for #[account] structs in Anchor
    // It tells Anchor how much space to allocate for this account
    
    // Calculate total size: 32 + 32 + 8 + 8 + 1 + 8 = 89 bytes
    // However, Anchor accounts need 8-byte discriminator + space for data
    // The actual calculation should include the 8-byte discriminator
    
    // Correct calculation including Anchor's 8-byte discriminator:
    // 8 (discriminator) + 32 + 32 + 8 + 8 + 1 + 8 = 97 bytes
    pub const SIZE: usize = 8 + 32 + 32 + 8 + 8 + 1 + 8;
    
    // Alternative way to calculate - this is more maintainable:
    // pub const SIZE: usize = 8 + // discriminator
    //     32 + // host
    //     32 + // borrow  
    //     8 +  // value
    //     8 +  // borrowed_amount
    //     1 +  // locked_status
    //     8;   // expiry   
}

#[account]
pub struct SupportedToken {
    // Line 5: Mint address - 32 bytes
    // This is the token mint (e.g., USDC mint, SOL mint)
    // Used to identify which token this configuration is for
    pub mint: Pubkey,
    
    // Line 6: Loan-to-Value ratio in basis points - 2 bytes
    // Basis points = percentage * 100 (e.g., 7500 = 75%)
    // u16 supports values 0-65535 (0% to 655.35%)
    // Example: 5000 = 50% LTV, 7500 = 75% LTV
    pub ltv_bps: u16,
    
    // Line 7: Activation status - 1 byte
    // Boolean flag indicating if this token is currently usable
    // true = token can be used as collateral/borrowed
    // false = token is temporarily disabled
    pub is_active: bool,
    
    // Line 8: PDA bump - 1 byte
    // Critical for PDA (Program Derived Address) validation
    // Stores the bump seed used to create this PDA
    // Used to verify the PDA was created correctly
    pub bump: u8,
}

// Line 10: Implementation block for SupportedToken struct
// Contains methods and constants related to the struct
impl SupportedToken {
    // Line 11: Constant defining the account size - REQUIRED in Anchor
    // This tells Anchor how much space to allocate for this account
    pub const SIZE: usize = 8 + 32 + 2 + 1 + 1;
    //           │     │    │   │   │  │   │
    //           │     │    │   │   │  │   └─ 1 byte for bump (u8)
    //           │     │    │   │   │  └─ 1 byte for is_active (bool)
    //           │     │    │   │   └─ 2 bytes for ltv_bps (u16)
    //           │     │    │   └─ 32 bytes for mint (Pubkey)
    //           │     │    └─ 8 bytes for Anchor discriminator
    //           │     └─ Total size in bytes
    //           └─ Compile-time constant
}
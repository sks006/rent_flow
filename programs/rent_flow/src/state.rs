// Step 1: Import the necessary Anchor framework components
// Anchor provides prelude that includes commonly used types and traits
use anchor_lang::prelude::*;

// Step 2: Define the account structure using the #[account] attribute macro
// This macro tells Anchor that this struct represents an on-chain account
#[account]
#[derive(InitSpace)]
pub struct IntegratorConfig {
    pub bump: u8,
    pub is_active: bool,
    pub authority: Pubkey, // The wallet that can manage this config
}

#[account]
#[derive(InitSpace)]
pub struct BookingObligation {
    // Rule: String limits for safety (Borsh serialization requirement)
    #[max_len(32)] 
    pub booking_id: String, 
    
    pub booking_value: u64,    // Total value of the booking
    pub max_principal: u64,    // Max borrowable amount (calculated via LTV)
    pub borrowed_amount: u64,  // Current debt
    
    pub start_date: i64,       // Booking start
    pub end_date: i64,         // Booking end (expiry)
    
    pub host_wallet: Pubkey,       // The RWA owner
    pub integrator_wallet: Pubkey, // The platform
    pub nft_mint: Pubkey,          // The Token-2022 asset
    
    pub is_locked: bool,   // True if currently used as collateral
    pub is_settled: bool,  // True if booking is completed/paid out
    pub tier: ProfitTier,  // The profit tier for this booking
    
    // Padding for alignment (optional but good practice)
    pub bump: u8,
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
    pub const SIZE: usize = 8 + BookingObligation::INIT_SPACE;
    
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
#[derive(InitSpace)]
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
    
    pub bump: u8,
    // Line 8: PDA bump - 1 byte
    // Critical for PDA (Program Derived Address) validation
    // Stores the bump seed used to create this PDA
    // Used to verify the PDA was created correctly
    _reserved: [u8; 7],
    
}

// Line 10: Implementation block for SupportedToken struct
// Contains methods and constants related to the struct
impl SupportedToken {
    // Line 11: Constant defining the account size - REQUIRED in Anchor
    // This tells Anchor how much space to allocate for this account
    pub const SIZE: usize = SupportedToken::INIT_SPACE + 64;
    //           │     │    │   │   │  │   │
    //           │     │    │   │   │  │   └─ 1 byte for bump (u8)
    //           │     │    │   │   │  └─ 1 byte for is_active (bool)
    //           │     │    │   │   └─ 2 bytes for ltv_bps (u16)
    //           │     │    │   └─ 32 bytes for mint (Pubkey)
    //           │     │    └─ 8 bytes for Anchor discriminator
    //           │     └─ Total size in bytes
    //           └─ Compile-time constant
}

#[account]
#[derive(InitSpace)]
pub struct Position {
    pub owner: Pubkey,
    pub principal: u64,
    pub realized_profit: u64,
    pub unlock_ts: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PoolVault {
    pub total_liquidity_tracked: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Copy, PartialEq, Debug)]
pub enum ProfitTier {
    OneMonth,    // 2.5%
    ThreeMonth,  // 3.5%
    SixMonth,    // 4.5%
    TwelveMonth, // 6.5%
}
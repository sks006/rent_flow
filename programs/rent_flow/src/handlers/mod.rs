// Only declare modules that actually exist as .rs files in the tree
pub mod initialize;
pub mod init_vault;
pub mod mint_booking;
pub mod lock_cycle;
pub mod deposit_collateral;
pub mod withdraw_liquidity;

// Re-export EVERYTHING so lib.rs can see generated client accounts
// Suppress warnings about 'handler' being re-exported multiple times
#[allow(ambiguous_glob_reexports)]
pub use initialize::*;
#[allow(ambiguous_glob_reexports)]
pub use init_vault::*;
#[allow(ambiguous_glob_reexports)]
pub use mint_booking::*;
#[allow(ambiguous_glob_reexports)]
pub use lock_cycle::*;
#[allow(ambiguous_glob_reexports)]
pub use deposit_collateral::*;
#[allow(ambiguous_glob_reexports)]
pub use withdraw_liquidity::*;
// ... export others as needed
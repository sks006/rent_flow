use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    // --- Authorization Errors ---
    #[msg("The integrator is not authorized or is currently inactive.")]
    IntegratorNotAuthorized,
    
    #[msg("The signer is not the authorized owner of this booking hub.")]
    NotHubOwner,

    // --- State & Lifecycle Errors ---
    #[msg("This booking has already started and cannot be modified.")]
    BookingAlreadyStarted,

    #[msg("The asset is already locked in a financial cycle.")]
    AlreadyLocked,

    // --- Oracle & Proof Errors ---
    #[msg("The provided oracle public key does not match the protocol config.")]
    InvalidOracleKey,

    #[msg("The reconstructed message does not match the oracle's signature.")]
    OracleMessageMismatch,

    #[msg("The instruction index for introspection is out of bounds.")]
    InvalidInstructionIndex,

    #[msg("The expected program ID was not found in the instruction sysvar.")]
    InvalidProgramId,

    // --- Mathematical Errors ---
    #[msg("A mathematical operation resulted in an overflow or underflow.")]
    MathOverflow,

    #[msg("The account data offset is invalid for the requested operation.")]
    InvalidOffset,
}
use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Custom error message")]
    CustomError,
    IntegratorNotAuthorized,
    BookingAlreadyStarted,
    InvalidOracleKey,
    OracleMessageMismatch,
    InvalidOffset

}

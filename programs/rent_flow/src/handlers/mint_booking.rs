use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    program::invoke,
    system_instruction,
    sysvar::instructions as instructions_sysvar,
};
use anchor_spl::{
    associated_token::{AssociatedToken, spl_associated_token_account},
    token_2022::{self, Token2022, MintTo},
};
use crate::state::{IntegratorConfig, BookingObligation, ProfitTier};
use crate::error::ErrorCode;

pub const ED25519_PROGRAM_ID: Pubkey = pubkey!("Ed25519SigVerify111111111111111111111111111");

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

    /// CHECK: Seed derivation only
    pub integration_wallet: UncheckedAccount<'info>,

    /// CHECK: Manually created via System Program to support Token-2022 Extensions
    #[account(mut, signer)]
    pub nft_mint: AccountInfo<'info>,

    /// CHECK: Manually initialized via Associated Token Program after Mint creation
    #[account(mut)]
    pub host_ata: UncheckedAccount<'info>,

    #[account(
        init,
        payer = host,
        space = 8 + BookingObligation::INIT_SPACE,
        seeds = [b"obligation", nft_mint.key().as_ref()],
        bump
    )]
    pub booking_obligation: Account<'info, BookingObligation>,

    /// CHECK: Instruction Introspection Sysvar
    #[account(address = instructions_sysvar::ID)]
    pub sysvar_instructions: AccountInfo<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_2022_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BookingProof {
    pub booking_id: String,
    pub amount: u64,
    pub start_date: i64,
    pub end_date: i64,
    pub host_wallet: Pubkey,
    pub oracle_pubkey: Pubkey,
    pub tier_index: u8,
    pub investor_wallet: Pubkey,
}

pub fn handler(ctx: Context<MintBooking>, booking_data: BookingProof) -> Result<()> {
    // --------------------------------------------
    // PHASE 1: ORACLE VERIFICATION
    // --------------------------------------------
    let ixs = ctx.accounts.sysvar_instructions.to_account_info();
    let current_index = instructions_sysvar::load_current_index_checked(&ixs)?;
    let prev_index = current_index.checked_sub(1).ok_or(ErrorCode::InvalidInstructionIndex)?;
    let ed25519_ix = instructions_sysvar::load_instruction_at_checked(prev_index as usize, &ixs)?;
    
    require_keys_eq!(ed25519_ix.program_id, ED25519_PROGRAM_ID, ErrorCode::InvalidProgramId);

    // --------------------------------------------
    // PHASE 2: MANUAL TOKEN-2022 SETUP
    // --------------------------------------------
    let mint_key = ctx.accounts.nft_mint.key();
    let space = 82; // Standard Token Mint space
    let lamports = Rent::get()?.minimum_balance(space);

    // Create Account
    invoke(
        &system_instruction::create_account(
            ctx.accounts.host.key, &mint_key, lamports, space as u64, ctx.accounts.token_2022_program.key,
        ),
        &[ctx.accounts.host.to_account_info(), ctx.accounts.nft_mint.to_account_info(), ctx.accounts.system_program.to_account_info()],
    )?;

    // Initialize Transfer Hook - DISABLED to fix "Missing Account" error
    /*
    let ix_init_hook = spl_token_2022::extension::transfer_hook::instruction::initialize(
        ctx.accounts.token_2022_program.key,
        &mint_key,
        Some(ctx.accounts.integration_config.key()),
        Some(*ctx.program_id),
    )?;
    invoke(&ix_init_hook, &[ctx.accounts.nft_mint.to_account_info()])?;
    */

    // Initialize Mint
    token_2022::initialize_mint(
        CpiContext::new(ctx.accounts.token_2022_program.to_account_info(), token_2022::InitializeMint {
            mint: ctx.accounts.nft_mint.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        }),
        0, &ctx.accounts.integration_config.key(), None,
    )?;

    // Create ATA
    invoke(
        &spl_associated_token_account::instruction::create_associated_token_account(
            ctx.accounts.host.key, ctx.accounts.host.key, &mint_key, ctx.accounts.token_2022_program.key,
        ),
        &[
            ctx.accounts.host.to_account_info(), ctx.accounts.host_ata.to_account_info(), ctx.accounts.nft_mint.to_account_info(), 
            ctx.accounts.system_program.to_account_info(), ctx.accounts.associated_token_program.to_account_info(), ctx.accounts.token_2022_program.to_account_info()
        ],
    )?;

    // --------------------------------------------
    // PHASE 3: MINTING & DATA PERSISTENCE
    // --------------------------------------------
    let seeds: &[&[u8]] = &[b"integrator", ctx.accounts.integration_wallet.key.as_ref(), &[ctx.accounts.integration_config.bump]];

    token_2022::mint_to(
        CpiContext::new_with_signer(ctx.accounts.token_2022_program.to_account_info(), MintTo {
            mint: ctx.accounts.nft_mint.to_account_info(),
            to: ctx.accounts.host_ata.to_account_info(),
            authority: ctx.accounts.integration_config.to_account_info(),
        }, &[seeds]),
        1
    )?;

    let obligation = &mut ctx.accounts.booking_obligation;
    obligation.tier = match booking_data.tier_index {
        0 => ProfitTier::OneMonth,
        1 => ProfitTier::ThreeMonth,
        2 => ProfitTier::SixMonth,
        3 => ProfitTier::TwelveMonth,
        _ => return err!(ErrorCode::InvalidTier),
    };
    obligation.booking_id = booking_data.booking_id;
    obligation.booking_value = booking_data.amount;
    obligation.start_date = booking_data.start_date;
    obligation.end_date = booking_data.end_date;
    obligation.integrator_wallet=booking_data.investor_wallet;
    obligation.host_wallet=booking_data.host_wallet;
    obligation.nft_mint = mint_key;
    obligation.bump = ctx.bumps.booking_obligation;

    Ok(())
}
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self, Token2022},
    token_interface::{self, Mint, TokenAccount, TokenInterface},
};
use crate::state::BookingObligation;
use crate::error::ErrorCode;


#[derive(Accounts)]
pub struct DepositCollateral<'info> {
    #[account(mut)]
    pub host: Signer<'info>,

    #[account(
        mut,
        seeds = [b"obligation", nft_mint.key().as_ref()],
        bump = obligation.bump,
    )]
    pub obligation: Account<'info, BookingObligation>,

    pub nft_mint: InterfaceAccount<'info, Mint>,
    pub usdc_mint: InterfaceAccount<'info, Mint>, // NEW: Required for decimals check

    #[account(mut)]
    pub host_nft_ata: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub host_usdc_ata: InterfaceAccount<'info, TokenAccount>, // NEW: Recipient of funds

    #[account(
        init_if_needed,
        payer = host,
        associated_token::authority = obligation, 
        associated_token::mint = nft_mint,
        associated_token::token_program = token_2022_program
    )]
    pub vault_nft_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub vault_usdc_ata: InterfaceAccount<'info, TokenAccount>, // NEW: Source of liquidity

    pub token_2022_program: Program<'info, Token2022>,
    pub token_program: Interface<'info, TokenInterface>, // For standard SPL USDC
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
// pub fn handler(ctx: Context<DepositCollateral>) -> Result<()> {
//     // 1. Trace the Data Flow: The Title Transfer
//     let cpi_accounts = TransferChecked {
//         from: ctx.accounts.host_nft_ata.to_account_info(),
//         mint: ctx.accounts.nft_mint.to_account_info(), // THE TITLE
//         to: ctx.accounts.vault_nft_ata.to_account_info(),
//         authority: ctx.accounts.host.to_account_info(), // THE OWNER
//     };

//     // 📐 THE RULE: Explicit Program Context
//     // We must use the program_id that matches the Mint's owner.
//     let cpi_ctx = CpiContext::new(
//         ctx.accounts.token_program.to_account_info(),
//         cpi_accounts,
//     );

//     // 2. Transformation: Shift gears and move the Asset
//     token_interface::transfer_checked(
//         cpi_ctx,
//         1,
//         ctx.accounts.nft_mint.decimals // Should be 0 for a Sportscar NFT
//     )?;

//     // 3. Exit: State Change
//     let obligation = &mut ctx.accounts.obligation;
//     obligation.is_locked = true;

//     Ok(())
// }

pub fn handler(ctx: Context<DepositCollateral>, funding_amount: u64) -> Result<()> {
    let obligation = &mut ctx.accounts.obligation;
    
    // 🚩 SAFETY SENSOR: Prevent redundant deposit
    require!(!obligation.is_locked, ErrorCode::AlreadyLocked);

    // --- PART 1: LOCK COLLATERAL (Host -> Vault) ---
    token_2022::transfer_checked(
        CpiContext::new(
            ctx.accounts.token_2022_program.to_account_info(),
            token_2022::TransferChecked {
                from: ctx.accounts.host_nft_ata.to_account_info(),
                mint: ctx.accounts.nft_mint.to_account_info(),
                to: ctx.accounts.vault_nft_ata.to_account_info(),
                authority: ctx.accounts.host.to_account_info(),
            }
        ),
        1, 0 // NFT is always 1 unit, 0 decimals
    )?;

    // --- PART 2: DISBURSE FUNDING (Vault -> Host) ---
    // RULE: Since the Vault (PDA) is the authority, we need signer seeds.
    let mint_key = ctx.accounts.nft_mint.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"obligation",
        mint_key.as_ref(),
        &[ctx.accounts.obligation.bump],
    ]];

    token_interface::transfer_checked(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token_interface::TransferChecked {
                from: ctx.accounts.vault_usdc_ata.to_account_info(),
                mint: ctx.accounts.usdc_mint.to_account_info(),
                to: ctx.accounts.host_usdc_ata.to_account_info(),
                authority: ctx.accounts.obligation.to_account_info(),
            },
            signer_seeds
        ),
        funding_amount,
        ctx.accounts.usdc_mint.decimals
    )?;

    // --- PART 3: STATE UPDATE ---
    let obligation = &mut ctx.accounts.obligation;
    obligation.is_locked = true;
    // obligation.loan_amount = funding_amount; // Track the debt for settlement

    Ok(())
}
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RentFlow } from "../target/types/rent_flow";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddressSync, 
    createAssociatedTokenAccountInstruction,
    createMint
} from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.RentFlow as Program<RentFlow>;

    // 🏎️ THE SPECS
    const DEVNET_USDC = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Common Devnet USDC
    const ORACLE_WALLET = provider.wallet.publicKey; // For MVP, we'll use your wallet as the oracle

    console.log("🚀 Starting Calibration for Program:", program.programId.toBase58());

    // 1. DERIVE PDAs
    const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("integrator"), ORACLE_WALLET.toBuffer()],
        program.programId
    );

    const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool_vault")],
        program.programId
    );

    const vaultUsdcAta = getAssociatedTokenAddressSync(
        DEVNET_USDC,
        vaultPda,
        true // Allow PDA owner
    );

    // 2. INITIALIZE INTEGRATOR
    console.log("📡 Initializing Integrator Config...");
    try {
        await (program.methods.initialize() as any)
            .accounts({
                authority: provider.wallet.publicKey,
                integrationConfig: configPda,
                integrationWallet: ORACLE_WALLET,
                poolVault: vaultPda,
                systemProgram: SystemProgram.programId,
            })
            .rpc();
        console.log("✅ Integrator Initialized.");
    } catch (e: any) {
        if (e.logs && e.logs.some((l: string) => l.includes("already in use"))) {
            console.log("ℹ️ Integrator already initialized.");
        } else {
            console.error("❌ Initialization Error:", e);
        }
    }

    // 3. ENSURE MINT EXISTS
    let mintToUse = DEVNET_USDC;
    const mintInfo = await provider.connection.getAccountInfo(DEVNET_USDC);
    if (!mintInfo) {
        console.log("🪙 Mint not found on this cluster. Creating a mock mint...");
        const mockMint = anchor.web3.Keypair.generate();
        
        // Airdrop to ensured payer can pay
        const sig = await provider.connection.requestAirdrop(provider.wallet.publicKey, 1 * LAMPORTS_PER_SOL);
        await provider.connection.confirmTransaction(sig);

        await createMint(
            provider.connection,
            (provider.wallet as any).payer, // Works in NodeWallet environment
            provider.wallet.publicKey,
            null,
            6,
            mockMint,
            undefined,
            TOKEN_PROGRAM_ID
        );
        mintToUse = mockMint.publicKey;
        console.log("✅ Mock Mint Created:", mintToUse.toBase58());
    }

    // 4. INITIALIZE SUPPORTED TOKEN (addToken)
    console.log("🏦 Initializing Supported Token & Liquidity Hub...");
    
    const [supportedTokenPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), mintToUse.toBuffer()],
        program.programId
    );

    const vaultKeypair = anchor.web3.Keypair.generate();

    try {
        await (program.methods.addToken(5000) as any) // 50% LTV
            .accounts({
                admin: provider.wallet.publicKey,
                mint: mintToUse,
                supportedToken: supportedTokenPda,
                tokenVault: vaultKeypair.publicKey,
                flexibleTokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .signers([vaultKeypair])
            .rpc();
        console.log("✅ Supported Token Added.");
    } catch (e: any) {
        console.error("❌ Add Token Error:", e);
    }

    console.log("🏁 Calibration Complete. Protocol is MISSION READY.");
}

main().catch(console.error);
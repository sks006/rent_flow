import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RentFlow } from "../target/types/rent_flow";
import { 
  PublicKey, Keypair, SystemProgram, 
  SYSVAR_INSTRUCTIONS_PUBKEY, LAMPORTS_PER_SOL, Ed25519Program 
} from "@solana/web3.js";
import { 
  TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync, 
  ASSOCIATED_TOKEN_PROGRAM_ID, createMint, mintTo,
  createAssociatedTokenAccount, TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { expect } from "chai";
import * as nacl from "tweetnacl";

describe("rent_flow_proving_grounds", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.RentFlow as Program<RentFlow>;
  
  // 🏁 SHARED STATE (Hoisted to top-level scope)
  const host = Keypair.generate();
  const nftMint = Keypair.generate(); 
  const oracle = Keypair.generate();   
  const integrationWallet = Keypair.generate(); 
  const investorWallet = Keypair.generate().publicKey;

  let obligationPda: PublicKey;
  let integrationConfigPda: PublicKey;
  let poolVaultPda: PublicKey;
  let hostNftAta: PublicKey;
  let vaultNftAta: PublicKey;
  let usdcMint: Keypair;
  let hostUsdcAta: PublicKey;
  let vaultUsdcAta: PublicKey;
  let poolNftAta: PublicKey;

  before(async () => {
    // Airdrop SOL to host for transaction fees
    const signature = await provider.connection.requestAirdrop(host.publicKey, 2 * LAMPORTS_PER_SOL);
    const latestBlockHash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
    });

    [obligationPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("obligation"), nftMint.publicKey.toBuffer()],
      program.programId
    );

    [integrationConfigPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("integrator"), integrationWallet.publicKey.toBuffer()],
      program.programId
    );

    [poolVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool_vault")],
      program.programId
    );

    hostNftAta = getAssociatedTokenAddressSync(
      nftMint.publicKey, host.publicKey, false, TOKEN_2022_PROGRAM_ID
    );

    vaultNftAta = getAssociatedTokenAddressSync(
      nftMint.publicKey, obligationPda, true, TOKEN_2022_PROGRAM_ID
    );

    // Setup USDC (Standard Token Program)
    usdcMint = Keypair.generate();
    await createMint(
      provider.connection,
      host,
      host.publicKey,
      null,
      6,
      usdcMint,
      undefined,
      TOKEN_PROGRAM_ID
    );

    hostUsdcAta = getAssociatedTokenAddressSync(
      usdcMint.publicKey, host.publicKey, false, TOKEN_PROGRAM_ID
    );
    try {
        await createAssociatedTokenAccount(
            provider.connection,
            host,
            usdcMint.publicKey,
            host.publicKey,
            undefined,
            TOKEN_PROGRAM_ID
        );
    } catch (e) {}

    vaultUsdcAta = getAssociatedTokenAddressSync(
      usdcMint.publicKey, obligationPda, true, TOKEN_PROGRAM_ID
    );
    try {
        await createAssociatedTokenAccount(
            provider.connection,
            host,
            usdcMint.publicKey,
            obligationPda,
            undefined,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
            true // allowOffCurve
        );
    } catch (e) {}

    // Mint some USDC to the vault so it can fund the host
    await mintTo(
      provider.connection,
      host,
      usdcMint.publicKey,
      vaultUsdcAta,
      host.publicKey,
      1000000000, // 1000 USDC
      [],
      undefined,
      TOKEN_PROGRAM_ID
    );

    // Mint some USDC to the Host so they can repay (10 USDC)
    await mintTo(
      provider.connection,
      host,
      usdcMint.publicKey,
      hostUsdcAta,
      host.publicKey,
      10000000,
      [],
      undefined,
      TOKEN_PROGRAM_ID
    );

    poolNftAta = getAssociatedTokenAddressSync(
      nftMint.publicKey, poolVaultPda, true, TOKEN_2022_PROGRAM_ID
    );

    try {
        await createAssociatedTokenAccount(
            provider.connection,
            host,
            nftMint.publicKey,
            poolVaultPda,
            undefined,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
            true
        );
    } catch (e) {}
  });

  it("0. Setup: Calibrate Integrator", async () => {
    await program.methods
      .initialize()
      .accounts({
        authority: provider.wallet.publicKey,
        integrationConfig: integrationConfigPda,
        integrationWallet: integrationWallet.publicKey,
        poolVault: poolVaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  });

  it("1. Transformation: Mint Booking RWA", async () => {
    const bookingId = "GT3-911-PRO";
    const amount = new anchor.BN(1000000);
    const startDate = new anchor.BN(Math.floor(Date.now() / 1000) + 5000);
    const endDate = new anchor.BN(Math.floor(Date.now() / 1000) + 10000);

    const bookingIdBuffer = Buffer.from(bookingId);
    const bookingIdLen = Buffer.alloc(4);
    bookingIdLen.writeUInt32LE(bookingIdBuffer.length, 0);

    const message = Buffer.concat([
      bookingIdLen, bookingIdBuffer,
      amount.toArrayLike(Buffer, "le", 8),
      startDate.toArrayLike(Buffer, "le", 8),
      endDate.toArrayLike(Buffer, "le", 8),
      host.publicKey.toBuffer(),
    ]);

    const signature = nacl.sign.detached(message, oracle.secretKey);
    const signatureInstruction = Ed25519Program.createInstructionWithPublicKey({
      publicKey: oracle.publicKey.toBytes(),
      message: message,
      signature: signature,
    });

    await program.methods
      .mintBooking({
        bookingId, amount, startDate, endDate,
        hostWallet: host.publicKey,
        oraclePubkey: oracle.publicKey,
        tierIndex: 2, // SixMonth
        investorWallet: investorWallet,
      })
      .accounts({
        host: host.publicKey,
        integrationConfig: integrationConfigPda,
        integrationWallet: integrationWallet.publicKey,
        nftMint: nftMint.publicKey,
        hostAta: hostNftAta,
        bookingObligation: obligationPda,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .preInstructions([signatureInstruction])
      .signers([host, nftMint])
      .rpc();
  });

it("2. Transformation: Secure Collateral (Deposit)", async () => {
    // 1. Build the instruction manually to inspect it
    const ix = await program.methods
      .depositCollateral(new anchor.BN(500000))
      .accounts({
        host: host.publicKey,
        obligation: obligationPda,
        nftMint: nftMint.publicKey,
        usdcMint: usdcMint.publicKey,
        hostNftAta: hostNftAta,
        hostUsdcAta: hostUsdcAta,
        vaultNftAta: vaultNftAta,
        vaultUsdcAta: vaultUsdcAta,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID, // Standard USDC
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    // 2. Trace the Data Flow: Print the Account List
    console.log("🚀 Pre-Flight Inspection (Account List):");
    ix.keys.forEach((key, index) => {
      console.log(`Account [${index}]: ${key.pubkey.toBase58()} (Writable: ${key.isWritable})`);
    });

    // 3. Execution: Send the transaction
    try {
        await program.methods
          .depositCollateral(new anchor.BN(500000))
          .accounts({
            host: host.publicKey,
            obligation: obligationPda,
            nftMint: nftMint.publicKey,
            usdcMint: usdcMint.publicKey,
            hostNftAta: hostNftAta,
            hostUsdcAta: hostUsdcAta,
            vaultNftAta: vaultNftAta,
            vaultUsdcAta: vaultUsdcAta,
            token2022Program: TOKEN_2022_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID, // Standard USDC
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([host])
          .rpc();
    } catch (err: any) {
        console.log("❌ Transaction Failed!");
        // CS Rule: If an account is missing, one of the pubkeys above will be 'null' or the System Program
        throw err;
    }

    const state = await program.account.bookingObligation.fetch(obligationPda);
    expect(state.isLocked).to.be.true;
  });
  it("3. Safety Sensor: Prevent Redundant Deposit", async () => {
    try {
      await program.methods
        .depositCollateral(new anchor.BN(500000))
        .accounts({
          host: host.publicKey,
          obligation: obligationPda,
          nftMint: nftMint.publicKey,         
          usdcMint: usdcMint.publicKey,
          hostNftAta: hostNftAta,             
          hostUsdcAta: hostUsdcAta,
          vaultNftAta: vaultNftAta,           
          vaultUsdcAta: vaultUsdcAta,
          token2022Program: TOKEN_2022_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([host])
        .rpc();
      expect.fail("Should have thrown AlreadyLocked error");
    } catch (err: any) {
      // The error should now be the custom Anchor error from your Rust code
      const errMsg = err.toString();
      const logs = err.logs ? err.logs.join("\n") : "";
      expect(errMsg + logs).to.include("AlreadyLocked");
      console.log("✅ Sensor Tripped: Redundant deposit blocked.");
    }
  });
  it("5. Safety Sensor: Block Premature Liquidation", async () => {
    const liquidator = Keypair.generate();
    
    const sig = await provider.connection.requestAirdrop(liquidator.publicKey, 1 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig);

    try {
      await program.methods
        .liquidateDefault()
        .accounts({
          liquidator: liquidator.publicKey,
          obligation: obligationPda,
          nftMint: nftMint.publicKey,
          vaultNftAta: vaultNftAta,
          poolNftAta: poolNftAta, 
          poolVault: poolVaultPda,
          token2022Program: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .signers([liquidator])
        .rpc();
      
      expect.fail("Should have failed: Grace period not over");
    } catch (err: any) {
      const errMsg = err.toString();
      const logs = err.logs ? err.logs.join("\n") : "";
      console.log("DEBUG: Error Message:", errMsg);
      console.log("DEBUG: Error Logs:", logs);
      expect(errMsg + logs).to.include("GracePeriodNotOver");
      console.log("✅ Sensor Tripped: Premature liquidation blocked.");
    }
  });

  it("4. Transformation: Settle Booking (Repayment)", async () => {
    // We assume USDC mint and ATAs are set up from a funding step
    // warpTime(10001); // Logical warp past endDate

    await program.methods
      .settleBooking()
      .accounts({
        host: host.publicKey,
        obligation: obligationPda,
        nftMint: nftMint.publicKey,
        hostNftAta: hostNftAta,
        vaultNftAta: vaultNftAta,
        usdcMint: usdcMint.publicKey,
        hostUsdcAta: hostUsdcAta,
        vaultUsdcAta: vaultUsdcAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .signers([host])
      .rpc();

    const state = await program.account.bookingObligation.fetch(obligationPda);
    expect(state.isSettled).to.be.true;
    expect(state.isLocked).to.be.false;
    console.log("✅ Settlement Success: NFT returned to Host.");
  });
});
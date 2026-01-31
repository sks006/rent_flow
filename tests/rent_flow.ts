import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RentFlow } from "../target/types/rent_flow";
import { 
  PublicKey, 
  Keypair, 
  SystemProgram, 
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { 
  TOKEN_2022_PROGRAM_ID, 
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { expect } from "chai";

describe("rent_flow_proving_grounds", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RentFlow as Program<RentFlow>;
  
  // 🏎️ THE PIT CREW (Test Variables)
  const host = Keypair.generate();
  const nftMint = Keypair.generate(); 
  const oracle = Keypair.generate();   
  const integrationWallet = Keypair.generate(); 
  
  // PDAs
  let obligationPda: PublicKey;
  let integrationConfigPda: PublicKey;
  let hostNftAta: PublicKey;

  before(async () => {
    // 1. ENTRY: Fund the Host
    const signature = await provider.connection.requestAirdrop(host.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(signature);

    // 2. LOGICAL JOURNEY: Derive Address Mappings
    [obligationPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("obligation"), nftMint.publicKey.toBuffer()],
      program.programId
    );

    [integrationConfigPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("integrator"), integrationWallet.publicKey.toBuffer()],
      program.programId
    );

    hostNftAta = getAssociatedTokenAddressSync(
      nftMint.publicKey,
      host.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
  });

  it("0. Setup: Calibrate Protocol (Initialize)", async () => {
    // WHY: Minting depends on an active configuration.
    await program.methods
      .initialize()
      .accountsPartial({
        authority: provider.wallet.publicKey,
        integrationConfig: integrationConfigPda,
        integrationWallet: integrationWallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("✅ Engine Calibrated: Integrator Config Active.");
  });

  it("1. Transformation: Create RWA (Mint Booking)", async () => {
    const bookingId = "CAR-RENT-99";
    const amount = new anchor.BN(5000 * 10 ** 6); // $5000 in 6-decimal USDC terms
    const startDate = new anchor.BN(Math.floor(Date.now() / 1000) + 60); // 60s in future
    const endDate = new anchor.BN(Math.floor(Date.now() / 1000) + 3660); // 1hr rental

    // THE RULE: Message Reconstruction (Match Program's Borsh serialization)
    // String in Borsh is [length: u32, characters]
    const bookingIdBuffer = Buffer.from(bookingId);
    const bookingIdLen = Buffer.alloc(4);
    bookingIdLen.writeUInt32LE(bookingIdBuffer.length, 0);

    const message = Buffer.concat([
      bookingIdLen,
      bookingIdBuffer,
      amount.toArrayLike(Buffer, "le", 8),
      startDate.toArrayLike(Buffer, "le", 8),
      endDate.toArrayLike(Buffer, "le", 8),
      host.publicKey.toBuffer(),
    ]);

    // Sign with Ed25519
    const signature = anchor.web3.Keypair.fromSecretKey(oracle.secretKey).secretKey.slice(0, 64);
    // Actually, Keypair.fromSecretKey(secretKey).secretKey is [32-byte priv, 32-byte pub]
    // The signature should be generated using tweetnacl or similar if we want a real signature.
    // However, the program just checks for the presence of the instruction and we need a VALID signature.
    
    const signatureInstruction = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
      publicKey: oracle.publicKey.toBytes(),
      message: message,
      signature: require("tweetnacl").sign.detached(message, oracle.secretKey),
    });

    // EXECUTION: Atomic Instruction Introspection
    await program.methods
      .mintBooking({
        bookingId,
        amount,
        startDate,
        endDate,
        hostWallet: host.publicKey,
        oraclePubkey: oracle.publicKey,
      })
      .accountsPartial({
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

    console.log("✅ NFT Manufactured: Booking Obligation written to ledger.");
  });

  it("2. Transformation: Secure Collateral (Deposit)", async () => {
    // LOGICAL JOURNEY: Move from Wallet (User) -> Vault (Program-Owned PDA)
    await program.methods
      .depositCollateral()
      .accountsPartial({
        host: host.publicKey,
        obligation: obligationPda,
        nftMint: nftMint.publicKey,
        hostNftAta: hostNftAta,
        token2022Program: TOKEN_2022_PROGRAM_ID,
      })
      .signers([host])
      .rpc();

    const state = await program.account.bookingObligation.fetch(obligationPda);
    expect(state.isLocked).to.be.true;
    console.log("✅ Asset Secured: Car is in the garage (Vault).");
  });

  it("3. Safety Sensor: Prevent Early Settlement", async () => {
    // RULE: Temporal Invariant. It's too early to return the car.
    try {
      await program.methods
        .settleBooking()
        .accountsPartial({
          host: host.publicKey,
          obligation: obligationPda,
          nftMint: nftMint.publicKey,
          hostNftAta: hostNftAta,
          token2022Program: TOKEN_2022_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
        })
        .signers([host])
        .rpc();
      expect.fail("Should have stalled; rental period still active.");
    } catch (err) {
      expect(err.toString()).to.include("BookingNotYetEnded");
      console.log("✅ Safety Sensor Active: Early settlement blocked.");
    }
  });
});
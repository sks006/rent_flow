import { PublicKey } from "@solana/web3.js";
const programId = new PublicKey("29u6Rxe7tsrWFoUifHfvyYMqn3n9CBe5BmzuiPLk3CEJ");
const oracleWallet = new PublicKey("Dtur175PvRNiR1HESsZwUi3NcS8j2GdY3WrwfQ4m5TYL");
const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("integrator"), oracleWallet.toBuffer()],
    programId
);
console.log("Derived PDA:", configPda.toBase58());

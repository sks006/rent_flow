
### 9 Day 


#### 1. The Asset Minting (`mint_booking.rs`) 🎫

This is where we turn a real-world Airbnb booking into a Solana NFT.

* **Logical Journey:** Data enters from an **Oracle** (verifying the booking exists) and results in a **Token-2022 NFT** being minted to the Host's wallet.
* **Key Feature:** We attach a **Transfer Hook** here. This is the "Security Guard" that will later prevent the NFT from being sold while a loan is active.

#### 2. The Collateral Lock (`deposit_collateral.rs`) 🔐

Now that the Host has an NFT, they want to "factor" it (get cash now).

* **Transformation:** The Host sends the NFT to the program. The program checks the `SupportedToken` state we just built to see how much it can lend (the **LTV**).
* **Exit:** The program marks the `BookingObligation` as `locked_status = true`.

#### 3. The Payout (`withdraw_liquidity.rs`) 💸

* **Action:** The USDC moves from your `toke_vault` to the Host.
* **Constraint:** This only happens if the NFT is successfully locked in Step 2.

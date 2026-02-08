# 🌊 RentFlow: Cash-Flow RWA Protocol

### *Unlocking the Liquidity of Future Rental Income*

RentFlow is a Solana-native B2B2C protocol that allows Property Management Companies to tokenize future Airbnb/rental income into Real-World Asset (RWA) NFTs. By selling a portion of their future profit today, hosts gain instant liquidity, while investors earn "Real Yield" from verified business performance.

---

## 🎯 The Problem: Dead Capital

Short-term rental hosts have thousands of dollars locked in "Confirmed" future bookings (Airbnb, VRBO). Traditional banks do not recognize this as collateral, leaving hosts cash-poor while they wait 3–6 months for a guest to check in.

## 💡 The Solution: RentFlow

We create a **Synthetic Equity Market** for rental income.

* **B2B Integration:** Property platforms (Integrators) verify booking data on-chain.
* **C-side Liquidity:** Individual hosts mint NFTs representing their bookings and receive instant USDC.
* **Investor Profit-Share:** Investors provide capital to vaults and earn a percentage of the final rental payout.

---

## 💎 The "Real Yield" Model (No-Yield)

RentFlow rejects inflationary tokenomics. Every dollar earned by investors comes from a physical transaction in the real world.

| Cycle | Target Participant | Investment Goal |
| --- | --- | --- |
| **1 Month** | Aggressive Investors | High-velocity, short-term booking turnover. |
| **3 Months** | Balanced Portfolios | Seasonal rental cycles (Summer/Winter peaks). |
| **6 Months** | Institutional LPs | Stable, long-term exposure to the rental market. |

> **The Exit Penalty:** To protect the integrity of the profit-share, users who withdraw capital before their cycle ends incur a **5% penalty**, which is redistributed to the remaining "diamond hand" investors in that pool. 💎

---

## 🛠️ Technical Stack

* **Blockchain:** Solana (L1)
* **Program:** Rust + Anchor Framework
* **Token Standard:** **Token-2022** (extensions: Transfer Hooks, Metadata Pointer)
* **Frontend:** Next.js + Tailwind CSS
* **Wallet:** Phantom, Backpack (Solana Wallet Adapter)

---
```
## 🧱 Project Structure
rentflow/

├── anchor/

│   ├── programs/

│   │   └── rent_flow/              

│   │       ├── src/

│   │       │   ├── lib.rs          <-- Logic Routing & Instruction Entry

│   │       │   ├── state.rs        <-- Data Structures (Obligations, Vaults, Tiers)

│   │       │   ├── error.rs        <-- Safety Sensors (AlreadyLocked, GracePeriodNotOver)

│   │       │   └── handlers/       


│   │       │       ├── mod.rs      


│   │       │       ├── init_vault.rs     <-- 1. Whitelist Collateral & Initialize Pool



│   │       │       ├── mint_booking.rs   <-- 2. Tokenize RWA (The NFT Minting)

│   │       │       ├── deposit_collateral.rs <-- 3. Atomic Swap (NFT In / USDC Out to Host)

│   │       │       ├── settle_booking.rs  <-- 4. Repayment (USDC + Yield In / NFT Out to Host)

│   │       │       ├── liquidate_default.rs <-- 5. Seizure (Asset Move to Pool after Grace Period)

│   │       │       └── withdraw_liquidity.rs <-- 6. Investor Exit (Principal + Real Yield Payout)

│   └── Anchor.toml

│   ├── tests/

│   │   └── rent_flow.ts            <-- The Proving Grounds (Test Suite)

│

├── web/

│   ├── src/

│   │   ├── app/

│   │   │   ├── api/

│   │   │   │   ├── airbnb-proxy/

│   │   │   │   │   └── route.ts

│   │   │   │   └── metadata/

│   │   │   │       └── route.ts

│   │   │   ├── dashboard/

│   │   │   │   └── page.tsx

│   │   │   ├── rent/

│   │   │   │   └── page.tsx

│   │   │   ├── layout.tsx

│   │   │   └── page.tsx

│   │   ├── components/

│   │   │   ├── rent/
│   │   │   │   ├── BookingCard.tsx

│   │   │   │   └── CycleSelector.tsx

│   │   │   └── ui/

│   │   │       ├── button.tsx

│   │   │       └── card.tsx

│   │   ├── hooks/

│   │   │   ├── useRentProgram.ts

│   │   │   └── useVaultData.ts

│   │   └── lib/

│   │       └── solana/

│   │           ├── pda.ts

│   │           └── idl.ts

│   ├── next.config.js

│   ├── package.json

│   └── tsconfig.json

│

├── scripts/

│   ├── deploy.sh

│   └── seed_data.ts

│

└── docs/
    
    ├── README.md
    
    ├── SPECS.md
    
    
    └── API.md

```
## 🛡️ Trust & Compliance


1. **Oracle Verification:** Direct API verification of Airbnb bookings to prevent "Phantom Mints."
2. **ZK-KYC:** Privacy-first identity verification for every host.
3. **Legal Recourse:** Digital lien agreements hashed into the NFT metadata, enforceable in traditional courts.


#### 1. Atomic Funding (Deposit)

* **Mechanism:** When a Host deposits the RWA NFT, the program executes a **Simultaneous Exchange**.
* **Invariant:** The `token_2022_program` locks the NFT in the `vault_nft_ata` while the `token_program` transfers the `loan_amount` from the `pool_usdc_ata` to the Host.
* **Safety:** If the Pool lacks USDC liquidity, the NFT transfer reverts. The Host never loses title without receiving cash.

#### 2. Repayment & Profit Share (Settlement)

* **Mechanism:** The Host "buys back" the NFT title by paying `Principal + Yield`.
* **Yield Logic:** Fixed-point math calculates the **ProfitTier** return.
* **Early Exit Sensor:** If `Clock < end_date`, a **5% Penalty** (500 BPS) is calculated via checked math and added to the `total_repayment`.
* **Distribution:** These funds flow back to the `PoolVault`, increasing the `total_liquidity_tracked` for Investors.

#### 3. Foreclosure & Liveness (Liquidation)

* **Mechanism:** If the `Clock > end_date + 7 Days`, the Host's "Right of Redemption" is mathematically terminated.
* **Transformation:** The `obligation` PDA signs the transfer of the NFT from the `vault_nft_ata` to the `pool_nft_ata`.
* **Outcome:** The Investors now own the physical underlying asset (The RWA) to compensate for the lost USDC.

---

### 🛡️ Technical Logic Update

Every instruction now follows the **Strict Rules-Based Engineering** protocol:

1. **Temporal Verification:** All handlers now utilize the `Clock` sysvar to enforce time-locked invariants.
2. **Basis Point Precision:** Yield and Penalties are calculated using `u64` fixed-point math (BPS) to avoid floating-point non-determinism.
3. **PDA Signer Seeds:** The `BookingObligation` PDA acts as the "Autonomous Escrow Agent," signing for both the release of NFTs and the disbursement of USDC.
---

## 🚀 Future Roadmap⭕

* **Secondary Market:** Trade your "6-month Profit NFT" on Tensor or Magic Eden.
* **Multi-Platform Support:** Expanding beyond Airbnb to hotels and commercial leases.
* **Dynamic LTV:** AI-driven loan-to-value ratios based on a property's historic performance.

---

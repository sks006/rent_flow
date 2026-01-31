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

│   │       │   ├── lib.rs          <-- Logic Routing

│   │       │   ├── state.rs        <-- Data Structures

│   │       │   ├── error.rs        <-- Safety Sensors

│   │       │   └── handlers/       

│   │       │       ├── mod.rs      

│   │       │       ├── init_vault.rs     <-- 1. Whitelist Collateral

│   │       │       ├── mint_booking.rs   <-- 2. Tokenize RWA

│   │       │       ├── deposit_collateral.rs <-- 3. Lock & Secure

│   │       │       └── settle_booking.rs  <-- 4. Final Payout/Release

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

---

## 🚀 Future Roadmap

* **Secondary Market:** Trade your "6-month Profit NFT" on Tensor or Magic Eden.
* **Multi-Platform Support:** Expanding beyond Airbnb to hotels and commercial leases.
* **Dynamic LTV:** AI-driven loan-to-value ratios based on a property's historic performance.

---

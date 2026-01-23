RentFlow/

├── anchor/                     # SMART CONTRACTS (Rust/Anchor) - Modular for DeFi 
scalability

│   ├── programs/

│   │   ├── rent_core/          # Logic Engine - Core factoring and profit-sharing

│   │   │   ├── src/

│   │   │   │   ├── lib.rs      # Main entry & Instruction routing

│   │   │   │   ├── state.rs    # BookingObligation, Vault, CycleLock structures (for timed profit shares)

│   │   │   │   ├── errors.rs   # Custom Hackathon-specific errors

│   │   │   │   └── instructions/

│   │   │   │       ├── init_vault.rs          # PDA Vault creation

│   │   │   │       ├── mint_booking.rs        # Token-2022 Minting with extensions

│   │   │   │       ├── deposit_collateral.rs  # Locking the NFT

│   │   │   │       ├── withdraw_liquidity.rs  # USDC payout logic

│   │   │   │       ├── lock_cycle.rs          # New: Locks liquidity for profit-sharing 
cycles (1/3/6/12 mo)

│   │   │   │       ├── distribute_fees.rs     # New: Automates fee shares based on cycles 
(no interest)

│   │   │   │       └── settle_booking.rs      # Handles repayments and fee skims

│   │   │   └── compliance_hook/               # Security Enforcer - Enhanced with 
Token-2022 checks

│   │   │       └── src/

│   │   │           └── lib.rs                 # Rule: Reject transfer if loan active; add 
cycle enforcement

│   │   ├── governance/                        # New: Governance module for token holders (e.
g., vote on fees)

│   │   │   └── src/

│   │   │       ├── lib.rs                     # Entry for governance instructions

│   │   │       ├── state.rs                   # Proposal and Vote structures

│   │   │       └── instructions/

│   │   │           ├── create_proposal.rs     # Propose changes (e.g., cycle adjustments)

│   │   │           └── vote.rs                # Voting with staked tokens

│   │   └── oracle_integration/                # New: Real oracle for booking verification 
(e.g., Chainlink)

│   │       └── src/

│   │           └── lib.rs                     # Fetches/verifies external data

│   ├── Anchor.toml                            # Config with clusters, program 
IDs

│   └── tests/                                 # Integrity Testing - Expanded for cycles and 
edge cases

│       ├── rent_flow.ts                       # Happy path: Mint -> Lock -> Borrow

│       ├── cycle_lock.ts                      # New: Tests profit-sharing cycles

│       ├── governance.ts                      # New: Tests voting flows

│       └── oracle_tests.ts                    # New: Mock/real oracle verification

├── api/                                       # BACKEND (Node.js/Express or Fastify) - Enhanced for cycles

│   ├── src/

│   │   ├── routes/

│   │   │   ├── airbnb_proxy.ts                # Mocks/upgrades to real Airbnb API proxy

│   │   │   ├── cycle_management.ts            # New: Endpoints for locking/viewing cycles

│   │   │   └── fee_claim.ts                   # New: Claim profit shares

│   │   ├── services/

│   │   │   ├── metadata_gen.ts                # Generates off-chain NFT metadata

│   │   │   └── oracle_service.ts              # New: Interfaces with Chainlink/Switchboard

│   │   └── server.ts

│   └── package.json

├── web/                            # FRONTEND (Next.js App Router)

│   ├── public/                     # Static Assets

│   ├── src/

│   │   ├── app/                    # File-based Routing

│   │   │   ├── dashboard/          # /dashboard - Portfolio Overview

│   │   │   ├── rent/               # /rent - Factoring UI

│   │   │   ├── governance/         # /governance - DAO Voting

│   │   │   ├── api/                # Next.js API Routes 
(Backend-lite)

│   │   │   ├── layout.tsx          # Providers & Global Nav

│   │   │   └── page.tsx            # Landing Page

│   │   ├── components/


│   │   │   ├── rent/               # BookingCard, CycleSelector

│   │   │   ├── governance/         # ProposalList, VoteButton

│   │   │   ├── ui/                 # Reusable Base Components 
(Shadcn)

│   │   │   └── shared/             # WalletButton, Header, Footer

│   │   ├── hooks/                  # Logic Encapsulation

│   │   │   ├── useRentProgram.ts   # Anchor Program Interaction

│   │   │   └── useVaultData.ts     # Real-time Account Subscriptions

│   │   ├── lib/

│   │   │   ├── solana/             # Connection & PDA Derivation 
Logic

│   │   │   ├── constants/          # Static Config & Program IDs

│   │   │   └── utils/              # Bignumber & Currency Formatters

│   │   ├── providers/              # Context: Wallet, Theme, 
QueryClient

│   │   └── types/                  # Shared TS Interfaces

│   ├── next.config.js

│   ├── tailwind.config.ts

│   └── tsconfig.json

│

├── api/                            # OPTIONAL: EXTERNAL BACKEND 
(Node.js)

│   └── src/                        # Oracle workers & Off-chain 
Metadata gen

│

├── scripts/                        # DevOps: deploy.sh, seed_data.ts

└── docs/                           # Protocol Specs & Security Audits
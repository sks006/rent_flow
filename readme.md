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

├── web/                                       # FRONTEND (Vite + React + TypeScript + Tailwind)

│   ├── public/

│   │   ├── vite.svg

│   │   └── favicon.ico

│   ├── src/


│   │   ├── app/                               # Main app components

│   │   │   ├── Layout.tsx                     # Main layout with navigation

│   │   │   ├── HomePage.tsx                   # Landing page

│   │   │   ├── Dashboard.tsx                  # User dashboard

│   │   │   ├── RentFlow.tsx                   # Rent management interface

│   │   │   └── Governance.tsx                 # Governance voting interface


│   │   ├── components/

│   │   │   ├── common/

│   │   │   │   ├── Header.tsx                 # Navigation header

│   │   │   │   ├── Footer.tsx                 # Page footer

│   │   │   │   ├── Sidebar.tsx                # Side navigation

│   │   │   │   ├── Card.tsx                   # Reusable card component

│   │   │   │   ├── Button.tsx                 # Custom button component

│   │   │   │   ├── Modal.tsx                  # Modal dialog component

│   │   │   │   └── Toast.tsx                  # Notification toast

│   │   │   ├── wallet/

│   │   │   │   ├── WalletProvider.tsx         # Wallet connection provider

│   │   │   │   ├── WalletButton.tsx           # Wallet connect button

│   │   │   │   └── WalletBalance.tsx          # Display wallet balance


│   │   │   ├── rent/

│   │   │   │   ├── BookingCard.tsx            # Visualizes the RWA Asset

│   │   │   │   ├── CycleSelector.tsx          # UI for choosing lock periods

│   │   │   │   ├── RentCalculator.tsx         # Calculate rent requirements


│   │   │   │   ├── DepositWithdraw.tsx        # Deposit/withdraw interface

│   │   │   │   └── AccountStatus.tsx          # Display account status

│   │   │   └── governance/

│   │   │       ├── ProposalCard.tsx           # Display proposal

│   │   │       ├── VoteButton.tsx             # Voting interface

│   │   │       └── ProposalList.tsx           # List of proposals

│   │   ├── hooks/

│   │   │   ├── useRentFlow.ts                 # Anchor Program interactivity


│   │   │   ├── useCycleLock.ts                # Handles cycle interactions
│   │   │   ├── useGovernance.ts               # Governance contract interactions

│   │   │   ├── useWallet.ts                   # Wallet state management

│   │   │   └── useToast.ts                    # Toast notification hook

│   │   ├── contexts/

│   │   │   ├── WalletContext.tsx              # Wallet provider context

│   │   │   ├── ToastContext.tsx               # Toast notification context

│   │   │   └── RentFlowContext.tsx            # Rent flow state context

│   │   ├── utils/

│   │   │   ├── constants.ts                   # App constants (RPC endpoints, program IDs)

│   │   │   ├── helpers.ts                     # Helper functions

│   │   │   ├── solana.ts                      # Solana-specific utilities

│   │   │   └── formatters.ts                  # Data formatting utilities

│   │   ├── styles/

│   │   │   ├── globals.css                    # Global CSS styles

│   │   │   ├── themes.css                     # Theme variables


│   │   │   └── animations.css                 # CSS animations

│   │   ├── types/

│   │   │   ├── index.ts                       # TypeScript type definitions

│   │   │   ├── solana.ts                      # Solana-related types

│   │   │   └── rentflow.ts                    # RentFlow-specific types

│   │   ├── lib/

│   │   │   └── api.ts                         # API client for backend

│   │   ├── config/

│   │   │   ├── chains.ts                      # Chain configurations

│   │   │   └── programs.ts                    # Program configurations

│   │   ├── assets/

│   │   │   ├── images/                        # Image assets

│   │   │   ├── icons/                         # SVG icons

│   │   │   └── fonts/                         # Custom fonts

│   │   ├── pages/                             # (Optional) For pages router if needed

│   │   ├── main.tsx                           # Application entry point

│   │   ├── App.tsx                            # Root App component

│   │   └── vite-env.d.ts                      # Vite environment types

│   ├── index.html                             # Main HTML file

│   ├── package.json                           # Dependencies and scripts

│   ├── package-lock.json                      # Lock file


│   ├── tsconfig.json                          # TypeScript configuration

│   ├── tsconfig.node.json                     # Node TypeScript config

│   ├── vite.config.ts                         # Vite configuration

│   ├── tailwind.config.js                     # Tailwind CSS configuration

│   ├── postcss.config.js                      # PostCSS configuration

│   ├── .env.example                           # Environment variables example

│   ├── .gitignore                             # Git ignore rules

│   ├── eslint.config.js                       # ESLint configuration

│   ├── README.md                              # Frontend README

│   └── vercel.json                            # Vercel deployment config (if deploying)

├── scripts/

│   ├── deploy.sh

│   └── test_ci.yml

├── docs/

│   ├── README.md

│   └── architecture.md

└── security/
    └── audit_notes.md
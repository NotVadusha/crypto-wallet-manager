# Wallet Manager

A Next.js dashboard for viewing an Ethereum wallet’s balance, portfolio value, and profit/loss over time. Supports a configurable ERC-20 token (default USDC), deposit (show address) and withdraw (ETH or token) flows, and an editable wallet name and avatar.

## Features

- **My Wallet card**
  - ETH and token balances with total portfolio value (USD)
  - Daily change and percentage
  - Editable wallet name (persisted in `localStorage`)
  - Custom avatar (upload image, persisted per address)
  - “Joined” date from first on-chain transaction (via Etherscan)
  - **Deposit** – opens a modal with the wallet address and copy
  - **Withdraw** – modal to send ETH or the configured ERC-20 token to an address (with validation and balance checks)

- **Profit/Loss card**
  - Time range selector: 1H, 6H, 1D, 1W, 1M, All
  - Chart built from Etherscan transaction history (ETH in/out over time, valued in USD)
  - Hover tooltip with value and date
  - Server-side data with in-memory caching

- **Backend / data**
  - Wallet data and chart data fetched in server actions
  - Etherscan API for balances, ETH price, transaction history, and “first seen” timestamp
  - Ethereum RPC (e.g. Infura) for sending transactions and reading token info/balances
  - Caching for wallet and chart responses to reduce API usage

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, custom Euclid Circular font
- **Blockchain:** ethers.js 6
- **Charts:** Recharts, `number-flow` for animated numbers
- **UI:** Radix-based components (dialog, avatar, button, input, etc.), Motion for animations

## Getting started

### Prerequisites

- Node.js (v18+)
- Ethereum RPC URL (e.g. [Infura](https://infura.io))
- [Etherscan API key](https://etherscan.io/apis) (for balances, history, ETH price)

### Setup

1. Clone and install dependencies:

   ```bash
   git clone <repo-url>
   cd wallet-manager
   npm install
   ```

2. Copy the example env and set your keys:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env`:

   - **Read-only (e.g. MetaMask-style):** set `WALLET_PUBLIC_KEY` to your wallet address. Leave `WALLET_PRIVATE_KEY` unset if you only want to view data (withdraw will still require a key).
   - **Full (send transactions):** set `WALLET_PRIVATE_KEY` (and keep `WALLET_PUBLIC_KEY` for display) **or** `WALLET_MNEMONIC` (12 words).
   - **Etherscan:** `ETHERSCAN_API_KEY=your_key`
   - **RPC:** `ETH_RPC_URL=https://mainnet.infura.io/v3/<your-infura-key>`
   - **Token (optional):** `TOKEN_CONTRACT_ADDRESS` – default is USDC on mainnet.

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable                  | Required | Description |
|---------------------------|----------|-------------|
| `ETHERSCAN_API_KEY`       | Yes      | Etherscan API key for balances, history, ETH price. |
| `ETH_RPC_URL`             | Yes      | Ethereum JSON-RPC URL (e.g. Infura). |
| `WALLET_PUBLIC_KEY`       | Yes*     | Wallet address (for display and read-only data). |
| `WALLET_PRIVATE_KEY`      | For send | Private key for sending ETH/tokens (omit if read-only). |
| `WALLET_MNEMONIC`         | Alt      | 12-word mnemonic instead of `WALLET_PRIVATE_KEY`. |
| `TOKEN_CONTRACT_ADDRESS`  | No       | ERC-20 contract to track; default is USDC mainnet. |

\* Either `WALLET_PUBLIC_KEY` (address only) or `WALLET_MNEMONIC` / `WALLET_PRIVATE_KEY` must be set.

## Scripts

- `npm run dev` – start development server
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – run ESLint

## Project structure

```
├── app/
│   ├── actions/          # Server actions: wallet, chart, transactions, cache
│   ├── layout.tsx         # Root layout, fonts
│   ├── page.tsx          # Home: My Wallet + Profit/Loss cards
│   └── globals.css
├── components/
│   ├── buttons/          # Deposit, Withdraw
│   ├── cards/
│   │   ├── MyWalletCard/ # Header, balance, actions, avatar, wallet info
│   │   └── ProfitLossCard/ # Period selector, chart, summary
│   ├── modals/           # DepositModal, WithdrawModal
│   ├── ui/                # Dialog, Button, Input, Avatar, etc.
│   ├── EditableTitle.tsx
│   └── GrowthArrow.tsx
├── hooks/                 # e.g. useContainerWidth for chart
├── lib/
│   ├── address.ts
│   ├── chart-utils.ts
│   ├── ethereum.ts        # Provider, wallet, send ETH/token, token info
│   ├── etherscan.ts       # Etherscan API client
│   ├── image-utils.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── validation.ts
│   └── wallet-storage.ts  # localStorage for name/avatar per address
└── public/                # Fonts, assets
```

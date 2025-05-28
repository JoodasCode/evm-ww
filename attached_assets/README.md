# Wallet Whisperer Backend

This repository contains the backend services for Wallet Whisperer, a Solana wallet analytics dashboard that provides psycho-emotional insights about trading behavior.

## Overview

The Wallet Whisperer backend provides essential services for:

- Fetching token balances from Helius
- Enriching token data with price information from Moralis
- Calculating and retrieving Whisperer Scores
- Caching data with Redis for optimal performance

## Services

### Wallet Services
- **Token Balance Service**: Fetches and enriches token balances with price data
- **Transaction Service**: Retrieves and analyzes transaction history

### Analytics Services
- **Whisperer Score Service**: Calculates psychological trading profile metrics
- **Trading Activity Service**: Analyzes trading patterns and behaviors

### Infrastructure
- **Redis Caching**: Optimizes performance with configurable TTL
- **API Clients**: Standardized interfaces for Helius and Moralis

## Getting Started with Replit

### 1. Create a New Replit Project

1. Go to [Replit](https://replit.com)
2. Create a new project
3. Choose "Import from GitHub"
4. Enter the repository URL

### 2. Set Up Environment Variables

Add the following secrets in your Replit environment:

```
HELIUS_API_KEY=your-helius-api-key
MORALIS_API_KEY=your-moralis-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
REDIS_URL=your-redis-url (optional)
```

### 3. Install Dependencies

Run the following command in the Replit shell:

```bash
npm install
```

### 4. Build the Project

```bash
npm run build
```

### 5. Run the Example

```bash
npm start
```

## Using the Services

Here's a simple example of how to use the services:

```typescript
import { getTokenBalances, getWhispererScore } from 'wallet-whisperer-backend';

// Get token balances for a wallet
const tokens = await getTokenBalances('WALLET_ADDRESS');
console.log(`Found ${tokens.length} tokens`);

// Get Whisperer Score
const score = await getWhispererScore('WALLET_ADDRESS');
console.log('Whisperer Score:', score?.whisperer_score);
```

## API Documentation

### Token Balance Service

```typescript
getTokenBalances(walletAddress: string): Promise<TokenBalance[]>
```

Returns an array of token balances with the following structure:

```typescript
interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  usdValue: number;
  logo?: string;
  category?: string;
  change24h?: number;
}
```

### Whisperer Score Service

```typescript
getWhispererScore(walletAddress: string): Promise<WhispererScoreRecord | null>
```

Returns the Whisperer Score record for a wallet:

```typescript
interface WhispererScoreRecord {
  id?: string;
  address: string;
  whisperer_score: number;
  degen_score: number;
  roi_score: number;
  portfolio_value: number;
  daily_change: number;
  weekly_change: number;
  current_mood: string;
  trading_frequency: string;
  risk_level: string;
  avg_trade_size: number;
  daily_trades: number;
  profit_loss: number;
  influence_score: number;
  created_at: string;
  updated_at: string;
  archetype?: string;
}
```

## License

MIT

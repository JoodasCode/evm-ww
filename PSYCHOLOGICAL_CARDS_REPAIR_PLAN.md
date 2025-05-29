# Wallet Whisperer: Psychological Cards Repair Plan

## Phase 1: Data Sanitization Layer (Week 1)

### 1.1 Helius Transaction Cleaning
**Goal**: Filter out noise and ensure we only analyze meaningful trading behavior

**Implementation**:
- Build `HeliusDataSanitizer` class
- Filter dust transactions (< $0.50 USD value)
- Remove honeypot/rug tokens using liquidity checks
- Expand DEX recognition beyond Jupiter/Orca/Raydium
- Add PumpSwap, Meteora, Lifinity, GooseFX detection

**Validation**:
- Compare Cented's 96 transactions → expect ~40-60 meaningful trades
- Verify each token has valid price feed from Gecko/Moralis
- Ensure all DEX swaps are properly classified

### 1.2 Token Metadata Validation
**Goal**: Only analyze tradeable, liquid assets

**Implementation**:
- Cross-reference tokens with Coingecko/Moralis price APIs
- Check liquidity depth on major DEXes
- Flag and exclude tokens with zero trading volume
- Build honeypot detection using sellability patterns

**Success Criteria**:
- 95%+ of analyzed tokens have valid USD pricing
- Zero phantom tokens in diversification calculations

## Phase 2: Core Calculation Fixes (Week 2)

### 2.1 Position Sizing Psychology - CRITICAL FIX
**Current Issue**: 0% consistency due to comparing raw token amounts across decimals

**Fix**:
```typescript
// Before: comparing raw tokenAmount values
const positions = transactions.map(tx => tx.tokenTransfers[0]?.tokenAmount || 0);

// After: normalize to USD value
const positions = transactions.map(tx => {
  const tokenAmount = tx.tokenTransfers[0]?.tokenAmount || 0;
  const tokenPrice = getTokenPrice(tx.tokenTransfers[0]?.mint);
  return tokenAmount * tokenPrice; // USD position size
});
```

**Expected Result**: Cented should show 60-80% consistency (systematic sizing)

### 2.2 Conviction Collapse - LOGIC OVERHAUL
**Current Issue**: Only detecting literal "swap" descriptions, missing most patterns

**Fix**:
- Detect token transfer reversals within timeframes
- Track buy → sell patterns regardless of description
- Factor in position size changes and hold time
- Weight by USD value, not transaction count

**Expected Result**: Cented should show 15-25% collapse events (reasonable for active trader)

### 2.3 Diversification - VALUE-WEIGHTED APPROACH
**Current Issue**: 25 tokens = "over-diversified" ignoring position sizes

**Fix**:
```typescript
// Before: unique token count
const diversification = uniqueTokens.size;

// After: concentration by value
const totalValue = positions.reduce((sum, pos) => sum + pos.usdValue, 0);
const top5Value = positions.slice(0, 5).reduce((sum, pos) => sum + pos.usdValue, 0);
const concentration = (top5Value / totalValue) * 100;
```

**Expected Result**: Cented should show "Concentrated" (likely 80%+ in top 3 positions)

## Phase 3: Psychological Logic Reconciliation (Week 3)

### 3.1 Contradiction Detection
**Goal**: Ensure card outputs don't contradict each other

**Implementation**:
- High transaction frequency should reduce conviction scores
- Premium fee strategy should correlate with lower stress
- FOMO behavior should align with degen scoring
- Diversification should match risk tolerance

### 3.2 Behavioral Consistency Checks
**Rules to implement**:
- If whisperer_score > 80 AND transaction_frequency > 2/day → reduce conviction by 20%
- If avg_fee > 8M lamports → reduce stress_score by 30%
- If position_variance < 0.3 → increase patience_score by 15%

## Phase 4: Real Data Validation (Week 4)

### 4.1 Multi-Wallet Testing
**Test Subjects**:
- Cented (Whale Premium Strategist)
- dV (Portfolio Sprayer)
- Letterbomb (Known patterns)
- Fresh anon wallets

**Validation Criteria**:
- Profiles should feel intuitive to human analysis
- No logical contradictions between cards
- Behavioral differences should be clear and explainable

### 4.2 Manual Spot Checks
**Process**:
- Pick 10 random transactions from each test wallet
- Manually verify position sizing, timing, token quality
- Ensure psychological insights match observable patterns

## Phase 5: Enhanced Data Sources (Week 5)

### 5.1 Advanced Token Intelligence
**Add**:
- Birdeye honeypot detection API
- DexScreener verified token flags
- GeckoTerminal liquidity depth data
- Custom rug detection heuristics

### 5.2 DEX Coverage Expansion
**Implement**:
- PumpSwap transaction parsing
- Meteora swap detection
- Lifinity, GooseFX, Phoenix support
- Generic DEX fallback using instruction analysis

## Implementation Priority

### Immediate (This Week):
1. Fix Position Sizing Psychology calculation
2. Overhaul Conviction Collapse detection logic
3. Implement value-weighted diversification

### Next Priority:
1. Build HeliusDataSanitizer class
2. Add contradiction detection between cards
3. Test with multiple wallets for validation

### Future Enhancement:
1. Advanced token filtering
2. Expanded DEX support
3. Psychological consistency validation

## Success Metrics

**Before Fixes** (Cented Profile):
- Position Sizing: 0% consistency (broken)
- Conviction: 100% (too high for 96 transactions)
- Diversification: Over-diversified (ignores position value)

**After Fixes** (Expected Cented Profile):
- Position Sizing: 70-80% consistency (systematic whale behavior)
- Conviction: 60-75% (high but adjusted for frequency)
- Diversification: Concentrated (value-weighted analysis)

## Quality Gates

1. **Math Audit Pass**: All calculations use normalized USD values
2. **Logic Consistency**: No contradictory psychological insights
3. **Human Intuition Test**: Profiles match observable trading behavior
4. **Data Integrity**: 95%+ of analyzed transactions are meaningful trades

This repair plan transforms the system from producing contradictory insights to providing genuine psychological intelligence that traders can trust and act upon.
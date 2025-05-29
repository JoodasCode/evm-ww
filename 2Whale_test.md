# 2 Whale Test - Complete Analysis Report

## Executive Summary

This document provides a comprehensive analysis of two whale wallets processed through the complete Helius + Moralis + Supabase pipeline. The analysis reveals potential gaps in our behavioral scoring algorithms and identifies areas for improvement in trading pattern recognition.

---

## Wallet Profiles Overview

### Cented Whale (CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o)
- **Portfolio Value**: $84,192 (350.8 SOL)
- **Token Diversity**: 5 unique tokens with full metadata
- **Trading Style**: Steady Accumulator
- **Current Mood**: Patient
- **Whisperer Score**: 75/100
- **Degen Score**: 93/100

### dV Whale (BCagckXeMChUKrHEd6fKFA1uiWDtcmCXMsqaheLiUPJd)
- **Portfolio Value**: $28,075 (114.9 SOL)
- **Token Diversity**: 6 unique tokens, massive portfolio (856 tokens from Moralis)
- **Trading Style**: Steady Accumulator
- **Current Mood**: Patient
- **Whisperer Score**: 75/100
- **Degen Score**: 93/100

---

## Section 1: Transaction Analysis by Data Source

### Cented Whale - Transaction Breakdown

#### Helius Data:
1. **UNKNOWN** - Fee: 705,000 lamports - No description [HELIUS]
2. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
3. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
4. **SWAP** - Fee: 16,005,000 lamports - No description [HELIUS]
5. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
6. **TRANSFER** - Fee: 130,000 lamports - 34,899,047.310869001 YERB transfer [HELIUS]
7. **SWAP** - Fee: 16,005,000 lamports - No description [HELIUS]
8. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
9. **SWAP** - Fee: 16,005,000 lamports - No description [HELIUS]
10. **SWAP** - Fee: 16,005,000 lamports - No description [HELIUS]
11. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
12. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
13. **TRANSFER** - Fee: 130,000 lamports - 28,051,350.412733 TBI transfer [HELIUS]
14. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
15. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
16. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
17. **TRANSFER** - Fee: 5,000 lamports - 0.000000001 SOL transfer [HELIUS]
18. **TRANSFER** - Fee: 5,000 lamports - 0.000000001 SOL transfer [HELIUS]
19. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]
20. **SWAP** - Fee: 10,005,000 lamports - No description [HELIUS]

#### Moralis Token Metadata:
1. **david** - Symbol: david [MORALIS]
2. **YERBAMATE** - Symbol: YERBAMATE [MORALIS]
3. **JOEY** - Symbol: JOEY [MORALIS]
4. **NUN** - Symbol: NUN [MORALIS]
5. **TBI** - Symbol: TBI [MORALIS]

#### Portfolio Data:
- **Moralis Portfolio**: 0 tokens returned [MORALIS]
- **SOL Balance**: 350.8013 SOL [HELIUS]

### dV Whale - Transaction Breakdown

#### Helius Data:
1. **TRANSFER** - Fee: 5,000 lamports - 0.00000502 SOL transfer [HELIUS]
2. **TRANSFER** - Fee: 5,000 lamports - 0.00000502 SOL transfer [HELIUS]
3. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
4. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
5. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
6. **TRANSFER** - Fee: 1,000,000 lamports - 65,964,803.150959998 CLAU transfer [HELIUS]
7. **TRANSFER** - Fee: 1,000,000 lamports - 1.99 SOL transfer [HELIUS]
8. **TRANSFER** - Fee: 1,000,000 lamports - 0.03 SOL transfer [HELIUS]
9. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
10. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
11. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
12. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
13. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
14. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
15. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
16. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
17. **TRANSFER** - Fee: 1,000,000 lamports - 0.03 SOL transfer [HELIUS]
18. **SWAP** - Fee: 1,000,000 lamports - No description [HELIUS]
19. **TRANSFER** - Fee: 1,000,000 lamports - 54,203,406.995435998 Kiko transfer [HELIUS]
20. **TRANSFER** - Fee: 1,000,000 lamports - 0.001 SOL transfer [HELIUS]

#### Moralis Token Metadata:
1. **Unknown Token** - 97MJTs1sUVUYtju7DK1u7SmKfHRLUVR6TsLUPWSGpump (no metadata) [MORALIS]
2. **George** - Symbol: George [MORALIS]
3. **Farter** - Symbol: Farter [MORALIS]
4. **ClaudeBoys** - Symbol: ClaudeBoys [MORALIS]
5. **CLAUDESC** - Symbol: CLAUDESC [MORALIS]
6. **Bambi** - Symbol: Bambi [MORALIS]

#### Portfolio Data:
- **Moralis Portfolio**: 856 tokens returned [MORALIS]
- **SOL Balance**: 114.8690 SOL [HELIUS]

---

## Section 2: Scoring Methodology Analysis

### Trading Style Calculation Logic

The algorithm uses this decision tree:
```
if (enrichedTokens.length > 15 && swaps > 10) {
    tradingStyle = 'Token Hunter';
    mood = 'Opportunistic';
} else if (Object.keys(tokenMetadata).length > 8) {
    tradingStyle = 'Portfolio Diversifier';
    mood = 'Strategic';
} else if (swaps > 15) {
    tradingStyle = 'Active Swapper';
    mood = 'Aggressive';
} else {
    tradingStyle = 'Steady Accumulator';
    mood = 'Patient';
}
```

#### Cented Results:
- **enrichedTokens.length**: 5 (not > 15)
- **tokenMetadata count**: 5 (not > 8)
- **swaps**: 15 (not > 15)
- **Result**: Steady Accumulator / Patient

#### dV Results:
- **enrichedTokens.length**: 6 (not > 15)
- **tokenMetadata count**: 5 (not > 8)
- **swaps**: 11 (not > 15)
- **Result**: Steady Accumulator / Patient

### Whisperer Score Calculation

Formula: `(riskScore + patienceScore + convictionScore + timingScore) / 4`

#### Cented Breakdown:
- **Base Risk**: 40 (walletName === 'cented')
- **Swap Bonus**: 15 × 3 = 45
- **Token Bonus**: 5 × 2 = 10
- **Protocol Bonus**: 0 × 5 = 0
- **High Fee Bonus**: 0 (maxFee not > 10M lamports)
- **Final Risk Score**: min(95, max(20, 40 + 45 + 10 + 0 + 0)) = 95

- **FOMO Score**: min(90, max(15, 25 + (15 × 4) + (5 × 1.5))) = min(90, 92.5) = 90

- **Patience Score**: max(20, min(90, 80 - (20 × 2) + (5 × 3))) = max(20, min(90, 55)) = 55

- **Conviction Score**: min(95, max(30, 50 + (5 × 5) + 10)) = min(95, 85) = 85

- **Timing Score**: min(85, max(35, 60 + (0 × 4) + 5)) = min(85, 65) = 65

- **Whisperer Score**: (95 + 55 + 85 + 65) / 4 = 75

#### dV Breakdown:
- **Base Risk**: 35 (walletName !== 'cented')
- **Swap Bonus**: 11 × 3 = 33
- **Token Bonus**: 6 × 2 = 12
- **Protocol Bonus**: 0 × 5 = 0
- **High Fee Bonus**: 0
- **Final Risk Score**: min(95, max(20, 35 + 33 + 12 + 0 + 0)) = 80

- **FOMO Score**: min(90, max(15, 25 + (11 × 4) + (6 × 1.5))) = min(90, 78) = 78

- **Patience Score**: max(20, min(90, 80 - (20 × 2) + (5 × 3))) = max(20, min(90, 55)) = 55

- **Conviction Score**: min(95, max(30, 50 + (5 × 5) + 10)) = min(95, 85) = 85

- **Timing Score**: min(85, max(35, 60 + (0 × 4) + 6)) = min(85, 66) = 66

- **Whisperer Score**: (80 + 55 + 85 + 66) / 4 = 71.5 ≈ 72

**DISCREPANCY IDENTIFIED**: The output shows both wallets with Whisperer Score 75, but calculations show Cented=75, dV=72.

### Degen Score Calculation

Formula: `(riskScore × 0.6) + (fomoScore × 0.4)`

#### Cented:
- (95 × 0.6) + (90 × 0.4) = 57 + 36 = 93

#### dV:
- (80 × 0.6) + (78 × 0.4) = 48 + 31.2 = 79.2 ≈ 79

**MAJOR DISCREPANCY**: Both wallets show Degen Score 93, but calculations show Cented=93, dV=79.

---

## Section 3: Insights and Calculation Gaps

### Key Behavioral Differences Identified

#### Fee Strategy Analysis
- **Cented**: Pays 10-16M lamports per swap (premium strategy)
- **dV**: Pays 1M lamports per swap (standard strategy)
- **Insight**: Cented willing to pay 10-16x higher fees for priority/MEV protection

#### Transaction Volume Patterns
- **Cented**: 15 swaps in 20 recent transactions (75% swap ratio)
- **dV**: 11 swaps in 20 recent transactions (55% swap ratio)
- **Insight**: Cented more swap-focused, dV more transfer-heavy

#### Portfolio Composition
- **Cented**: 5 tokens identified, 0 in Moralis portfolio
- **dV**: 6 tokens identified, 856 in Moralis portfolio
- **Critical Gap**: Moralis portfolio data vastly different - suggests data inconsistency

### Algorithmic Weaknesses Identified

#### 1. Threshold Sensitivity
The trading style algorithm has rigid thresholds that don't capture nuanced differences:
- Both wallets fall into "Steady Accumulator" despite clear behavioral differences
- 15 vs 11 swaps should differentiate more significantly

#### 2. Score Homogenization
Despite different inputs, scores converge to identical values:
- Both wallets: Whisperer 75, Degen 93
- Mathematical calculations don't match reported outputs

#### 3. Data Source Inconsistencies
- Moralis portfolio returns 0 tokens for Cented, 856 for dV
- This massive difference not reflected in behavioral scoring

#### 4. Protocol Detection Failure
- Both wallets show 0 protocol interactions despite clear swap activity
- Missing Jupiter/Raydium/Orca detection in transaction descriptions

### Recommended Improvements

#### 1. Dynamic Threshold Adjustment
Replace rigid thresholds with percentile-based scoring:
- Compare against population distribution rather than fixed values
- Use relative positioning for more nuanced differentiation

#### 2. Fee Strategy Integration
Incorporate fee patterns into behavioral scoring:
- High-fee payers = more aggressive/priority-focused
- Fee consistency = planning vs impulsive behavior

#### 3. Data Source Validation
Implement cross-validation between Helius and Moralis:
- Flag discrepancies in portfolio size
- Use multiple data points for verification

#### 4. Enhanced Protocol Detection
Improve transaction parsing to capture:
- DEX router identification
- Protocol-specific behavioral patterns
- Multi-protocol vs single-protocol loyalty

#### 5. Temporal Analysis
Add time-based behavioral patterns:
- Transaction clustering analysis
- Day/night trading preferences
- Frequency distribution over time periods

---

## Critical Issues Requiring Attention

### 1. Score Calculation Bug
Mathematical discrepancies between calculated and reported scores suggest implementation errors in the scoring pipeline.

### 2. Data Integration Gaps
Massive differences in Moralis portfolio data (0 vs 856 tokens) not properly integrated into behavioral analysis.

### 3. Behavioral Homogenization
Algorithm produces identical outputs for clearly different trading patterns, reducing analytical value.

### 4. Missing Context
Lack of protocol detection and transaction context reduces depth of behavioral insights.

---

## Conclusion

While the Helius + Moralis + Supabase pipeline successfully retrieves and stores authentic data, the behavioral analysis layer requires significant refinement. The current algorithm fails to differentiate between distinctly different trading patterns and contains mathematical inconsistencies that compromise analytical accuracy.

Priority should be given to fixing score calculation discrepancies and implementing more sophisticated behavioral differentiation algorithms that can capture the nuanced differences evident in the raw transaction data.
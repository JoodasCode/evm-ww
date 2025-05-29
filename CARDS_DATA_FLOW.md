# Cards Endpoint Data Flow Documentation

## Overview

The cards endpoint implements a Redis/Postgres fallback system to efficiently serve psychological analysis cards without triggering unnecessary wallet re-analysis.

## Data Flow Architecture

```
1. Redis Cache Check (Primary)
   ↓ [MISS]
2. Postgres Stored Analysis (Fallback)
   ↓ [MISS]
3. Fresh Analysis Pipeline (Last Resort)
```

## Expected Behavior

### When Cached Data Exists
- **Redis HIT**: Returns analysis data from Redis cache (fastest)
- **Postgres HIT**: Returns stored analysis from `wallet_scores` + `wallet_behavior` tables
- **No fresh analysis triggered**: Uses existing processed data

### When No Data Exists
- **Fresh Analysis**: Triggers `analyzeWallet()` to process blockchain transactions
- **Storage**: Saves results to both Postgres tables and Redis cache
- **Future requests**: Will hit cache layers instead of re-analyzing

## Database Tables

### `wallet_scores`
Contains high-level wallet metrics:
- `whisperer_score`, `degen_score`, `roi_score`, `influence_score`
- `portfolio_value`, `total_transactions`
- `last_analyzed_at` (timestamp for cache validation)

### `wallet_behavior` 
Contains psychological analysis data:
- `risk_score`, `fomo_score`, `patience_score`, `conviction_score`
- `archetype`, `confidence`, `emotional_states`, `behavioral_traits`

## Key Implementation Details

### Shared Database Connection
- Both analysis pipeline and cards endpoint use `server/db.ts`
- Prevents connection mismatches that caused re-analysis loops
- Single source of truth for database access

### Cache TTL Strategy
- Redis: Short-term caching for immediate repeat requests
- Postgres: Long-term storage for historical analysis data
- Automatic fallback when cache layers fail

## Adding New Card Types

When implementing new psychological card types:

1. **Add card logic to `cardController.ts`**
2. **Ensure data is stored in existing tables** (`wallet_scores`/`wallet_behavior`)
3. **Test cache behavior** with Redis/Postgres fallback
4. **Verify no fresh analysis is triggered** for existing wallets

## Troubleshooting

### Common Issues
- **Re-analysis loop**: Check if both pipeline and cards use shared DB connection
- **Cache misses**: Verify Redis connection and TTL settings
- **Schema errors**: Ensure queries match actual table columns

### Debug Logs
- `[REDIS HIT/MISS]`: Cache layer status
- `[POSTGRES HIT/MISS]`: Database fallback status
- `[ANALYSIS TRIGGERED]`: Fresh analysis initiated (should be rare)
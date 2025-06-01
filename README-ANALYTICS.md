# Wallet Whisperer Analytics System

Wallet Whisperer now includes a comprehensive analytics and activity logging system that tracks user behavior, authentication flows, card usage, and system performance across the application.

## Core Components

### `ActivityLogService`

The central logging service that handles all analytics events throughout the application:

- Queues logs and flushes them in configurable batches (default: every 30 seconds)
- Persists data to Supabase when available
- Gracefully degrades when offline or when external services are unavailable
- Provides detailed console logging in development environments
- Supports structured log types with standardized schemas

```typescript
import { ActivityType, logAuthActivity } from '@/services/ActivityLogService';

// Log a basic activity
logAuthActivity(
  ActivityType.LOGIN,
  userId,
  walletAddress,
  { method: 'google', extraInfo: 'any additional context' }
);
```

## Activity Types

The system tracks various activity types across different domains:

### Authentication Events
- `LOGIN` - User login via any method
- `LOGOUT` - User logout
- `WALLET_CONNECT` - Wallet connection attempt (success/failure)
- `WALLET_DISCONNECT` - Wallet disconnection
- `WALLET_LINK` - Linking wallet to user account
- `WALLET_UNLINK` - Removing wallet from user account
- `PREMIUM_UPGRADE` - User upgraded to premium

### Card Events
- `CARD_VIEW` - User viewed a card
- `CARD_CALCULATION` - Card calculation was performed
- `CARD_REFRESH` - Card data was refreshed

### General Events
- `PAGE_VIEW` - User viewed a page
- `FEATURE_USE` - User used a specific feature
- `ERROR` - Error occurred

## Integration Points

The analytics system is integrated at key points throughout the application:

### Authentication Flow
- All authentication events in `useAuth` hook
- Google OAuth sign-in/sign-out
- Session restoration
- Premium upgrades

### Wallet Connection
- Connection attempts (success/failure)
- Disconnection events
- Detailed error tracking

### Page Views
- Automatic tracking via `PageViewTracker` component
- Captures current path, user ID, and authentication state

### Card Interactions
- `useCardTracking` hook for all card-related activities
- Tracks views, calculations, and refreshes

## Usage Examples

### Tracking Authentication Events

```typescript
import { ActivityType, logAuthActivity } from '@/services/ActivityLogService';

// In authentication flow
logAuthActivity(
  ActivityType.LOGIN,
  user.id,
  null,
  { method: 'google', success: true }
);
```

### Tracking Card Activities

```typescript
import { useCardTracking } from '@/hooks/useCardTracking';

function CardComponent({ cardId }) {
  const { trackCardView, trackCardCalculation, trackCardRefresh } = useCardTracking();
  
  useEffect(() => {
    // Log when card is viewed
    trackCardView(cardId, { source: 'dashboard' });
  }, [cardId, trackCardView]);
  
  const handleCalculate = () => {
    // Log calculation
    trackCardCalculation(cardId, { calculationType: 'full' });
    // Perform calculation...
  };
}
```

### Tracking Page Views

The `PageViewTracker` component is already integrated in the main app layout:

```typescript
// App.tsx
<PageViewTracker>
  <AuthenticatedRoutes />
</PageViewTracker>
```

### Custom Event Tracking

For custom events not covered by the helper functions:

```typescript
import { activityLogService, ActivityType } from '@/services/ActivityLogService';

// Track any custom event
activityLogService.log({
  userId: currentUser?.id,
  walletAddress: currentWallet?.address,
  activityType: ActivityType.FEATURE_USE,
  details: {
    featureName: 'export_data',
    format: 'csv',
    recordCount: 150
  }
});
```

## Data Storage and Privacy

- All activity data is stored in the `user_activity` table in Supabase
- No sensitive data is logged (passwords, private keys, etc.)
- User IDs and wallet addresses are stored to enable user-specific analytics
- All data is timestamped for time-series analysis

## Future Extensions

The analytics system is designed to be easily extended for:

1. **Admin Dashboard** - Visualize user activity and system performance
2. **User History** - Show users their own activity timeline
3. **Card Usage Analytics** - Track which cards are most popular
4. **Cohort Analysis** - Compare behavior across different user segments
5. **Performance Monitoring** - Track system performance and errors

## Configuration

The activity logging system can be configured in development:

```typescript
// Enable/disable logging
activityLogService.setEnabled(false);

// Force immediate flush of logs
activityLogService.flush(true);

// Clean up resources (e.g., when unmounting)
activityLogService.destroy();
```

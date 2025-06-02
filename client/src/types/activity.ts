/**
 * Activity types for logging user actions
 */
export enum ActivityType {
  // Authentication events
  LOGIN = 'login',
  LOGOUT = 'logout',
  WALLET_CONNECT = 'wallet_connect',
  WALLET_DISCONNECT = 'wallet_disconnect',
  SIGNUP = 'signup',
  
  // Page navigation events
  PAGE_VIEW = 'page_view',
  
  // Feature usage events
  FEATURE_USE = 'feature_use',
  
  // Card interaction events
  CARD_VIEW = 'card_view',
  CARD_CALCULATION = 'card_calculation',
  CARD_REFRESH = 'card_refresh',
  
  // Error events
  ERROR = 'error'
}

/**
 * Activity log entry structure
 */
export interface ActivityLog {
  id?: string;
  user_id: string | null;
  activity_type: ActivityType;
  timestamp: string;
  target_id?: string | null;
  details?: Record<string, any>;
}

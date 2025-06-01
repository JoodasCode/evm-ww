import { supabase } from '@/lib/supabase';

export enum ActivityType {
  // Auth related activities
  LOGIN = 'login',
  LOGOUT = 'logout',
  WALLET_CONNECT = 'wallet_connect',
  WALLET_DISCONNECT = 'wallet_disconnect',
  WALLET_LINK = 'wallet_link',
  WALLET_UNLINK = 'wallet_unlink',
  PREMIUM_UPGRADE = 'premium_upgrade',
  
  // Card related activities
  CARD_VIEW = 'card_view',
  CARD_CALCULATION = 'card_calculation',
  CARD_REFRESH = 'card_refresh',
  
  // General activities
  PAGE_VIEW = 'page_view',
  FEATURE_USE = 'feature_use',
  ERROR = 'error'
}

export interface ActivityLogData {
  userId?: string;
  walletAddress?: string;
  activityType: ActivityType;
  details?: Record<string, any>;
  timestamp?: string;
}

class ActivityLogService {
  private isEnabled = true;
  private queue: ActivityLogData[] = [];
  private isProcessing = false;
  private flushIntervalMs = 30000;
  private flushInterval: NodeJS.Timeout | null;
  private sessionId: string;
  
  // Constructor is private to enforce singleton pattern
  private constructor() {
    // Set up interval for regular flushing
    this.flushInterval = setInterval(() => this.flushLogs(), this.flushIntervalMs);
    
    // Set up event listener for page unload to flush remaining logs
    window.addEventListener('beforeunload', () => this.flushLogs());
    
    // Generate a session ID for this browser session
    this.sessionId = this.generateSessionId();
  }
  
  // Singleton instance
  private static instance: ActivityLogService | null = null;
  
  // Get the singleton instance
  public static getInstance(): ActivityLogService {
    if (!ActivityLogService.instance) {
      ActivityLogService.instance = new ActivityLogService();
    }
    return ActivityLogService.instance;
  }
  
  // Generate a unique session ID
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  // Get the current session ID
  private getSessionId(): string {
    return this.sessionId;
  }
  
  /**
   * Log an activity
   */
  async log(data: ActivityLogData): Promise<void> {
    if (!this.isEnabled) return;
    
    // Add timestamp if not provided
    const logEntry = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString()
    };
    
    // Add to queue
    this.queue.push(logEntry);
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Activity Log] ${logEntry.activityType}`, logEntry);
    }
    
    // Flush immediately if queue gets too large
    if (this.queue.length >= 10) {
      this.flushLogs();
    }
  }
  
  /**
   * Flush the queue to the server
   */
  private async flushLogs(): Promise<void> {
    if (!this.isEnabled || this.queue.length === 0) {
      return;
    }

    try {
      const logsToSend = [...this.queue];
      this.queue = [];
      
      if (import.meta.env.DEV) {
        console.log('[ActivityLogService] Flushing logs:', logsToSend);
      }

      // Process logs in batches to avoid overwhelming Supabase
      for (const log of logsToSend) {
        const { error } = await supabase
          .from('user_activity')
          .insert({
            user_id: log.userId || null,
            wallet_address: log.walletAddress || null,
            activity_type: log.activityType,
            details: log.details || {},
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId(),
            ip_address: null, // Will be captured by RLS on the server
            user_agent: navigator.userAgent
          });
          
        if (error && import.meta.env.DEV) {
          console.error('[ActivityLogService] Error inserting log:', error);
        }
      }
      
      if (import.meta.env.DEV) {
        console.log('[ActivityLogService] Logs flushed successfully');
      }
    } catch (error) {
      // If flush fails, put logs back in queue
      console.error('[ActivityLogService] Error flushing logs:', error);
      // Only keep the last 1000 logs to prevent memory issues
      this.queue = [...this.queue, ...this.queue.slice(0, 1000)];
    }
  }
  
  /**
   * Enable or disable activity logging
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    // If disabling, clear the queue and interval
    if (!enabled) {
      this.queue = [];
      if (this.flushInterval !== null) {
        clearInterval(this.flushInterval);
        this.flushInterval = null;
      }
    } else if (this.flushInterval === null) {
      // If enabling and interval doesn't exist, create it
      this.flushInterval = setInterval(() => this.flushLogs(), this.flushIntervalMs);
    }
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    this.flushLogs();
    this.queue = [];
    window.removeEventListener('beforeunload', () => this.flushLogs());
  }
}

// Export the singleton instance
const activityLogService = ActivityLogService.getInstance();

// Helper functions for common activities
export const logAuthActivity = (
  activityType: ActivityType,
  userId?: string | null,
  walletAddress?: string | null,
  details?: Record<string, any>
): void => {
  activityLogService.log({
    activityType,
    userId: userId || undefined,
    walletAddress: walletAddress || undefined,
    details
  });
};

export const logCardActivity = (
  activityType: ActivityType,
  cardId: string,
  userId?: string | null,
  walletAddress?: string | null,
  details?: Record<string, any>
): void => {
  activityLogService.log({
    activityType,
    userId: userId || undefined,
    walletAddress: walletAddress || undefined,
    details: {
      cardId,
      ...(details || {})
    }
  });
};

// Default export for the service
export default activityLogService;

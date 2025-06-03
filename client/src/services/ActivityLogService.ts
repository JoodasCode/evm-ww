import { supabase } from '../lib/supabase';

export enum ActivityType {
  // Auth related activities
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_ATTEMPT = 'login_attempt',
  SESSION_REFRESH = 'session_refresh',
  WALLET_CONNECT = 'wallet_connect',
  WALLET_DISCONNECT = 'wallet_disconnect',
  WALLET_LINK = 'wallet_link',
  WALLET_UNLINK = 'wallet_unlink',
  WALLET_SIGN = 'wallet_sign',
  WALLET_REMOVE = 'wallet_remove',
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
  walletProfileId?: string;
  activityType: ActivityType;
  details?: Record<string, any>;
  timestamp?: string;
}

export class ActivityLogService {
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
   * @param activityType The type of activity
   * @param userId Optional user ID
   * @param walletAddress Optional wallet address
   * @param details Optional details object
   * @param walletProfileId Optional wallet profile ID
   */
  async log(
    activityType: ActivityType,
    userId: string | null,
    walletAddress: string | null,
    details?: Record<string, any>,
    walletProfileId?: string | null
  ): Promise<void> {
    const data: ActivityLogData = {
      activityType,
      userId: userId || undefined,
      walletAddress: walletAddress || undefined,
      walletProfileId: walletProfileId || undefined,
      details
    };
    return this.logData(data);
  }
  
  /**
   * Log activity data directly
   */
  private async logData(data: ActivityLogData): Promise<void> {
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
    if (this.isProcessing || this.queue.length === 0) return;
    
    try {
      this.isProcessing = true;
      
      // Clone and clear the queue
      const logsToSend = [...this.queue];
      this.queue = [];
      
      // Add session ID to each log
      const sessionId = this.getSessionId();
      const logsWithSession = logsToSend.map(log => ({
        ...log,
        sessionId
      }));
      
      // In a real app, we would send these to the server
      // For now, just log to console in development
      if (import.meta.env.DEV) {
        console.log(`[Activity Log] Flushing ${logsToSend.length} logs`, logsWithSession);
      }
      
      // In production, we would send to the server
      if (import.meta.env.PROD) {
        try {
          // Send to Supabase activity_logs table with correct field mappings
          const logsToInsert = logsWithSession.map(log => ({
            activity_type: log.activityType,
            wallet_address: log.walletAddress ? log.walletAddress.toLowerCase() : null,
            wallet_profile_id: log.walletProfileId || null,
            details: {
              ...log.details,
              user_id: log.userId || null,
              client_timestamp: log.timestamp,
              session_id: log.sessionId,
              client_info: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenSize: `${window.screen.width}x${window.screen.height}`
              }
            },
            timestamp: new Date().toISOString()
          }));
          
          const { error } = await supabase
            .from('activity_logs')
            .insert(logsToInsert);
          
          if (error) {
            console.error('Error sending activity logs:', error);
            // Put logs back in queue
            this.queue = [...logsToSend, ...this.queue];
          }
        } catch (error) {
          console.error('Error sending activity logs:', error);
          // Put logs back in queue
          this.queue = [...logsToSend, ...this.queue];
        }
      }
    } finally {
      this.isProcessing = false;
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
  activityLogService.log(
    activityType,
    userId || null,
    walletAddress || null,
    details
  );
};

export const logCardActivity = (
  activityType: ActivityType,
  cardId: string,
  userId?: string | null,
  walletAddress?: string | null,
  details?: Record<string, any>
): void => {
  activityLogService.log(
    activityType,
    userId || null,
    walletAddress || null,
    {
      cardId,
      ...(details || {})
    }
  );
};

// Default export for the service
export default activityLogService;

import supabaseAdmin, { logSupabaseOperation } from './supabase-admin';

/**
 * Interface for activity log data
 */
export interface ActivityLogData {
  activity_type: string;
  wallet_address: string;
  wallet_profile_id?: string | null;
  details?: Record<string, any>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  blockchain_type?: string;
}

/**
 * Service for logging user activities in the Wallet Whisperer application
 */
export class ActivityLogService {
  private static instance: ActivityLogService;

  private constructor() {}

  /**
   * Get the singleton instance of ActivityLogService
   */
  public static getInstance(): ActivityLogService {
    if (!ActivityLogService.instance) {
      ActivityLogService.instance = new ActivityLogService();
    }
    return ActivityLogService.instance;
  }

  /**
   * Log an activity to Supabase
   */
  async logActivity(data: ActivityLogData): Promise<void> {
    try {
      // Normalize wallet address to lowercase
      const normalizedWalletAddress = data.wallet_address?.toLowerCase();

      // Prepare data with timestamp
      const activityData = {
        ...data,
        wallet_address: normalizedWalletAddress,
        timestamp: new Date().toISOString()
      };

      // Insert activity log
      const { error } = await supabaseAdmin
        .from('activity_logs')
        .insert(activityData);

      // Log the operation in development mode
      logSupabaseOperation(
        `Activity log created: ${data.activity_type} for wallet ${normalizedWalletAddress?.slice(0, 8)}...`,
        error
      );

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  }

  /**
   * Get activity logs for a specific wallet
   * @param walletAddress Optional wallet address to filter by
   * @param limit Maximum number of logs to return (default: 50)
   * @returns Array of activity logs
   */
  async getActivityLogs(walletAddress: string, limit: number = 50): Promise<any[]> {
    try {
      // Normalize wallet address to lowercase
      const normalizedWalletAddress = walletAddress.toLowerCase();

      // Query activity logs
      const { data, error } = await supabaseAdmin
        .from('activity_logs')
        .select('*')
        .eq('wallet_address', normalizedWalletAddress)
        .order('timestamp', { ascending: false })
        .limit(limit);

      // Log the operation in development mode
      logSupabaseOperation(
        `Retrieved ${data?.length || 0} activity logs for wallet ${normalizedWalletAddress.slice(0, 8)}...`,
        error
      );

      if (error) {
        console.error('Error fetching activity logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActivityLogs:', error);
      return [];
    }
  }
}

export default ActivityLogService;

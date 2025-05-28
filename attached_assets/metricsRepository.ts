import { WhispererScore, BehavioralAvatar, MoodState } from '@/types/wallet';
import { DegenScore } from '../analytics/degenScoreService';
import { WalletLabelProfile } from '../analytics/labelEngineService';
import { Alert } from '../notifications/alertService';
import { createClient } from '@supabase/supabase-js';

/**
 * Repository for storing and retrieving psychological metrics
 * 
 * Uses Supabase in production and falls back to in-memory storage for development.
 */

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory storage fallback for development
const metricsStore: Record<string, any> = {};

/**
 * Check if we should use Supabase or fallback to in-memory storage
 */
function shouldUseSupabase(): boolean {
  return process.env.NODE_ENV === 'production' || 
         (!!supabaseUrl && !!supabaseKey);
}

/**
 * Updates the Whisperer Score for a wallet
 * @param walletAddress - The Solana wallet address
 * @param score - The WhispererScore object
 * @returns Promise that resolves when the score is updated
 */
export async function updateWhispererScore(
  walletAddress: string,
  score: WhispererScore
): Promise<void> {
  try {
    if (shouldUseSupabase()) {
      // Store the score in Supabase
      const { error: scoreError } = await supabase
        .from('wallet_metrics')
        .upsert({
          wallet_address: walletAddress,
          whisperer_score: score,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'wallet_address'
        });
      
      if (scoreError) throw scoreError;
      
      // Add a history entry
      const { error: historyError } = await supabase
        .from('score_history')
        .insert({
          wallet_address: walletAddress,
          timestamp: new Date().toISOString(),
          score: score.total
        });
      
      if (historyError) throw historyError;
      
      // Prune history to keep only the last 30 entries
      const { data: historyData } = await supabase
        .from('score_history')
        .select('id')
        .eq('wallet_address', walletAddress)
        .order('timestamp', { ascending: false })
        .range(30, 1000);
      
      if (historyData && historyData.length > 0) {
        const idsToDelete = historyData.map(item => item.id);
        await supabase
          .from('score_history')
          .delete()
          .in('id', idsToDelete);
      }
    } else {
      // Fallback to in-memory storage
      if (!metricsStore[walletAddress]) {
        metricsStore[walletAddress] = {};
      }
      
      // Store the score
      metricsStore[walletAddress].whispererScore = score;
      
      // Add a history entry if it doesn't exist
      if (!metricsStore[walletAddress].scoreHistory) {
        metricsStore[walletAddress].scoreHistory = [];
      }
      
      // Add the current score to history
      metricsStore[walletAddress].scoreHistory.push({
        timestamp: Date.now(),
        score: score.total
      });
      
      // Keep only the last 30 entries
      if (metricsStore[walletAddress].scoreHistory.length > 30) {
        metricsStore[walletAddress].scoreHistory.shift();
      }
    }
    
    console.log(`Updated Whisperer Score for wallet ${walletAddress}`);
  } catch (error) {
    console.error('Error updating Whisperer Score:', error);
    throw new Error('Failed to update Whisperer Score');
  }
}

/**
 * Gets the Whisperer Score for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing the WhispererScore or null if not found
 */
export async function getWhispererScore(
  walletAddress: string
): Promise<WhispererScore | null> {
  try {
    if (shouldUseSupabase()) {
      // Get the score from Supabase
      const { data, error } = await supabase
        .from('wallet_metrics')
        .select('whisperer_score')
        .eq('wallet_address', walletAddress)
        .single();
      
      if (error) throw error;
      
      return data?.whisperer_score || null;
    } else {
      // Fallback to in-memory storage
      if (!metricsStore[walletAddress] || !metricsStore[walletAddress].whispererScore) {
        return null;
      }
      
      return metricsStore[walletAddress].whispererScore;
    }
  } catch (error) {
    console.error('Error getting Whisperer Score:', error);
    return null;
  }
}

/**
 * Gets the score history for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing an array of score history entries
 */
export async function getScoreHistory(
  walletAddress: string
): Promise<Array<{ timestamp: number; score: number }>> {
  try {
    if (shouldUseSupabase()) {
      // Get the history from Supabase
      const { data, error } = await supabase
        .from('score_history')
        .select('timestamp, score')
        .eq('wallet_address', walletAddress)
        .order('timestamp', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      // Transform to expected format
      return (data || []).map(item => ({
        timestamp: new Date(item.timestamp).getTime(),
        score: item.score
      }));
    } else {
      // Fallback to in-memory storage
      if (!metricsStore[walletAddress] || !metricsStore[walletAddress].scoreHistory) {
        return [];
      }
      
      return metricsStore[walletAddress].scoreHistory;
    }
  } catch (error) {
    console.error('Error getting score history:', error);
    return [];
  }
}

/**
 * Updates the Degen Score for a wallet
 * @param walletAddress - The Solana wallet address
 * @param score - The DegenScore object
 * @returns Promise that resolves when the score is updated
 */
export async function updateDegenScore(
  walletAddress: string,
  score: DegenScore
): Promise<void> {
  try {
    // In a real implementation, this would use Prisma to update the database
    // For now, we'll just store it in memory
    
    if (!metricsStore[walletAddress]) {
      metricsStore[walletAddress] = {};
    }
    
    // Store the score
    metricsStore[walletAddress].degenScore = score;
    
    // Add a history entry if it doesn't exist
    if (!metricsStore[walletAddress].degenScoreHistory) {
      metricsStore[walletAddress].degenScoreHistory = [];
    }
    
    // Add the current score to history
    metricsStore[walletAddress].degenScoreHistory.push({
      timestamp: Date.now(),
      score: score.score
    });
    
    // Keep only the last 30 entries
    if (metricsStore[walletAddress].degenScoreHistory.length > 30) {
      metricsStore[walletAddress].degenScoreHistory.shift();
    }
    
    console.log(`Updated Degen Score for wallet ${walletAddress}`);
  } catch (error) {
    console.error('Error updating Degen Score:', error);
    throw new Error('Failed to update Degen Score');
  }
}

/**
 * Gets the Degen Score for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing the DegenScore or null if not found
 */
export async function getDegenScore(
  walletAddress: string
): Promise<DegenScore | null> {
  try {
    if (shouldUseSupabase()) {
      // Get the score from Supabase
      const { data, error } = await supabase
        .from('wallet_metrics')
        .select('degen_score')
        .eq('wallet_address', walletAddress)
        .single();
      
      if (error) throw error;
      
      return data?.degen_score || null;
    } else {
      // Fallback to in-memory storage
      if (!metricsStore[walletAddress] || !metricsStore[walletAddress].degenScore) {
        return null;
      }
      
      return metricsStore[walletAddress].degenScore;
    }
  } catch (error) {
    console.error('Error getting Degen Score:', error);
    return null;
  }
}

/**
 * Gets the Degen Score history for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing an array of score history entries
 */
export async function getDegenScoreHistory(
  walletAddress: string
): Promise<Array<{ timestamp: number; score: number }>> {
  try {
    if (shouldUseSupabase()) {
      // Get the history from Supabase
      const { data, error } = await supabase
        .from('degen_score_history')
        .select('timestamp, score')
        .eq('wallet_address', walletAddress)
        .order('timestamp', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      // Transform to expected format
      return (data || []).map(item => ({
        timestamp: new Date(item.timestamp).getTime(),
        score: item.score
      }));
    } else {
      // Fallback to in-memory storage
      if (!metricsStore[walletAddress] || !metricsStore[walletAddress].degenScoreHistory) {
        return [];
      }
      
      return metricsStore[walletAddress].degenScoreHistory;
    }
  } catch (error) {
    console.error('Error getting Degen Score history:', error);
    return [];
  }
}

/**
 * Gets the behavioral avatar for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing the behavioral avatar or null if not found
 */
export async function getBehavioralAvatar(
  walletAddress: string
): Promise<BehavioralAvatar | null> {
  try {
    if (shouldUseSupabase()) {
      // Get the avatar from Supabase
      const { data, error } = await supabase
        .from('wallet_metrics')
        .select('behavioral_avatar')
        .eq('wallet_address', walletAddress)
        .single();
      
      if (error) throw error;
      
      return data?.behavioral_avatar || null;
    } else {
      // Fallback to in-memory storage
      if (!metricsStore[walletAddress] || !metricsStore[walletAddress].behavioralAvatar) {
        return null;
      }
      
      return metricsStore[walletAddress].behavioralAvatar;
    }
  } catch (error) {
    console.error('Error getting Behavioral Avatar:', error);
    return null;
  }
}

/**
 * Updates the behavioral avatar for a wallet
 * @param walletAddress - The Solana wallet address
 * @param avatar - The behavioral avatar
 * @returns Promise that resolves when the avatar is updated
 */
export async function updateBehavioralAvatar(
  walletAddress: string,
  avatar: BehavioralAvatar
): Promise<void> {
  try {
    if (shouldUseSupabase()) {
      // Update the avatar in Supabase
      const { error } = await supabase
        .from('wallet_metrics')
        .upsert({
          wallet_address: walletAddress,
          behavioral_avatar: avatar,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'wallet_address'
        });
      
      if (error) throw error;
    } else {
      // Fallback to in-memory storage
      if (!metricsStore[walletAddress]) {
        metricsStore[walletAddress] = {};
      }
      
      metricsStore[walletAddress].behavioralAvatar = avatar;
    }
    
    console.log(`Updated Behavioral Avatar for wallet ${walletAddress}: ${avatar}`);
  } catch (error) {
    console.error('Error updating Behavioral Avatar:', error);
    throw new Error('Failed to update Behavioral Avatar');
  }
}

/**
 * Updates the Label Profile for a wallet
 * @param walletAddress - The Solana wallet address
 * @param profile - The WalletLabelProfile object
 * @returns Promise that resolves when the profile is updated
 */
export async function updateLabelProfile(
  walletAddress: string,
  profile: WalletLabelProfile
): Promise<void> {
  try {
    if (shouldUseSupabase()) {
      // Store the profile in Supabase
      const { error } = await supabase
        .from('wallet_metrics')
        .upsert({
          wallet_address: walletAddress,
          label_profile: profile,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'wallet_address'
        });
      
      if (error) throw error;
    } else {
      // Store in memory
      if (!metricsStore[walletAddress]) {
        metricsStore[walletAddress] = {};
      }
      
      metricsStore[walletAddress].labelProfile = profile;
    }
  } catch (error) {
    console.error('Error updating label profile:', error);
    throw new Error('Failed to update label profile');
  }
}

/**
 * Gets all tracked wallet addresses
 * @returns Promise containing an array of wallet addresses
 */
export async function getAllTrackedWallets(): Promise<string[]> {
  try {
    if (shouldUseSupabase()) {
      // Get all wallet addresses from Supabase
      const { data, error } = await supabase
        .from('wallet_metrics')
        .select('wallet_address');
      
      if (error) throw error;
      
      return data.map(row => row.wallet_address);
    } else {
      // Get from memory
      return Object.keys(metricsStore);
    }
  } catch (error) {
    console.error('Error getting tracked wallets:', error);
    return [];
  }
}

/**
 * Gets the Whisperer Score history for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing the score history
 */
export async function getWhispererScoreHistory(
  walletAddress: string
): Promise<Array<{ timestamp: number; score: number }>> {
  try {
    if (shouldUseSupabase()) {
      // Get history from Supabase
      const { data, error } = await supabase
        .from('score_history')
        .select('timestamp, score')
        .eq('wallet_address', walletAddress)
        .eq('score_type', 'whisperer')
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      return data.map(item => ({
        timestamp: new Date(item.timestamp).getTime(),
        score: item.score
      }));
    } else {
      // Get from memory
      if (!metricsStore[walletAddress] || !metricsStore[walletAddress].whispererScore) {
        return [];
      }
      
      return metricsStore[walletAddress].whispererScore.history || [];
    }
  } catch (error) {
    console.error('Error getting Whisperer Score history:', error);
    return [];
  }
}



/**
 * Gets the component score history for a wallet
 * @param walletAddress - The Solana wallet address
 * @param component - The score component
 * @returns Promise containing the component history
 */
export async function getComponentHistory(
  walletAddress: string,
  component: 'discipline' | 'timing' | 'risk' | 'diversity'
): Promise<Array<{ timestamp: number; value: number }>> {
  try {
    if (shouldUseSupabase()) {
      // Get history from Supabase
      const { data, error } = await supabase
        .from('component_history')
        .select('timestamp, value')
        .eq('wallet_address', walletAddress)
        .eq('component', component)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      return data.map(item => ({
        timestamp: new Date(item.timestamp).getTime(),
        value: item.value
      }));
    } else {
      // Get from memory
      if (!metricsStore[walletAddress] || 
          !metricsStore[walletAddress].componentHistory || 
          !metricsStore[walletAddress].componentHistory[component]) {
        return [];
      }
      
      return metricsStore[walletAddress].componentHistory[component] || [];
    }
  } catch (error) {
    console.error(`Error getting ${component} history:`, error);
    return [];
  }
}

/**
 * Stores time-series data for a wallet
 * @param walletAddress - The Solana wallet address
 * @param dataPoints - The time-series data points
 * @returns Promise that resolves when the data is stored
 */
export async function storeTimeSeriesData(
  walletAddress: string,
  dataPoints: Record<string, Array<{ timestamp: number; value: number }>>
): Promise<void> {
  try {
    if (shouldUseSupabase()) {
      // Store Whisperer Score history
      if (dataPoints.whisperer && dataPoints.whisperer.length > 0) {
        const whispererData = dataPoints.whisperer.map(point => ({
          wallet_address: walletAddress,
          score_type: 'whisperer',
          timestamp: new Date(point.timestamp).toISOString(),
          score: point.value
        }));
        
        const { error: whispererError } = await supabase
          .from('score_history')
          .upsert(whispererData, {
            onConflict: 'wallet_address,score_type,timestamp'
          });
        
        if (whispererError) throw whispererError;
      }
      
      // Store Degen Score history
      if (dataPoints.degen && dataPoints.degen.length > 0) {
        const degenData = dataPoints.degen.map(point => ({
          wallet_address: walletAddress,
          score_type: 'degen',
          timestamp: new Date(point.timestamp).toISOString(),
          score: point.value
        }));
        
        const { error: degenError } = await supabase
          .from('score_history')
          .upsert(degenData, {
            onConflict: 'wallet_address,score_type,timestamp'
          });
        
        if (degenError) throw degenError;
      }
      
      // Store component histories
      const components = ['discipline', 'timing', 'risk', 'diversity'] as const;
      
      for (const component of components) {
        if (dataPoints[component] && dataPoints[component].length > 0) {
          const componentData = dataPoints[component].map(point => ({
            wallet_address: walletAddress,
            component,
            timestamp: new Date(point.timestamp).toISOString(),
            value: point.value
          }));
          
          const { error: componentError } = await supabase
            .from('component_history')
            .upsert(componentData, {
              onConflict: 'wallet_address,component,timestamp'
            });
          
          if (componentError) throw componentError;
        }
      }
    } else {
      // Store in memory
      if (!metricsStore[walletAddress]) {
        metricsStore[walletAddress] = {};
      }
      
      // Store Whisperer Score history
      if (dataPoints.whisperer && dataPoints.whisperer.length > 0) {
        if (!metricsStore[walletAddress].whispererScore) {
          metricsStore[walletAddress].whispererScore = { history: [] };
        }
        
        metricsStore[walletAddress].whispererScore.history = dataPoints.whisperer.map(point => ({
          timestamp: point.timestamp,
          score: point.value
        }));
      }
      
      // Store Degen Score history
      if (dataPoints.degen && dataPoints.degen.length > 0) {
        if (!metricsStore[walletAddress].degenScore) {
          metricsStore[walletAddress].degenScore = { history: [] };
        }
        
        metricsStore[walletAddress].degenScore.history = dataPoints.degen.map(point => ({
          timestamp: point.timestamp,
          score: point.value
        }));
      }
      
      // Store component histories
      if (!metricsStore[walletAddress].componentHistory) {
        metricsStore[walletAddress].componentHistory = {};
      }
      
      const components = ['discipline', 'timing', 'risk', 'diversity'] as const;
      
      for (const component of components) {
        if (dataPoints[component] && dataPoints[component].length > 0) {
          metricsStore[walletAddress].componentHistory[component] = dataPoints[component];
        }
      }
    }
    
    console.log(`Stored time-series data for wallet ${walletAddress}`);
  } catch (error) {
    console.error('Error storing time-series data:', error);
    throw new Error('Failed to store time-series data');
  }
}

/**
 * Gets alerts for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing the alerts
 */
export async function getAlerts(
  walletAddress: string
): Promise<Alert[]> {
  try {
    if (shouldUseSupabase()) {
      // Get alerts from Supabase
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        walletAddress: item.wallet_address,
        timestamp: new Date(item.timestamp).getTime(),
        title: item.title,
        message: item.message,
        severity: item.severity,
        metric: item.metric,
        read: item.read,
        dismissed: item.dismissed
      }));
    } else {
      // Get from memory
      if (!metricsStore[walletAddress] || !metricsStore[walletAddress].alerts) {
        return [];
      }
      
      return metricsStore[walletAddress].alerts || [];
    }
  } catch (error) {
    console.error('Error getting alerts:', error);
    return [];
  }
}

/**
 * Stores alerts for a wallet
 * @param walletAddress - The Solana wallet address
 * @param alerts - The alerts to store
 * @returns Promise that resolves when the alerts are stored
 */
export async function storeAlerts(
  walletAddress: string,
  alerts: Alert[]
): Promise<void> {
  try {
    if (shouldUseSupabase()) {
      // First, get existing alerts to determine which ones to delete
      const { data: existingData, error: existingError } = await supabase
        .from('alerts')
        .select('id')
        .eq('wallet_address', walletAddress);
      
      if (existingError) throw existingError;
      
      // Prepare data for upsert
      const alertsData = alerts.map(alert => ({
        id: alert.id,
        wallet_address: walletAddress,
        timestamp: new Date(alert.timestamp).toISOString(),
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        metric: alert.metric || null,
        read: alert.read,
        dismissed: alert.dismissed
      }));
      
      // Upsert alerts
      const { error: upsertError } = await supabase
        .from('alerts')
        .upsert(alertsData, {
          onConflict: 'id'
        });
      
      if (upsertError) throw upsertError;
      
      // Delete alerts that no longer exist
      const currentIds = alerts.map(alert => alert.id);
      const idsToDelete = existingData
        .map(item => item.id)
        .filter(id => !currentIds.includes(id));
      
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('alerts')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
    } else {
      // Store in memory
      if (!metricsStore[walletAddress]) {
        metricsStore[walletAddress] = {};
      }
      
      metricsStore[walletAddress].alerts = alerts;
    }
    
    console.log(`Stored ${alerts.length} alerts for wallet ${walletAddress}`);
  } catch (error) {
    console.error('Error storing alerts:', error);
    throw new Error('Failed to store alerts');
  }
}

/**
 * Gets the Label Profile for a wallet
 * @param walletAddress - The Solana wallet address
 * @returns Promise containing the WalletLabelProfile or null if not found
 */
export async function getLabelProfile(
  walletAddress: string
): Promise<WalletLabelProfile | null> {
  try {
    // In a real implementation, this would use Prisma to query the database
    // For now, we'll just retrieve from memory
    
    if (!metricsStore[walletAddress] || !metricsStore[walletAddress].labelProfile) {
      return null;
    }
    
    return metricsStore[walletAddress].labelProfile;
  } catch (error) {
    console.error('Error getting Label Profile:', error);
    return null;
  }
}

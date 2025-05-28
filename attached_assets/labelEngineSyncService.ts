/**
 * Wallet Whisperer Label Engine Sync Service
 * 
 * Handles synchronization of wallet labels with Supabase database
 * and tracks historical changes to labels over time.
 */

import NodeCache from 'node-cache';
import { 
  generateWalletLabelProfile, 
  ARCHETYPES, 
  EMOTIONAL_STATES, 
  BEHAVIORAL_TRAITS,
  WalletLabelProfile,
  ArchetypeInfo,
  EmotionalStateInfo,
  BehavioralTraitInfo,
  LabelChangeAnalysis
} from './labelEngineService';

// Import config for Supabase credentials
import config from '../../config';

// Define interfaces for database operations
interface DatabaseLabelProfile extends WalletLabelProfile {
  generatedAt?: number;
  behavioral_traits?: BehavioralTraitInfo[];
}

interface SyncResult {
  results: DatabaseLabelProfile[];
  errors: Array<{ walletAddress: string; error: string }>;
}

interface HistoryEntry {
  added: string[];
  removed: string[];
  timestamp: number;
}

interface ArchetypeChange {
  from: string;
  to: string;
  timestamp: number;
}

interface LabelChanges {
  archetypeChanges: ArchetypeChange[];
  emotionalStateChanges: HistoryEntry[];
  traitChanges: HistoryEntry[];
}

// Fallback to local storage implementation when database access fails
import {
  syncWalletLabelProfile as syncLocalProfile,
  getWalletLabelProfile as getLocalProfile,
  getWalletLabelHistory as getLocalHistory,
  analyzeWalletLabelChanges as analyzeLocalChanges
} from './labelEngineLocalStorage';

// Try to import metricsRepository, but fall back to local storage if it fails
let updateLabelProfile: ((walletAddress: string, profile: WalletLabelProfile, saveHistory: boolean) => Promise<DatabaseLabelProfile>) | undefined;
let getLabelProfile: ((walletAddress: string) => Promise<DatabaseLabelProfile | null>) | undefined;
let useDatabase = false;

try {
  // Check if Supabase credentials are available from config
  const supabaseUrl = config.supabase.url;
  const supabaseKey = config.supabase.anonKey;
  
  if (supabaseUrl && supabaseKey) {
    const metricsRepo = require('../db/metricsRepository');
    updateLabelProfile = metricsRepo.updateLabelProfile;
    getLabelProfile = metricsRepo.getLabelProfile;
    useDatabase = true;
    console.log('Using database implementation for Label Engine with configured credentials');
  } else {
    console.warn('Supabase credentials not found in config, falling back to local storage');
  }
} catch (error) {
  console.warn('Failed to import metricsRepository, falling back to local storage:', (error as Error).message);
  // We'll use the local storage implementation as fallback
}

// Cache for sync operations with 10 minute TTL
const syncCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Synchronizes a wallet label profile with the database
 * 
 * @param walletAddress - Wallet address to sync
 * @param limit - Number of transactions to analyze
 * @param forceRefresh - Whether to force a refresh of the profile
 * @returns Synced wallet label profile
 */
async function syncWalletLabelProfile(
  walletAddress: string, 
  limit: number = 100, 
  forceRefresh: boolean = false
): Promise<DatabaseLabelProfile> {
  // Check cache first
  const cacheKey = `label_sync_${walletAddress}`;
  if (!forceRefresh && syncCache.has(cacheKey)) {
    console.log(`Cache hit for wallet ${walletAddress}`);
    return syncCache.get(cacheKey) as DatabaseLabelProfile;
  }
  
  try {
    // DATABASE-FIRST CHECK: Try to get existing profile from database
    if (useDatabase && getLabelProfile) {
      try {
        const existingLabel = await getLabelProfile(walletAddress);
        
        if (existingLabel) {
          // Check if the profile is still fresh (less than 24 hours old)
          const lastUpdated = existingLabel.generatedAt || Date.now();
          const ageInHours = (Date.now() - lastUpdated) / (1000 * 60 * 60);
          
          if (!forceRefresh && ageInHours < 24) {
            console.log(`Using existing database profile for wallet ${walletAddress} (${ageInHours.toFixed(2)} hours old)`);
            // Cache the result
            syncCache.set(cacheKey, existingLabel);
            return existingLabel;
          } else {
            console.log(`Database profile for wallet ${walletAddress} is stale (${ageInHours.toFixed(2)} hours old), regenerating...`);
          }
        } else {
          console.log(`No existing database profile found for wallet ${walletAddress}, generating new profile...`);
        }
      } catch (dbError) {
        console.warn('Database read operation failed:', (dbError as Error).message);
      }
    }
    
    // Generate the label profile only if needed
    console.log(`Generating new label profile for wallet ${walletAddress}...`);
    const profile = await generateWalletLabelProfile(walletAddress, limit, !forceRefresh);
    
    // Try to use database implementation if available
    if (useDatabase && updateLabelProfile && getLabelProfile) {
      try {
        // Update the label profile in the database
        const updatedProfile = await updateLabelProfile(walletAddress, profile, true);
        
        // Cache the result
        syncCache.set(cacheKey, updatedProfile);
        
        return updatedProfile;
      } catch (dbError) {
        console.warn('Database write operation failed, falling back to local storage:', (dbError as Error).message);
      }
    }
    
    // Fallback to local storage implementation
    console.log('Using local storage implementation for wallet', walletAddress);
    const localProfile = await syncLocalProfile(walletAddress, limit, forceRefresh);
    
    // Cache the result
    syncCache.set(cacheKey, localProfile);
    
    return localProfile;
  } catch (error) {
    console.error('Error syncing wallet label profile:', error);
    throw error;
  }
}

/**
 * Gets a wallet label profile from the database
 * 
 * @param walletAddress - Wallet address to get
 * @param withHistory - Whether to include history
 * @returns Wallet label profile with optional history
 */
async function getWalletLabelProfile(
  walletAddress: string, 
  withHistory: boolean = false
): Promise<DatabaseLabelProfile> {
  try {
    // Try to use database implementation if available
    if (useDatabase && getLabelProfile) {
      try {
        const profile = await getLabelProfile(walletAddress);
        
        if (profile) {
          // If history is requested, get it separately
          if (withHistory) {
            const history = await getWalletLabelHistory(walletAddress);
            return { ...profile, history };
          }
          
          return profile;
        }
      } catch (dbError) {
        console.warn('Database read operation failed, falling back to local storage:', (dbError as Error).message);
      }
    }
    
    // Fallback to local storage implementation
    return getLocalProfile(walletAddress, withHistory);
  } catch (error) {
    console.error('Error getting wallet label profile:', error);
    throw error;
  }
}

/**
 * Gets the history of a wallet label profile
 * 
 * @param walletAddress - Wallet address to get history for
 * @param limit - Maximum number of history entries to return
 * @returns Array of historical wallet label profiles
 */
async function getWalletLabelHistory(
  walletAddress: string, 
  limit: number = 10
): Promise<DatabaseLabelProfile[]> {
  try {
    // Try to use database implementation if available
    if (useDatabase) {
      try {
        // For now, we don't have a direct database implementation for history
        // This would be implemented in the metricsRepository
        
        // For now, fall back to local storage implementation
        return getLocalHistory(walletAddress, limit);
      } catch (dbError) {
        console.warn('Database history operation failed, falling back to local storage:', (dbError as Error).message);
      }
    }
    
    // Fallback to local storage implementation
    return getLocalHistory(walletAddress, limit);
  } catch (error) {
    console.error('Error getting wallet label history:', error);
    throw error;
  }
}

/**
 * Analyzes changes in a wallet's label history
 * 
 * @param walletAddress - Wallet address to analyze
 * @returns Analysis of changes over time
 */
async function analyzeWalletLabelChanges(walletAddress: string): Promise<LabelChangeAnalysis> {
  try {
    // Get the wallet's label history
    const history = await getWalletLabelHistory(walletAddress);
    
    if (history.length < 2) {
      return {
        walletAddress,
        hasChanges: false,
        message: 'Not enough historical data to analyze changes',
        totalSnapshots: history.length
      };
    }
    
    // Track changes
    const changes: LabelChanges = {
      archetypeChanges: [],
      emotionalStateChanges: [],
      traitChanges: []
    };
    
    // Analyze changes over time
    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const previous = history[i + 1];
      
      // Check for archetype changes
      if (current.archetype.id !== previous.archetype.id) {
        changes.archetypeChanges.push({
          from: previous.archetype.name,
          to: current.archetype.name,
          timestamp: current.timestamp || (current.generatedAt || 0)
        });
      }
      
      // Check for emotional state changes
      const currentEmotionalStates = current.emotionalStates || [];
      const previousEmotionalStates = previous.emotionalStates || [];
      
      const currentEmotionalIds = currentEmotionalStates.map(state => state.id);
      const previousEmotionalIds = previousEmotionalStates.map(state => state.id);
      
      const addedEmotionalStates = currentEmotionalIds.filter(id => !previousEmotionalIds.includes(id));
      const removedEmotionalStates = previousEmotionalIds.filter(id => !currentEmotionalIds.includes(id));
      
      if (addedEmotionalStates.length > 0 || removedEmotionalStates.length > 0) {
        changes.emotionalStateChanges.push({
          added: addedEmotionalStates.map(id => {
            const state = currentEmotionalStates.find(state => state.id === id);
            return state ? state.name : id;
          }),
          removed: removedEmotionalStates.map(id => {
            const state = previousEmotionalStates.find(state => state.id === id);
            return state ? state.name : id;
          }),
          timestamp: current.timestamp || (current.generatedAt || 0)
        });
      }
      
      // Check for trait changes
      // Handle both database format (behavioral_traits) and local storage format (traits)
      const currentTraits = current.behavioral_traits || current.traits || [];
      const previousTraits = previous.behavioral_traits || previous.traits || [];
      
      const currentTraitIds = currentTraits.map(trait => trait.id);
      const previousTraitIds = previousTraits.map(trait => trait.id);
      
      const addedTraits = currentTraitIds.filter(id => !previousTraitIds.includes(id));
      const removedTraits = previousTraitIds.filter(id => !currentTraitIds.includes(id));
      
      if (addedTraits.length > 0 || removedTraits.length > 0) {
        changes.traitChanges.push({
          added: addedTraits.map(id => {
            const trait = currentTraits.find(trait => trait.id === id);
            return trait ? trait.name : id;
          }),
          removed: removedTraits.map(id => {
            const trait = previousTraits.find(trait => trait.id === id);
            return trait ? trait.name : id;
          }),
          timestamp: current.timestamp || (current.generatedAt || 0)
        });
      }
    }
    
    return {
      walletAddress,
      hasChanges: changes.archetypeChanges.length > 0 || 
                 changes.emotionalStateChanges.length > 0 || 
                 changes.traitChanges.length > 0,
      changes,
      firstSnapshot: history[history.length - 1].timestamp || (history[history.length - 1].generatedAt || 0),
      latestSnapshot: history[0].timestamp || (history[0].generatedAt || 0),
      totalSnapshots: history.length
    };
  } catch (error) {
    console.error('Error analyzing wallet label changes:', error);
    // Return a default response instead of throwing an error
    return {
      walletAddress,
      hasChanges: false,
      message: `Error analyzing wallet label changes: ${(error as Error).message}`,
      totalSnapshots: 0
    };
  }
}

/**
 * Synchronizes labels for multiple wallets in batch
 * 
 * @param walletAddresses - Array of wallet addresses to sync
 * @param limit - Number of transactions to analyze per wallet
 * @returns Array of synced wallet label profiles
 */
async function batchSyncWalletLabels(
  walletAddresses: string[], 
  limit: number = 100
): Promise<SyncResult> {
  const results: DatabaseLabelProfile[] = [];
  const errors: Array<{ walletAddress: string; error: string }> = [];
  
  for (const walletAddress of walletAddresses) {
    try {
      const profile = await syncWalletLabelProfile(walletAddress, limit);
      results.push(profile);
    } catch (error) {
      console.error(`Error syncing wallet ${walletAddress}:`, error);
      errors.push({ walletAddress, error: (error as Error).message });
    }
  }
  
  return { results, errors };
}

/**
 * Gets the distribution of archetypes across all wallets
 * 
 * @returns Distribution of archetypes
 */
async function getArchetypeDistribution(): Promise<{
  distribution: Array<{
    id: string;
    name: string;
    count: number;
    percentage: number;
  }>;
  total: number;
}> {
  try {
    // Since we can't directly query for distribution using the metricsRepository,
    // we'll create a mock distribution based on the available archetypes
    const distribution = Object.values(ARCHETYPES).map(archetype => {
      // Generate random counts for demonstration purposes
      const count = Math.floor(Math.random() * 100) + 5;
      
      return {
        id: archetype.id,
        name: archetype.name,
        count,
        percentage: 0 // Will be calculated below
      };
    });
    
    // Calculate total and percentages
    const total = distribution.reduce((sum, item) => sum + item.count, 0);
    distribution.forEach(item => {
      item.percentage = (item.count / total) * 100;
    });
    
    // Sort by count (descending)
    distribution.sort((a, b) => b.count - a.count);
    
    return {
      distribution,
      total
    };
  } catch (error) {
    console.error('Error getting archetype distribution:', error);
    throw error;
  }
}

export {
  syncWalletLabelProfile,
  getWalletLabelProfile,
  getWalletLabelHistory,
  analyzeWalletLabelChanges,
  batchSyncWalletLabels,
  getArchetypeDistribution,
  DatabaseLabelProfile,
  SyncResult
};

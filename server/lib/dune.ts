import axios from 'axios';
import { getCachedDuneData, cacheDuneData } from './redis';

// Dune query IDs for different card types
export const DUNE_QUERIES: Record<string, string> = {
  // Cognitive Snapshot Cards
  'archetype-classifier': '1234567',
  'trading-rhythm': '2345678',
  'risk-appetite-meter': '3456789',

  // Cognitive Patterns Cards
  'position-sizing-psychology': '4567890',
  'time-of-day-patterns': '5678901',
  'token-rotation-intelligence': '6789012',
  'gas-fee-personality': '7890123',
  'market-timing-ability': '8901234',

  // Insights Cards
  'conviction-collapse-detector': '9012345',
  'fomo-fear-cycle': '0123456',
  'post-rug-behavior': '1234567',
  'loss-aversion': '2345678',
  'profit-taking-discipline': '3456789',

  // Psychoanalytics Cards
  'narrative-loyalty': '4567890',
  'stress-response-patterns': '5678901',
  'social-trading-influence': '6789012',
  'false-conviction': '7890123',
  'llm-insight-generator': '8901234'
};

/**
 * Fetch data from Dune Analytics
 * Uses Sim's worker proxy for batching and rate limiting
 */
export async function fetchDuneData(queryId: string, params: Record<string, any>, forceRefresh = false) {
  // Check cache first, unless force refresh is requested
  if (!forceRefresh) {
    const cachedData = await getCachedDuneData(queryId, params);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    // Use Sim's worker proxy for Dune API
    const response = await axios.post(
      `${process.env.SIM_WORKER_URL || 'https://api.sim.eth'}/dune/query/${queryId}`,
      params,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SIM_API_KEY || 'sim_default_key'}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = response.data;
    
    // Cache the results
    await cacheDuneData(queryId, params, data);
    
    return data;
  } catch (error: unknown) {
    console.error(`Error fetching Dune data for query ${queryId}:`, error);
    throw error;
  }
}

/**
 * Get wallet overview data from Dune
 */
export async function getWalletOverview(walletAddress: string, forceRefresh = false) {
  const params = { 
    wallet: walletAddress.toLowerCase() 
  };
  
  return fetchDuneData(DUNE_QUERIES['archetype-classifier'], params, forceRefresh);
}

/**
 * Get trading frequency data from Dune
 */
export async function getTradingFrequency(walletAddress: string, forceRefresh = false) {
  const params = { 
    wallet: walletAddress.toLowerCase() 
  };
  
  return fetchDuneData(DUNE_QUERIES['trading-rhythm'], params, forceRefresh);
}

/**
 * Get risk appetite data from Dune
 */
export async function getRiskAppetite(walletAddress: string, forceRefresh = false) {
  const params = { 
    wallet: walletAddress.toLowerCase() 
  };
  
  return fetchDuneData(DUNE_QUERIES['risk-appetite-meter'], params, forceRefresh);
}

/**
 * Get FOMO behavior data from Dune
 */
export async function getFomoBehavior(walletAddress: string, forceRefresh = false) {
  const params = { 
    wallet: walletAddress.toLowerCase() 
  };
  
  return fetchDuneData(DUNE_QUERIES['fomo-fear-cycle'], params, forceRefresh);
}

/**
 * Get token loyalty data from Dune
 */
export async function getTokenLoyalty(walletAddress: string, forceRefresh = false) {
  const params = { 
    wallet: walletAddress.toLowerCase() 
  };
  
  return fetchDuneData(DUNE_QUERIES['narrative-loyalty'], params, forceRefresh);
}

export default {
  fetchDuneData,
  getWalletOverview,
  getTradingFrequency,
  getRiskAppetite,
  getFomoBehavior,
  getTokenLoyalty,
  DUNE_QUERIES
};

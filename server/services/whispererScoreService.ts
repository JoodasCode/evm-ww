/**
 * Whisperer Score Service
 * 
 * This service handles fetching and updating the Whisperer Score for a wallet.
 * The Whisperer Score is a composite metric that represents the wallet's overall
 * trading behavior, risk profile, and performance.
 */

import { createClient } from '@supabase/supabase-js';
import config from '../config';

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || config.supabase.url;
const supabaseKey = process.env.SUPABASE_ANON_KEY || config.supabase.anonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

// Table name
const WALLET_SCORES_TABLE = 'wallet_scores';

// Interface for wallet score record
export interface WhispererScoreRecord {
  id?: string;
  address: string;
  whisperer_score: number;
  degen_score: number;
  roi_score: number;
  portfolio_value: number;
  daily_change: number;
  weekly_change: number;
  current_mood: string;
  trading_frequency: string;
  risk_level: string;
  avg_trade_size: number;
  daily_trades: number;
  profit_loss: number;
  influence_score: number;
  created_at: string;
  updated_at: string;
  archetype?: string;
}

/**
 * Gets the Whisperer Score for a wallet
 * @param walletAddress - The wallet address
 * @returns The wallet score record
 */
export async function getWhispererScore(
  walletAddress: string
): Promise<WhispererScoreRecord | null> {
  try {
    const { data, error } = await supabase
      .from(WALLET_SCORES_TABLE)
      .select('*')
      .eq('address', walletAddress)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting Whisperer Score:', error);
    return null;
  }
}

/**
 * Gets or creates the Whisperer Score for a wallet
 * @param walletAddress - The wallet address
 * @returns The wallet score record
 */
export async function getOrCreateWhispererScore(
  walletAddress: string
): Promise<WhispererScoreRecord | null> {
  try {
    // First try to get the existing score
    const existingScore = await getWhispererScore(walletAddress);
    
    if (existingScore) {
      return existingScore;
    }
    
    // If no score exists, create a new one with default values
    const now = new Date().toISOString();
    const defaultScore: WhispererScoreRecord = {
      address: walletAddress,
      whisperer_score: 50, // Default score
      degen_score: 50,
      roi_score: 50,
      portfolio_value: 0,
      daily_change: 0,
      weekly_change: 0,
      current_mood: 'Neutral',
      trading_frequency: 'Low',
      risk_level: 'Medium',
      avg_trade_size: 0,
      daily_trades: 0,
      profit_loss: 0,
      influence_score: 50,
      created_at: now,
      updated_at: now,
      archetype: 'Novice'
    };
    
    const { data, error } = await supabase
      .from(WALLET_SCORES_TABLE)
      .insert([defaultScore])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting or creating Whisperer Score:', error);
    return null;
  }
}
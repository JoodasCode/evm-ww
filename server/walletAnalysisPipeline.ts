/**
 * Automated Wallet Analysis Pipeline
 * 
 * Orchestrates the complete analysis flow when a wallet connects:
 * 1. Fetch transactions from Helius
 * 2. Calculate behavioral scores
 * 3. Run Label Engine classification
 * 4. Store results in Supabase
 * 5. Cache for performance
 */

import { createClient } from '@supabase/supabase-js';

interface AnalysisResult {
  walletAddress: string;
  whispererScore: number;
  degenScore: number;
  archetype: string;
  confidence: number;
  emotionalStates: string[];
  behavioralTraits: string[];
  portfolioValue: number;
  riskScore: number;
  fomoScore: number;
  patienceScore: number;
  convictionScore: number;
  influenceScore: number;
  roiScore: number;
  transactionCount: number;
  tradingFrequency: number;
  lastAnalyzed: Date;
}

class WalletAnalysisPipeline {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  private heliusApiKey = process.env.HELIUS_API_KEY!;
  private moralisApiKey = process.env.MORALIS_API_KEY;

  /**
   * Main entry point - runs complete automated analysis
   */
  async analyzeWallet(walletAddress: string): Promise<AnalysisResult> {
    console.log(`🚀 Starting automated analysis for ${walletAddress}`);

    try {
      // Step 1: Check if recent analysis exists
      const existing = await this.checkExistingAnalysis(walletAddress);
      if (existing && this.isRecentAnalysis(existing.lastAnalyzed)) {
        console.log('⚡ Returning recent analysis');
        return existing;
      }

      // Step 2: Complete data enrichment from all APIs
      console.log('📊 Starting complete data enrichment (Helius + Moralis + Gecko Terminal)...');
      const { dataEnrichmentService } = await import('./dataEnrichmentService');
      const completeData = await dataEnrichmentService.enrichWalletData(walletAddress);

      // Step 3: Calculate behavioral scores from enriched data
      console.log('🧠 Calculating behavioral scores...');
      const behavioralScores = await this.calculateBehavioralScores(completeData.transactions);

      // Step 4: Run Label Engine classification
      console.log('🏷️ Running archetype classification...');
      const classification = await this.classifyArchetype(behavioralScores, completeData.transactions);

      // Step 5: Compile complete analysis
      const analysis = await this.compileAnalysis(
        walletAddress,
        completeData.transactions,
        behavioralScores,
        classification
      );

      // Step 6: Record wallet login and store comprehensive data
      console.log('💾 Recording wallet login and storing analysis data...');
      await this.recordWalletLogin(walletAddress);
      await this.storeAnalysis(analysis);
      
      // Step 7: Store detailed transaction data for future use
      console.log('📊 Storing enriched transaction data...');
      await this.storeTransactionData(walletAddress, completeData.transactions || []);

      console.log('✅ Complete data enrichment and analysis finished!');
      return analysis;

    } catch (error) {
      console.error('❌ Analysis pipeline error:', error);
      throw new Error(`Analysis failed: ${(error as Error).message}`);
    }
  }

  /**
   * Store comprehensive transaction data enriched with all APIs
   */
  private async storeTransactionData(walletAddress: string, transactions: any[]) {
    try {
      for (const tx of transactions) {
        // Store base transaction
        await this.supabase
          .from('wallet_trades')
          .upsert({
            wallet_address: walletAddress,
            signature: tx.signature,
            block_time: tx.blockTime,
            transaction_type: tx.type || 'unknown',
            data_sources: tx.dataSource || 'helius',
            enriched: tx.enriched || false,
            raw_data: tx,
            updated_at: new Date().toISOString()
          });

        // Store token metadata from Moralis
        if (tx.tokenMetadata) {
          for (const [mint, metadata] of Object.entries(tx.tokenMetadata)) {
            await this.supabase
              .from('token_metadata')
              .upsert({
                mint_address: mint,
                name: (metadata as any).name,
                symbol: (metadata as any).symbol,
                decimals: (metadata as any).decimals,
                logo_uri: (metadata as any).logoURI,
                source: 'moralis',
                metadata: metadata,
                updated_at: new Date().toISOString()
              });
          }
        }

        // Store price data from Gecko Terminal
        if (tx.priceData) {
          for (const [mint, priceInfo] of Object.entries(tx.priceData)) {
            await this.supabase
              .from('token_prices')
              .upsert({
                mint_address: mint,
                price_usd: (priceInfo as any).price_usd,
                source: 'gecko_terminal',
                timestamp: (priceInfo as any).timestamp,
                updated_at: new Date().toISOString()
              });
          }
        }

        // Store individual token transfers with enriched data
        if (tx.tokenTransfers) {
          for (const transfer of tx.tokenTransfers) {
            const priceUsd = tx.priceData?.[transfer.mint]?.price_usd || null;
            const usdValue = priceUsd ? (transfer.tokenAmount * parseFloat(priceUsd)) : null;

            await this.supabase
              .from('token_transfers')
              .upsert({
                wallet_address: walletAddress,
                signature: tx.signature,
                mint_address: transfer.mint,
                token_amount: transfer.tokenAmount,
                price_usd: priceUsd,
                usd_value: usdValue,
                from_address: transfer.fromUserAccount,
                to_address: transfer.toUserAccount,
                transfer_type: this.classifyTransferType(transfer),
                updated_at: new Date().toISOString()
              });
          }
        }

        // Store SOL transfers with current price
        if (tx.nativeTransfers) {
          for (const transfer of tx.nativeTransfers) {
            await this.supabase
              .from('sol_transfers')
              .upsert({
                wallet_address: walletAddress,
                signature: tx.signature,
                amount_sol: transfer.amount / 1e9,
                from_address: transfer.fromUserAccount,
                to_address: transfer.toUserAccount,
                updated_at: new Date().toISOString()
              });
          }
        }
      }

      console.log('💾 Stored comprehensive transaction data for future card development');
    } catch (error) {
      console.error('❌ Error storing transaction data:', error);
    }
  }

  /**
   * Classify transfer type for better data organization
   */
  private classifyTransferType(transfer: any): string {
    if (transfer.fromUserAccount === transfer.toUserAccount) return 'self';
    if (!transfer.fromUserAccount) return 'mint';
    if (!transfer.toUserAccount) return 'burn';
    return 'transfer';
  }

  /**
   * Fetch enhanced transaction data using Helius + Moralis combo
   */
  private async fetchEnhancedTransactionData(walletAddress: string) {
    // Step 1: Get base transactions from Helius
    console.log('🔍 Fetching base transactions from Helius...');
    const heliusTransactions = await this.fetchTransactionData(walletAddress);
    
    // Step 2: Enrich with Moralis token data
    console.log('💎 Enriching with Moralis token metadata...');
    const enrichedTransactions = await this.enrichWithMoralis(heliusTransactions);
    
    console.log(`🎯 Enhanced ${enrichedTransactions.length} transactions with combo data`);
    return enrichedTransactions;
  }

  /**
   * Fetch base transaction data from Helius API
   */
  private async fetchTransactionData(walletAddress: string) {
    const url = `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${this.heliusApiKey}&limit=100`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const transactions = await response.json();
    console.log(`📈 Retrieved ${transactions.length} transactions from Helius`);
    return Array.isArray(transactions) ? transactions : [];
  }

  /**
   * Enrich transactions with Moralis token metadata and Gecko Terminal pricing
   */
  private async enrichWithMoralis(transactions: any[]) {
    console.log('🔧 Enriching transactions with Moralis + Gecko Terminal data...');
    
    const enrichedTransactions = [];
    
    for (const tx of transactions) {
      let enrichedTx = { ...tx, dataSource: 'helius_primary' };
      
      // Extract token mints from transaction
      const tokenMints = this.extractTokenMints(tx);
      
      if (tokenMints.length > 0) {
        // Get token metadata from Moralis (if available)
        const tokenMetadata = await this.fetchMoralisTokenData(tokenMints);
        
        // Get current prices from Gecko Terminal (public API)
        const priceData = await this.fetchGeckoTerminalPrices(tokenMints);
        
        enrichedTx = {
          ...enrichedTx,
          tokenMetadata,
          priceData,
          enriched: true,
          dataSource: 'helius_moralis_gecko'
        };
      }
      
      enrichedTransactions.push(enrichedTx);
    }
    
    console.log(`💎 Enhanced ${enrichedTransactions.length} transactions with full API combo`);
    return enrichedTransactions;
  }

  /**
   * Extract token mints from transaction data
   */
  private extractTokenMints(transaction: any): string[] {
    const mints = new Set<string>();
    
    // Extract from token transfers
    if (transaction.tokenTransfers) {
      transaction.tokenTransfers.forEach((transfer: any) => {
        if (transfer.mint) mints.add(transfer.mint);
      });
    }
    
    // Extract from account data
    if (transaction.accountData) {
      transaction.accountData.forEach((account: any) => {
        if (account.mint) mints.add(account.mint);
      });
    }
    
    return Array.from(mints);
  }

  /**
   * Fetch token metadata from Moralis
   */
  private async fetchMoralisTokenData(tokenMints: string[]) {
    if (!this.moralisApiKey || tokenMints.length === 0) {
      return null;
    }
    
    try {
      // Moralis Solana API endpoint for token metadata
      const tokenData = {};
      
      for (const mint of tokenMints.slice(0, 5)) { // Limit to avoid rate limits
        const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${mint}/metadata`, {
          headers: {
            'X-API-Key': this.moralisApiKey
          }
        });
        
        if (response.ok) {
          const metadata = await response.json();
          tokenData[mint] = metadata;
        }
      }
      
      return tokenData;
    } catch (error) {
      console.log('⚠️ Moralis enrichment unavailable');
      return null;
    }
  }

  /**
   * Fetch current prices from Gecko Terminal (public API)
   */
  private async fetchGeckoTerminalPrices(tokenMints: string[]) {
    if (tokenMints.length === 0) return null;
    
    try {
      const priceData = {};
      
      for (const mint of tokenMints.slice(0, 5)) { // Limit requests
        // Gecko Terminal public API for Solana token prices
        const response = await fetch(`https://api.geckoterminal.com/api/v2/simple/networks/solana/token_price/${mint}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.attributes) {
            priceData[mint] = {
              price_usd: data.data.attributes.token_prices[mint],
              timestamp: new Date().toISOString()
            };
          }
        }
      }
      
      console.log(`📈 Retrieved prices for ${Object.keys(priceData).length} tokens from Gecko Terminal`);
      return priceData;
    } catch (error) {
      console.log('⚠️ Gecko Terminal pricing unavailable');
      return null;
    }
  }

  /**
   * Calculate comprehensive behavioral scores using enriched data
   */
  private async calculateBehavioralScores(transactions: any[]) {
    const scores = {
      whispererScore: 0,
      degenScore: 0,
      riskScore: 0,
      fomoScore: 0,
      patienceScore: 0,
      convictionScore: 0,
      influenceScore: 0,
      roiScore: 0,
      tradingFrequency: 0
    };

    if (transactions.length === 0) {
      return scores;
    }

    console.log('🧮 Calculating enhanced behavioral scores with API combo data...');

    // Enhanced calculations using enriched data
    const timeSpan = this.calculateTimeSpan(transactions);
    scores.tradingFrequency = transactions.length / Math.max(timeSpan, 1);

    // Calculate enhanced portfolio metrics using price data
    const portfolioMetrics = this.calculateEnhancedPortfolioMetrics(transactions);
    const avgValue = portfolioMetrics.avgTransactionValue;
    const totalUsdValue = portfolioMetrics.totalUsdValue;
    
    // Enhanced behavioral scores using real price data
    scores.patienceScore = Math.min(100, Math.max(0, 100 - (scores.tradingFrequency * 8)));
    scores.fomoScore = Math.min(100, Math.max(0, scores.tradingFrequency * 12));
    scores.riskScore = Math.min(100, Math.max(0, (avgValue * 50) + (totalUsdValue / 1000)));
    scores.convictionScore = Math.min(100, Math.max(0, 95 - (scores.fomoScore * 0.4)));
    scores.influenceScore = Math.min(100, Math.max(0, (transactions.length * 1.5) + (totalUsdValue / 100)));
    scores.roiScore = Math.min(100, Math.max(0, portfolioMetrics.estimatedROI * 10));

    // Enhanced Whisperer Score calculation
    scores.whispererScore = Math.round(
      (scores.patienceScore * 0.25) +
      (scores.convictionScore * 0.25) +
      ((100 - scores.fomoScore) * 0.20) +
      (scores.riskScore * 0.15) +
      (scores.influenceScore * 0.15)
    );

    // Enhanced Degen Score with price volatility factor
    const volatilityFactor = portfolioMetrics.priceVolatility || 1;
    scores.degenScore = Math.round(
      (scores.fomoScore * 0.35) +
      (scores.riskScore * 0.25) +
      (scores.tradingFrequency * 1.5) +
      ((100 - scores.patienceScore) * 0.15) +
      (volatilityFactor * 5)
    );

    console.log(`✅ Enhanced scores: Whisperer ${scores.whispererScore}, Degen ${scores.degenScore}`);
    return scores;
  }

  /**
   * Calculate enhanced portfolio metrics using price data from Gecko Terminal
   */
  private calculateEnhancedPortfolioMetrics(transactions: any[]) {
    let totalUsdValue = 0;
    let transactionValues = [];
    let priceVolatility = 1;
    let validPriceCount = 0;

    transactions.forEach(tx => {
      let txUsdValue = 0;
      
      // Use enriched price data if available
      if (tx.priceData && tx.tokenTransfers) {
        tx.tokenTransfers.forEach((transfer: any) => {
          if (transfer.mint && tx.priceData[transfer.mint]) {
            const price = parseFloat(tx.priceData[transfer.mint].price_usd || 0);
            const amount = transfer.tokenAmount || 0;
            txUsdValue += price * amount;
            validPriceCount++;
          }
        });
      }
      
      // Fallback to SOL value calculation
      if (txUsdValue === 0 && tx.nativeTransfers) {
        tx.nativeTransfers.forEach((transfer: any) => {
          txUsdValue += (transfer.amount / 1e9) * 100; // Approximate SOL price
        });
      }
      
      if (txUsdValue > 0) {
        totalUsdValue += txUsdValue;
        transactionValues.push(txUsdValue);
      }
    });

    // Calculate volatility from transaction value distribution
    if (transactionValues.length > 1) {
      const mean = transactionValues.reduce((a, b) => a + b, 0) / transactionValues.length;
      const variance = transactionValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / transactionValues.length;
      priceVolatility = Math.sqrt(variance) / mean || 1;
    }

    const avgTransactionValue = transactionValues.length > 0 
      ? totalUsdValue / transactionValues.length / 100 // Normalize
      : this.calculateAvgValue(transactions);

    const estimatedROI = validPriceCount > 0 ? Math.min(10, totalUsdValue / 1000) : 1.5;

    return {
      totalUsdValue,
      avgTransactionValue,
      priceVolatility: Math.min(5, priceVolatility),
      estimatedROI,
      enrichedDataPoints: validPriceCount
    };
  }

  /**
   * Classify wallet archetype using Label Engine
   */
  private async classifyArchetype(scores: any, transactions: any[]) {
    // Strategic Whale classification logic
    let archetype = 'Developing Trader';
    let confidence = 0.6;
    let emotionalStates = ['Neutral'];
    let behavioralTraits = ['Active'];

    if (scores.whispererScore >= 90) {
      archetype = 'Strategic Whale';
      confidence = 0.95;
      emotionalStates = ['Disciplined', 'Patient', 'Confident', 'Strategic'];
      behavioralTraits = ['High Conviction', 'FOMO Resistant', 'Risk Calculated'];
    } else if (scores.whispererScore >= 70) {
      archetype = 'Strategic Trader';
      confidence = 0.85;
      emotionalStates = ['Disciplined', 'Patient'];
      behavioralTraits = ['Strategic', 'Risk Aware'];
    } else if (scores.whispererScore >= 50) {
      archetype = 'Active Trader';
      confidence = 0.75;
      emotionalStates = ['Active', 'Engaged'];
      behavioralTraits = ['Moderate Risk', 'Active'];
    }

    return {
      archetype,
      confidence,
      emotionalStates,
      behavioralTraits
    };
  }

  /**
   * Compile complete analysis results
   */
  private async compileAnalysis(
    walletAddress: string,
    transactions: any[],
    scores: any,
    classification: any
  ): Promise<AnalysisResult> {
    
    // Calculate portfolio value from transactions
    const portfolioValue = this.calculatePortfolioValue(transactions);

    return {
      walletAddress,
      whispererScore: scores.whispererScore,
      degenScore: scores.degenScore,
      archetype: classification.archetype,
      confidence: classification.confidence,
      emotionalStates: classification.emotionalStates,
      behavioralTraits: classification.behavioralTraits,
      portfolioValue,
      riskScore: scores.riskScore,
      fomoScore: scores.fomoScore,
      patienceScore: scores.patienceScore,
      convictionScore: scores.convictionScore,
      influenceScore: scores.influenceScore,
      roiScore: scores.roiScore,
      transactionCount: transactions.length,
      tradingFrequency: scores.tradingFrequency,
      lastAnalyzed: new Date()
    };
  }

  /**
   * Record wallet login in the database
   */
  private async recordWalletLogin(walletAddress: string) {
    try {
      await this.supabase
        .from('wallet_logins')
        .upsert({
          wallet_address: walletAddress,
          login_timestamp: new Date().toISOString(),
          session_id: `session_${Date.now()}`,
          updated_at: new Date().toISOString()
        });
      
      console.log(`📝 Recorded wallet login for ${walletAddress}`);
    } catch (error) {
      console.error('❌ Error recording wallet login:', error);
    }
  }

  /**
   * Store analysis in Supabase database
   */
  private async storeAnalysis(analysis: AnalysisResult) {
    try {
      // Store comprehensive wallet scores with enriched data
      await this.supabase
        .from('wallet_scores')
        .upsert({
          wallet_address: analysis.walletAddress,
          whisperer_score: analysis.whispererScore,
          degen_score: analysis.degenScore,
          roi_score: analysis.roiScore,
          influence_score: analysis.influenceScore,
          timing_score: 100 - analysis.fomoScore,
          data_sources: 'helius_moralis_gecko',
          enriched_data_points: analysis.enrichedDataPoints || 0,
          updated_at: new Date().toISOString()
        });

      // Store behavioral data
      await this.supabase
        .from('wallet_behavior')
        .upsert({
          wallet_address: analysis.walletAddress,
          risk_score: analysis.riskScore,
          fomo_score: analysis.fomoScore,
          patience_score: analysis.patienceScore,
          conviction_score: analysis.convictionScore,
          archetype: analysis.archetype,
          confidence: analysis.confidence,
          emotional_states: analysis.emotionalStates,
          behavioral_traits: analysis.behavioralTraits,
          updated_at: new Date().toISOString()
        });

      // Store activity metrics
      await this.supabase
        .from('wallet_activity')
        .upsert({
          wallet_address: analysis.walletAddress,
          transaction_count: analysis.transactionCount,
          portfolio_value: analysis.portfolioValue,
          trading_frequency: analysis.tradingFrequency,
          last_analyzed: analysis.lastAnalyzed.toISOString(),
          updated_at: new Date().toISOString()
        });

      console.log('💾 Analysis stored successfully');
    } catch (error) {
      console.error('❌ Storage error:', error);
      throw error;
    }
  }

  /**
   * Check for existing recent analysis
   */
  private async checkExistingAnalysis(walletAddress: string): Promise<AnalysisResult | null> {
    try {
      const { data: scores } = await this.supabase
        .from('wallet_scores')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      const { data: behavior } = await this.supabase
        .from('wallet_behavior')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      const { data: activity } = await this.supabase
        .from('wallet_activity')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (scores && behavior && activity) {
        return {
          walletAddress,
          whispererScore: scores.whisperer_score,
          degenScore: scores.degen_score,
          archetype: behavior.archetype,
          confidence: behavior.confidence,
          emotionalStates: behavior.emotional_states || [],
          behavioralTraits: behavior.behavioral_traits || [],
          portfolioValue: activity.portfolio_value,
          riskScore: behavior.risk_score,
          fomoScore: behavior.fomo_score,
          patienceScore: behavior.patience_score,
          convictionScore: behavior.conviction_score,
          influenceScore: scores.influence_score,
          roiScore: scores.roi_score,
          transactionCount: activity.transaction_count,
          tradingFrequency: activity.trading_frequency,
          lastAnalyzed: new Date(activity.last_analyzed)
        };
      }
    } catch (error) {
      console.log('No existing analysis found');
    }
    return null;
  }

  /**
   * Check if analysis is recent (within 1 hour)
   */
  private isRecentAnalysis(lastAnalyzed: Date): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return lastAnalyzed > oneHourAgo;
  }

  // Helper calculation methods
  private calculateTimeSpan(transactions: any[]): number {
    if (transactions.length === 0) return 1;
    
    const timestamps = transactions
      .map(tx => tx.blockTime || tx.timestamp)
      .filter(t => t)
      .sort((a, b) => b - a);
    
    if (timestamps.length < 2) return 1;
    
    const daysDiff = (timestamps[0] - timestamps[timestamps.length - 1]) / (24 * 60 * 60);
    return Math.max(1, daysDiff);
  }

  private calculateAvgValue(transactions: any[]): number {
    if (transactions.length === 0) return 0;
    
    let totalValue = 0;
    let valueCount = 0;
    
    transactions.forEach(tx => {
      if (tx.nativeTransfers?.length > 0) {
        tx.nativeTransfers.forEach(transfer => {
          totalValue += transfer.amount / 1e9;
          valueCount++;
        });
      }
    });
    
    return valueCount > 0 ? totalValue / valueCount : 0.01;
  }

  private calculatePortfolioValue(transactions: any[]): number {
    // Calculate estimated portfolio value from transaction activity
    const avgValue = this.calculateAvgValue(transactions);
    return avgValue * transactions.length * 0.1; // Simplified calculation
  }
}

export const walletAnalysisPipeline = new WalletAnalysisPipeline();
export type { AnalysisResult };
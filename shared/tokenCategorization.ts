// Token categorization engine for behavioral analysis
export interface TokenMetadata {
  mint: string;
  name?: string;
  symbol?: string;
  description?: string;
  source?: string;
  marketCap?: number;
  verified?: boolean;
  launchTime?: number;
  avgHoldTime?: number;
  txCount?: number;
}

export interface TokenCategory {
  primary: string;
  secondary?: string[];
  confidence: number; // 0-1 scale
  source: 'manual' | 'metadata' | 'behavioral' | 'heuristic';
}

// Manual seed tagging for top traded tokens
export const MANUAL_TOKEN_TAGS: Record<string, string[]> = {
  // SOL Ecosystem
  "So11111111111111111111111111111111111111112": ["Utility", "Native"],
  
  // Major Memes
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": ["Meme", "Dog", "Bonk"],
  "CKaKtYvz6dKPyMvYq9Rh3UBrnNqYZAyd7iF4hJtjUvks": ["Meme", "Animal", "Giga"],
  "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82": ["Meme", "Pepe"],
  
  // DeFi Infrastructure
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": ["Infra", "DEX", "Jupiter"],
  "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof": ["Infra", "DEX", "Raydium"],
  "5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm": ["Infra", "Oracle", "Switchboard"],
  
  // AI Narrative
  "Ai5iKyP8xhGWPnfXLB6GF3v8qKqKg1Mve3gJyVN5QLYh": ["Meme", "AI", "ChatGPT"],
  "SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp": ["Meme", "AI"],
  
  // Gaming/NFT
  "GENEtH5amGSi8kHAtQoezp1XEXwZRLNzThPuuKiMYfy6": ["Utility", "Gaming", "Genopets"],
  "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT": ["Utility", "Fitness", "StepN"],
  
  // Governance
  "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac": ["Utility", "Governance", "Mango"],
  "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt": ["Utility", "Governance", "Serum"]
};

// Category definitions
export const TOKEN_CATEGORIES = {
  primary: [
    "Meme",
    "Utility", 
    "Infra",
    "DeFi",
    "Gaming",
    "NFT",
    "Governance"
  ],
  secondary: {
    meme: ["Animal", "Dog", "Cat", "Pepe", "AI", "Character", "Pump.fun", "Vapor"],
    utility: ["Oracle", "Bridge", "Staking", "Governance", "Fitness", "Social"],
    infra: ["DEX", "Layer2", "Chain", "RPC", "Validator"],
    defi: ["LP", "Yield", "Lending", "Stablecoin", "Derivatives"],
    gaming: ["P2E", "NFT-Game", "Metaverse", "Sports"],
    nft: ["Collection", "Marketplace", "Creator", "Profile"]
  }
};

// Keyword matching patterns
const KEYWORD_PATTERNS = {
  meme: {
    names: ["dog", "doge", "shiba", "inu", "pepe", "wojak", "chad", "giga", "bonk", "samo", "maga"],
    ai: ["gpt", "ai", "chat", "bot", "neural", "machine", "learning"],
    animals: ["cat", "bear", "shark", "frog", "rabbit", "hamster", "monkey"]
  },
  utility: {
    governance: ["gov", "governance", "dao", "vote", "proposal"],
    oracle: ["oracle", "price", "feed", "data", "chainlink"],
    staking: ["stake", "staking", "validator", "delegate"]
  },
  infra: {
    dex: ["swap", "dex", "exchange", "liquidity", "amm"],
    bridge: ["bridge", "cross", "chain", "wrap", "portal"],
    layer2: ["layer", "l2", "rollup", "scaling"]
  }
};

export function categorizeToken(token: TokenMetadata): TokenCategory {
  // 1. Check manual tags first (highest confidence)
  if (MANUAL_TOKEN_TAGS[token.mint]) {
    return {
      primary: MANUAL_TOKEN_TAGS[token.mint][0],
      secondary: MANUAL_TOKEN_TAGS[token.mint].slice(1),
      confidence: 0.95,
      source: 'manual'
    };
  }

  // 2. Metadata-based categorization
  const name = token.name?.toLowerCase() || '';
  const symbol = token.symbol?.toLowerCase() || '';
  const description = token.description?.toLowerCase() || '';
  const text = `${name} ${symbol} ${description}`;

  // Check for meme patterns
  if (token.source === 'pump.fun' || 
      KEYWORD_PATTERNS.meme.names.some(keyword => text.includes(keyword))) {
    const secondary = [];
    
    if (KEYWORD_PATTERNS.meme.ai.some(keyword => text.includes(keyword))) {
      secondary.push("AI");
    }
    if (KEYWORD_PATTERNS.meme.animals.some(keyword => text.includes(keyword))) {
      secondary.push("Animal");
    }
    if (token.source === 'pump.fun') {
      secondary.push("Pump.fun");
    }

    return {
      primary: "Meme",
      secondary,
      confidence: 0.8,
      source: 'metadata'
    };
  }

  // Check for utility patterns
  if (KEYWORD_PATTERNS.utility.governance.some(keyword => text.includes(keyword))) {
    return {
      primary: "Utility",
      secondary: ["Governance"],
      confidence: 0.75,
      source: 'metadata'
    };
  }

  if (KEYWORD_PATTERNS.utility.oracle.some(keyword => text.includes(keyword))) {
    return {
      primary: "Infra",
      secondary: ["Oracle"],
      confidence: 0.75,
      source: 'metadata'
    };
  }

  // Check for DeFi patterns
  if (KEYWORD_PATTERNS.infra.dex.some(keyword => text.includes(keyword))) {
    return {
      primary: "Infra",
      secondary: ["DEX"],
      confidence: 0.75,
      source: 'metadata'
    };
  }

  // 3. Behavioral inference
  if (token.txCount && token.avgHoldTime) {
    // High frequency, short hold time = likely meme
    if (token.txCount > 1000 && token.avgHoldTime < 3600) { // < 1 hour
      return {
        primary: "Meme",
        secondary: ["High-Frequency"],
        confidence: 0.6,
        source: 'behavioral'
      };
    }

    // Low frequency, long hold time = likely utility
    if (token.avgHoldTime > 86400 * 7) { // > 1 week
      return {
        primary: "Utility",
        secondary: ["Long-Term"],
        confidence: 0.5,
        source: 'behavioral'
      };
    }
  }

  // 4. Default fallback
  return {
    primary: "Unknown",
    secondary: ["Uncategorized"],
    confidence: 0.1,
    source: 'heuristic'
  };
}

// Enhanced behavioral analysis based on token categories
export function analyzeTradingNarratives(transactions: any[]): any {
  const categorizedTrades = transactions.map(tx => ({
    ...tx,
    category: categorizeToken({
      mint: tx.tokenMint,
      name: tx.tokenName,
      symbol: tx.tokenSymbol,
      source: tx.source
    })
  }));

  const categoryStats = categorizedTrades.reduce((acc, tx) => {
    const primary = tx.category.primary;
    if (!acc[primary]) {
      acc[primary] = {
        count: 0,
        totalValue: 0,
        avgHoldTime: 0,
        successRate: 0,
        positions: []
      };
    }
    
    acc[primary].count++;
    acc[primary].totalValue += tx.amount || 0;
    acc[primary].positions.push(tx);
    
    return acc;
  }, {});

  // Calculate narrative loyalty
  const totalTrades = transactions.length;
  const narrativeLoyalty = Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
    category,
    percentage: (stats.count / totalTrades * 100).toFixed(1),
    count: stats.count,
    avgValue: stats.totalValue / stats.count
  })).sort((a, b) => b.count - a.count);

  return {
    narrativeLoyalty,
    categoryStats,
    dominantNarrative: narrativeLoyalty[0]?.category || 'Unknown',
    narrativeDiversity: Object.keys(categoryStats).length
  };
}
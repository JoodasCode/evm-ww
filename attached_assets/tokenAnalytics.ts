'use client';

import { MissedOpportunity } from '@/types/analytics';

interface TokenTransaction {
  timestamp: string;
  tokenAddress: string;
  tokenSymbol: string;
  amount: number;
  direction: 'in' | 'out';
  transactionType: 'swap' | 'transfer' | 'mint' | 'burn';
  price?: number;
}

interface TokenPriceData {
  timestamp: string;
  price: number;
  marketCap?: number;
}

/**
 * Calculates missed opportunities by analyzing token sales and subsequent price movements
 * @param walletAddress The wallet address to analyze
 * @param transactions Array of token transactions from Helius
 * @param priceData Price data from CoinGecko or similar service
 * @param lookbackDays Number of days to look back after a sale to check for price increases
 * @param gainThreshold Minimum percentage gain to consider as a missed opportunity
 * @returns Array of missed opportunities
 */
export const calculateMissedOpportunities = async (
  walletAddress: string,
  transactions: TokenTransaction[],
  priceData: Record<string, TokenPriceData[]>,
  lookbackDays: number = 30,
  gainThreshold: number = 50,
): Promise<MissedOpportunity[]> => {
  const missedOpportunities: MissedOpportunity[] = [];

  // Get all sell transactions
  const sellTransactions = transactions.filter((tx) => tx.direction === 'out'
    && (tx.transactionType === 'swap' || tx.transactionType === 'transfer'));

  // Group by token
  const tokenSells = sellTransactions.reduce((acc, tx) => {
    if (!acc[tx.tokenSymbol]) {
      acc[tx.tokenSymbol] = [];
    }
    acc[tx.tokenSymbol].push(tx);
    return acc;
  }, {} as Record<string, TokenTransaction[]>);

  // For each token the user has sold
  for (const [tokenSymbol, sells] of Object.entries(tokenSells)) {
    // For each sell transaction of this token
    for (const sell of sells) {
      // Skip if we don't have price data for this token
      if (!priceData[tokenSymbol]) continue;

      const sellTimestamp = new Date(sell.timestamp);
      const sellPrice = sell.price || getPriceAtTimestamp(priceData[tokenSymbol], sellTimestamp);

      // Skip if we couldn't determine the sell price
      if (!sellPrice) continue;

      // Calculate the lookback window end date
      const lookbackEndDate = new Date(sellTimestamp);
      lookbackEndDate.setDate(lookbackEndDate.getDate() + lookbackDays);

      // Get price data within the lookback window
      const relevantPriceData = priceData[tokenSymbol].filter((data) => {
        const dataDate = new Date(data.timestamp);
        return dataDate >= sellTimestamp && dataDate <= lookbackEndDate;
      });

      // Find the highest price in the lookback window
      const highestPriceData = relevantPriceData.reduce(
        (max, data) => (data.price > max.price ? data : max),
        { timestamp: '', price: 0 },
      );

      // Skip if we couldn't find a highest price or it's not higher than the sell price
      if (!highestPriceData.price || highestPriceData.price <= sellPrice) continue;

      // Calculate the percentage gain missed
      const missedGainPercent = Math.round(((highestPriceData.price - sellPrice) / sellPrice) * 100);

      // Only consider it a missed opportunity if the gain is above the threshold
      if (missedGainPercent >= gainThreshold) {
        const highDate = new Date(highestPriceData.timestamp);
        const daysAfterSell = Math.round((highDate.getTime() - sellTimestamp.getTime()) / (1000 * 60 * 60 * 24));

        // Find a buy transaction for this token before the sell
        const buyTransactions = transactions.filter((tx) => tx.tokenSymbol === tokenSymbol
          && tx.direction === 'in'
          && new Date(tx.timestamp) < sellTimestamp);

        // Use the most recent buy before the sell
        const mostRecentBuy = buyTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        const buyPrice = mostRecentBuy?.price || 0;

        // Add to missed opportunities
        missedOpportunities.push({
          token: tokenSymbol,
          tokenIcon: `/tokens/${tokenSymbol.toLowerCase()}.png`, // This would come from CoinGecko in production
          category: getCategoryForToken(tokenSymbol), // This would come from token metadata in production
          buyPrice,
          sellPrice,
          highPrice: highestPriceData.price,
          sellDate: sell.timestamp,
          highDate: highestPriceData.timestamp,
          missedGainPercent,
          daysAfterSell,
        });
      }
    }
  }

  // Sort by missed gain percentage (highest first)
  return missedOpportunities.sort((a, b) => b.missedGainPercent - a.missedGainPercent);
};

/**
 * Helper function to get the price at a specific timestamp
 * @param priceData Array of price data points
 * @param timestamp The timestamp to get the price for
 * @returns The price at the given timestamp, or undefined if not found
 */
const getPriceAtTimestamp = (priceData: TokenPriceData[], timestamp: Date): number | undefined => {
  // Find the closest price data point to the given timestamp
  const sortedData = [...priceData].sort((a, b) => {
    const diffA = Math.abs(new Date(a.timestamp).getTime() - timestamp.getTime());
    const diffB = Math.abs(new Date(b.timestamp).getTime() - timestamp.getTime());
    return diffA - diffB;
  });

  return sortedData[0]?.price;
};

/**
 * Helper function to get the category for a token (mock implementation)
 * In production, this would come from token metadata or a token database
 */
const getCategoryForToken = (tokenSymbol: string): string => {
  const categories: Record<string, string> = {
    BONK: 'Meme',
    JUP: 'DEX',
    PYTH: 'Oracle',
    RNDR: 'AI',
    SOL: 'L1',
    JTO: 'Infrastructure',
    RAY: 'DEX',
    SAMO: 'Meme',
    MSOL: 'Liquid Staking',
    HADES: 'Gaming',
    MEAN: 'Infrastructure',
    DUST: 'NFT',
    WIF: 'Meme',
    USDC: 'Stablecoin',
  };

  return categories[tokenSymbol] || 'Other';
};

/**
 * Mock function to fetch token transactions from Helius
 * In production, this would make an API call to Helius
 */
export const fetchTokenTransactions = async (walletAddress: string): Promise<TokenTransaction[]> =>
  // This would be replaced with an actual API call to Helius
  [
    {
      timestamp: '2024-12-01T10:00:00Z',
      tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      tokenSymbol: 'BONK',
      amount: 1000000,
      direction: 'in',
      transactionType: 'swap',
      price: 0.000012,
    },
    {
      timestamp: '2024-12-15T14:30:00Z',
      tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      tokenSymbol: 'BONK',
      amount: 1000000,
      direction: 'out',
      transactionType: 'swap',
      price: 0.000018,
    },
    {
      timestamp: '2024-11-10T09:15:00Z',
      tokenAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
      tokenSymbol: 'JTO',
      amount: 500,
      direction: 'in',
      transactionType: 'swap',
      price: 2.14,
    },
    {
      timestamp: '2024-11-20T16:45:00Z',
      tokenAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
      tokenSymbol: 'JTO',
      amount: 500,
      direction: 'out',
      transactionType: 'swap',
      price: 2.87,
    },
  ]
;

/**
 * Mock function to fetch token price data from CoinGecko
 * In production, this would make an API call to CoinGecko or similar
 */
export const fetchTokenPriceData = async (tokenSymbols: string[]): Promise<Record<string, TokenPriceData[]>> =>
  // This would be replaced with an actual API call to CoinGecko
  ({
    BONK: [
      { timestamp: '2024-12-15T14:30:00Z', price: 0.000018 },
      { timestamp: '2024-12-20T00:00:00Z', price: 0.000025 },
      { timestamp: '2024-12-25T00:00:00Z', price: 0.000042 },
      { timestamp: '2025-01-01T00:00:00Z', price: 0.000058 },
      { timestamp: '2025-01-10T00:00:00Z', price: 0.000076 },
      { timestamp: '2025-01-15T00:00:00Z', price: 0.000065 },
    ],
    JTO: [
      { timestamp: '2024-11-20T16:45:00Z', price: 2.87 },
      { timestamp: '2024-11-25T00:00:00Z', price: 3.15 },
      { timestamp: '2024-11-30T00:00:00Z', price: 4.20 },
      { timestamp: '2024-12-05T00:00:00Z', price: 5.62 },
      { timestamp: '2024-12-10T00:00:00Z', price: 4.85 },
    ],
  })
;

/**
 * Comprehensive function to detect missed opportunities for a wallet
 * This combines all the steps: fetching transactions, fetching price data, and calculating missed opportunities
 */
export const detectMissedOpportunities = async (
  walletAddress: string,
  lookbackDays: number = 30,
  gainThreshold: number = 50,
): Promise<MissedOpportunity[]> => {
  try {
    // 1. Fetch all token transactions for the wallet from Helius
    const transactions = await fetchTokenTransactions(walletAddress);

    // 2. Extract unique token symbols from transactions
    const tokenSymbolsSet = new Set<string>();
    transactions.forEach((tx) => tokenSymbolsSet.add(tx.tokenSymbol));
    const tokenSymbols = Array.from(tokenSymbolsSet);

    // 3. Fetch price data for all tokens from CoinGecko
    const priceData = await fetchTokenPriceData(tokenSymbols);

    // 4. Calculate missed opportunities
    return calculateMissedOpportunities(
      walletAddress,
      transactions,
      priceData,
      lookbackDays,
      gainThreshold,
    );
  } catch (error) {
    console.error('Error detecting missed opportunities:', error);
    return [];
  }
};

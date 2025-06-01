import { useState, useEffect } from 'react';

// This hook provides mock data for the EVM psychoanalytical cards
// Later this will be connected to real backend data
export function useWalletPsychoCard(walletAddress: string, cardType: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for different card types
        const mockData: Record<string, any> = {
          traderArchetype: {
            primaryArchetype: "Diamond Hands",
            secondaryArchetype: "Strategic Accumulator",
            description: "You exhibit strong conviction in your holdings and rarely sell based on short-term market movements. Your trading patterns show a strategic approach to accumulating assets during market downturns.",
            dominantTraits: ["High Conviction", "Patient", "Value-focused", "Counter-cyclical"],
            hiddenPatterns: ["FOMO resistance", "Contrarian timing", "Fundamentals-driven"],
            interpretation: "Your psychological profile suggests you're more focused on long-term value than short-term gains, making you resilient during market volatility."
          },
          archetypeBreakdownSummary: {
            primaryArchetype: "Diamond Hands",
            secondaryArchetype: "Strategic Accumulator",
            summary: "Your wallet exhibits exceptional patience and conviction, with a clear focus on long-term value accumulation rather than short-term trading gains.",
            strengths: [
              "Strong emotional control during market volatility",
              "Excellent at identifying value and accumulating during downturns",
              "Disciplined position sizing and risk management"
            ],
            improvements: [
              "Could benefit from more active profit-taking strategies",
              "May miss short-term opportunities due to long-term focus",
              "Consider diversifying entry strategies"
            ],
            behavioralPatterns: [
              "Counter-cyclical buying",
              "Low sell frequency",
              "Strategic DCA",
              "Conviction-based holding",
              "Value-focused entries"
            ],
            interpretation: "Your wallet behavior reveals a disciplined investor with exceptional emotional control, focused on building positions in assets you believe in regardless of short-term market noise."
          },
          averageHoldTime: {
            averageDays: 145,
            percentile: 87,
            comparison: "longer than 87% of similar wallets",
            holdTimeDistribution: [
              { category: "< 1 day", percentage: 5 },
              { category: "1-7 days", percentage: 10 },
              { category: "1-4 weeks", percentage: 15 },
              { category: "1-3 months", percentage: 25 },
              { category: "3-6 months", percentage: 20 },
              { category: "> 6 months", percentage: 25 }
            ],
            interpretation: "Your extended hold times indicate strong conviction and patience, positioning you as a long-term investor rather than a short-term trader."
          },
          convictionCollapse: {
            convictionScore: 82,
            collapseFrequency: "Low",
            averageHoldTimeBeforeSelling: "47 days",
            recentCollapseEvents: [
              { date: "2023-04-15", token: "ETH", percentageLoss: -12, reasonCategory: "Market-wide correction" },
              { date: "2023-06-22", token: "LINK", percentageLoss: -18, reasonCategory: "Project-specific news" }
            ],
            psychologicalTriggers: ["Extreme market volatility", "Negative news cycle", "Portfolio drawdown > 25%"],
            interpretation: "You demonstrate strong conviction in your investment thesis, rarely selling due to short-term market movements. Your psychological resilience during drawdowns is notable."
          },
          diamondHandsScore: {
            score: 85,
            level: "Elite Diamond Hands",
            holdingStrength: "Exceptional",
            longestHold: {
              token: "ETH",
              duration: "412 days",
              throughVolatility: "+125% / -65%"
            },
            recentTestEvents: [
              { date: "2023-05-12", market: "Major correction", reaction: "Added to position" },
              { date: "2023-09-03", market: "Flash crash", reaction: "Held position" }
            ],
            interpretation: "Your wallet demonstrates exceptional conviction during market turbulence, consistently holding or adding to positions during significant drawdowns."
          },
          hoarderVsOperator: {
            classification: "Balanced Operator",
            hoarderScore: 35,
            operatorScore: 65,
            activityMetrics: {
              averageTransactionsPerMonth: 12,
              protocolInteractions: 8,
              uniqueTokensInteractedWith: 15
            },
            interpretation: "Your wallet shows a healthy balance between accumulation and active usage, with a slight preference for operational activities like staking, lending, and protocol interactions."
          },
          impulsivenessMeter: {
            score: 28,
            category: "Highly Disciplined",
            impulsiveTrades: "12%",
            plannedTrades: "88%",
            recentImpulsiveActions: [
              { date: "2023-08-15", action: "Market buy during price spike", outcome: "Negative" },
              { date: "2023-09-22", action: "Panic sell during flash crash", outcome: "Negative" }
            ],
            interpretation: "Your trading exhibits exceptional discipline, with minimal impulsive actions. Your decision-making appears methodical and planned."
          },
          liquidityLurker: {
            classification: "Selective Liquidity Provider",
            liquidityScore: 68,
            activePoolsCount: 3,
            averageLiquidityDuration: "47 days",
            preferredProtocols: ["Uniswap V3", "Curve", "Balancer"],
            interpretation: "You demonstrate a strategic approach to providing liquidity, focusing on established protocols and carefully selected pools for optimal risk-adjusted returns."
          },
          mostTradedTokens: {
            topTokens: [
              { symbol: "ETH", percentage: 35, trades: 28 },
              { symbol: "LINK", percentage: 22, trades: 17 },
              { symbol: "UNI", percentage: 15, trades: 12 },
              { symbol: "AAVE", percentage: 10, trades: 8 },
              { symbol: "MKR", percentage: 8, trades: 6 }
            ],
            tradingFocus: "Major DeFi Ecosystem",
            diversificationLevel: "Moderate",
            interpretation: "Your trading activity shows a focus on established Ethereum ecosystem tokens, with a preference for DeFi infrastructure over speculative assets."
          },
          narrativeChaser: {
            score: 42,
            classification: "Selective Narrative Participant",
            recentNarratives: [
              { narrative: "DeFi Summer", participation: "High", timing: "Early" },
              { narrative: "NFT Boom", participation: "Low", timing: "Late" },
              { narrative: "L2 Scaling", participation: "Medium", timing: "Middle" }
            ],
            interpretation: "You demonstrate selective participation in market narratives, showing stronger conviction in fundamental technology shifts rather than speculative trends."
          },
          patiencePsychology: {
            patienceScore: 78,
            classification: "Highly Patient",
            averageEntryTiming: "Counter-trend",
            waitingPeriods: {
              beforeEntry: "Extended",
              beforeExit: "Optimal"
            },
            interpretation: "Your trading psychology exhibits exceptional patience, often entering positions during periods of market fear and exiting during periods of market greed."
          },
          positionSizingPsychology: {
            sizingDiscipline: "Excellent",
            averagePositionSize: "8% of portfolio",
            sizeDistribution: [
              { size: "Small (<5%)", percentage: 45 },
              { size: "Medium (5-15%)", percentage: 40 },
              { size: "Large (>15%)", percentage: 15 }
            ],
            psychologicalPatterns: [
              "Consistent position sizing across market conditions",
              "Appropriate scaling based on conviction",
              "Risk-adjusted allocation"
            ],
            interpretation: "Your position sizing demonstrates excellent risk management and emotional control, with appropriate allocation based on conviction level."
          },
          profitDiscipline: {
            score: 72,
            profitTakingStyle: "Methodical",
            averageProfitTarget: "65%",
            exitPatterns: [
              { pattern: "Partial exits at predetermined levels", frequency: "High" },
              { pattern: "Full exits after fundamental changes", frequency: "Medium" },
              { pattern: "Trailing stops during strong trends", frequency: "Low" }
            ],
            interpretation: "Your profit-taking strategy shows discipline and methodology, with a preference for securing partial profits while maintaining exposure to further upside."
          },
          sentimentalAttachment: {
            attachmentScore: 58,
            classification: "Moderately Attached",
            attachmentPatterns: [
              { token: "ETH", level: "High", behavior: "Never sells entire position" },
              { token: "LINK", level: "Medium", behavior: "Consistently rebuy after taking profit" }
            ],
            interpretation: "You show moderate sentimental attachment to core holdings, particularly Ethereum, which may occasionally override purely rational decision-making."
          },
          tradingTimeHeatmap: {
            mostActiveDay: "Thursday",
            mostActiveTime: "20:00-22:00 UTC",
            activityHeatmap: [
              { day: "Monday", morning: 2, afternoon: 3, evening: 4, night: 2 },
              { day: "Tuesday", morning: 1, afternoon: 2, evening: 3, night: 1 },
              { day: "Wednesday", morning: 2, afternoon: 4, evening: 5, night: 3 },
              { day: "Thursday", morning: 3, afternoon: 5, evening: 7, night: 4 },
              { day: "Friday", morning: 2, afternoon: 4, evening: 5, night: 3 },
              { day: "Saturday", morning: 1, afternoon: 2, evening: 3, night: 2 },
              { day: "Sunday", morning: 1, afternoon: 1, evening: 2, night: 1 }
            ],
            interpretation: "Your trading activity shows a clear pattern of increased activity during evening hours and mid-week, possibly indicating trading around work schedules or in response to market patterns."
          }
        };

        // Return the requested card data
        if (mockData[cardType]) {
          setData({ [cardType]: mockData[cardType] });
        } else {
          throw new Error(`No data available for card type: ${cardType}`);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress, cardType]);

  return { data, loading, error };
}

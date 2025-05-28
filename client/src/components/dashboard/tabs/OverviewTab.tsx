import { WhispererScoreCard } from '../cards/WhispererScoreCard';
import { PortfolioSummaryCard } from '../cards/PortfolioSummaryCard';
import { ArchetypeCard } from '../cards/ArchetypeCard';
import { TokenBalanceCard } from '../cards/TokenBalanceCard';
import { TradingActivityCard } from '../cards/TradingActivityCard';
import { useWhispererScore, useTokenBalances, useTradingActivity } from '@/hooks/useWhispererData';

export function OverviewTab() {
  const { data: scoreData, isLoading: scoreLoading } = useWhispererScore();
  const { data: tokenData = [], isLoading: tokenLoading } = useTokenBalances();
  const { data: activityData = [], isLoading: activityLoading } = useTradingActivity();

  return (
    <div className="space-y-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WhispererScoreCard data={scoreData} isLoading={scoreLoading} />
        <PortfolioSummaryCard 
          scoreData={scoreData} 
          tokenData={tokenData} 
          isLoading={scoreLoading || tokenLoading} 
        />
        <ArchetypeCard data={scoreData} isLoading={scoreLoading} />
      </div>

      {/* Holdings and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenBalanceCard data={tokenData} isLoading={tokenLoading} />
        <TradingActivityCard data={activityData} isLoading={activityLoading} />
      </div>
    </div>
  );
}

import { Brain, Activity, Zap, Clock, BarChart3, Diamond, Scale, Target, Heart, Wallet, PieChart, Timer, TrendingDown, LineChart, FileText, AlertTriangle, TrendingUp, Flame, BrainCircuit, Lightbulb, Gauge, Radar, Coins, Repeat, ArrowUpDown, Layers, BarChart, Percent, CalendarClock, Shuffle, Sparkles, Fingerprint, Waves, Undo, Sigma, Infinity, Atom } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CardLayout } from "@/components/ui/card-layout";
import { MiniCard } from "../cards/MiniCard";
import { cn } from "@/lib/utils";

interface PsychWardTabProps {
  walletAddress: string;
}

export function PsychWardTab({ walletAddress }: PsychWardTabProps) {
  const [visibleCards, setVisibleCards] = useState(12);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);

  // Function to load more cards with a simulated delay
  const loadMoreCards = () => {
    if (visibleCards >= 40 || loading) return;
    
    setLoading(true);
    setTimeout(() => {
      setVisibleCards(prev => Math.min(prev + 8, 40));
      setLoading(false);
    }, 800);
  };

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loadTriggerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreCards();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(loadTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleCards, loading]);



  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Psych Ward</h2>
        <p className="text-muted-foreground">Executive summary of your trading psychology</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cognitive Snapshot Cards */}
      <MiniCard 
        walletAddress={walletAddress}
        icon={Brain}
        title="Trader Archetype"
        description="Your trading personality type"
        value="Momentum Chaser"
        badge="Fast Rotations"
      />
      <MiniCard 
        walletAddress={walletAddress}
        icon={Activity}
        title="Psycho Score"
        description="Composite behavioral score"
        value="71/100"
        badge="Top 22%"
      />
      <MiniCard 
        walletAddress={walletAddress}
        icon={Target}
        title="Win Rate"
        description="Percentage of profitable trades"
        value="61%"
        badge="Consistent"
        badgeVariant="outline"
      />
      <MiniCard 
        walletAddress={walletAddress}
        icon={Clock}
        title="Average Hold Time"
        description="How long you keep positions"
        value="4.6 days"
        badge="Tactical"
        badgeVariant="outline"
      />
      
      {/* Load more cards if visible */}
      {visibleCards >= 16 && (
        <>
          <MiniCard 
            walletAddress={walletAddress}
            icon={Zap}
            title="Most Traded Token"
            description="Your favorite battlefield"
            value="$PEPE"
            badge="23 trades"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Wallet}
            title="Biggest Position"
            description="Your largest conviction bet"
            value="$9.2k"
            badge="$LDO"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={BarChart3}
            title="Trade Frequency"
            description="Your trading activity pattern"
            value="3.6 trades/day"
            badge="Active"
            badgeVariant="outline"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Diamond}
            title="Diamond Hands Index"
            description="Holding through volatility"
            value="74/100"
            badge="Seasoned"
          />
        </>
      )}
      
      {/* Cognitive Patterns Cards */}
      {visibleCards >= 20 && (
        <>
          <MiniCard 
            walletAddress={walletAddress}
            icon={Scale}
            title="Position Sizing Psychology"
            description="How you allocate capital"
            value="Moderate Variance"
            badge="Strategic"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Percent}
            title="Profit Discipline"
            description="Consistency in taking profits"
            value="61%"
            badge="Balanced"
            badgeVariant="outline"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={CalendarClock}
            title="Favorite Time to Trade"
            description="When you're most active"
            value="3-5 PM UTC"
            badge="Peak Hours"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={PieChart}
            title="Concentration Index"
            description="Portfolio diversification"
            value="68%"
            badge="2 tokens"
            badgeVariant="outline"
          />
        </>
      )}
      
      {/* Insights Cards */}
      {visibleCards >= 28 && (
        <>
          <MiniCard 
            walletAddress={walletAddress}
            icon={Timer}
            title="Impulse Meter"
            description="How quickly you deploy funds"
            value="87%"
            badge="< 30 mins"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={TrendingDown}
            title="Profit-Taking Patterns"
            description="When you choose to exit"
            value="~12% gains"
            badge="Consistent"
            badgeVariant="outline"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Flame}
            title="FOMO Fingerprint"
            description="How you chase momentum"
            value="51%"
            badge="FOMO-prone"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={LineChart}
            title="Trend Reversal Buyer"
            description="Buying against market direction"
            value="68%"
            badge="Contrarian"
            badgeVariant="outline"
          />
        </>
      )}
      
      {/* Psychoanalytics Cards */}
      {visibleCards >= 36 && (
        <>
          <MiniCard 
            walletAddress={walletAddress}
            icon={Heart}
            title="Sentimental Attachment"
            description="Tokens you can't let go"
            value="$DOGE"
            badge="-22% held 9+ days"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Scale}
            title="Risk Appetite"
            description="Your tolerance for volatility"
            value="Aggressive"
            badge="47% large positions"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={BrainCircuit}
            title="Psychological Archetype"
            description="Your trading personality breakdown"
            value="Swing + FOMO"
            badge="Calculated but reactive"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={AlertTriangle}
            title="Revenge Trade Detector"
            description="When you trade to recover losses"
            value="2.4x"
            badge="Post-loss buy size"
          />
        </>
      )}
      
      {/* Additional Cards */}
      {visibleCards >= 40 && (
        <>
          <MiniCard 
            walletAddress={walletAddress}
            icon={Shuffle}
            title="Token Rotation Score"
            description="How often you switch tokens"
            value="27 tokens"
            badge="30 days"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Layers}
            title="Portfolio Entropy"
            description="Uncertainty in distribution"
            value="0.61"
            badge="Moderate"
            badgeVariant="outline"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Coins}
            title="Active Token Count"
            description="Unique tokens touched"
            value="14 tokens"
            badge="This week"
          />
          <MiniCard 
            walletAddress={walletAddress}
            icon={Repeat}
            title="Flip Speed by Token"
            description="Hold time per token"
            value="$LFG: 6h"
            badge="Fast flips"
          />
        </>
      )}
      
      {/* Load More Trigger */}
      <div ref={loadTriggerRef} className="col-span-1 md:col-span-2 lg:col-span-4 mt-8 flex justify-center">
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Loading more insights...</span>
          </div>
        ) : visibleCards < 40 ? (
          <span className="text-sm text-muted-foreground">Scroll for more psychological insights</span>
        ) : (
          <span className="text-sm text-muted-foreground">All psychological insights loaded</span>
        )}
      </div>
      </div>
    </div>
  );
}

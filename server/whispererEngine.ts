/**
 * The Whisperer: LLM-Powered Psychological Interpretations
 * Transforms raw card data into personalized behavioral narratives
 */

interface WhispererProfile {
  walletAddress: string;
  archetype: string;
  convictionCollapse: number;
  sizingConsistency: number;
  narrativeLoyalty: string;
  diversification: {
    style: string;
    top3Percentage: number;
  };
  contradictions: string[];
  flags: string[];
  suggestions: string[];
  narratives: {
    brutal: string;
    encouraging: string;
    analytical: string;
    chaotic: string;
  };
}

class WhispererEngine {
  private groqApiKey = process.env.GROQ_API_KEY;

  /**
   * Generate psychological narratives from card data
   */
  async generateNarratives(cardData: any): Promise<WhispererProfile> {
    const profile = this.buildBaseProfile(cardData);
    
    if (!this.groqApiKey) {
      console.warn('⚠️ Groq API key not available - using fallback narratives');
      profile.narratives = this.generateFallbackNarratives(profile);
      return profile;
    }

    try {
      profile.narratives = await this.generateGroqNarratives(profile);
    } catch (error) {
      console.error('Groq narrative generation failed:', error);
      profile.narratives = this.generateFallbackNarratives(profile);
    }

    return profile;
  }

  /**
   * Build base psychological profile from card outputs
   */
  private buildBaseProfile(cardData: any): Omit<WhispererProfile, 'narratives'> {
    const cards = cardData.psychologicalCards;
    
    // Detect contradictions
    const contradictions = this.detectContradictions(cardData, cards);
    
    // Generate behavioral flags
    const flags = this.generateFlags(cards);
    
    // Create actionable suggestions
    const suggestions = this.generateSuggestions(cards);

    return {
      walletAddress: cardData.walletAddress,
      archetype: cardData.archetype,
      convictionCollapse: cards.convictionCollapse.score,
      sizingConsistency: cards.positionSizing.sizingConsistency,
      narrativeLoyalty: cards.narrativeLoyalty.dominantNarrative,
      diversification: {
        style: cards.diversificationPsych.strategy,
        top3Percentage: cards.diversificationPsych.top3Percentage || 0
      },
      contradictions,
      flags,
      suggestions
    };
  }

  /**
   * Detect psychological contradictions in the data
   */
  private detectContradictions(data: any, cards: any): string[] {
    const contradictions: string[] = [];

    // High conviction vs frequent trading
    if (cards.convictionCollapse.score > 80 && data.tradingFrequency > 2) {
      contradictions.push("High conviction claimed despite frequent position changes");
    }

    // Premium strategy vs high stress
    if (cards.gasFeePersonality.personality === "Premium Strategy" && cards.stressResponse.stressScore > 60) {
      contradictions.push("Premium gas fees but high stress indicators detected");
    }

    // FOMO vs low degen scores
    if (cards.fomoFearCycle.fomoScore > 40 && data.degenScore < 30) {
      contradictions.push("FOMO behavior inconsistent with conservative degen rating");
    }

    // Over-diversified whale
    if (data.archetype.includes("Whale") && cards.diversificationPsych.uniqueTokens > 20) {
      contradictions.push("Whale classification conflicts with portfolio scatter");
    }

    return contradictions;
  }

  /**
   * Generate behavioral warning flags
   */
  private generateFlags(cards: any): string[] {
    const flags: string[] = [];

    if (cards.convictionCollapse.events > 5) {
      flags.push("high_conviction_collapse");
    }

    if (cards.positionSizing.sizingConsistency < 30) {
      flags.push("emotional_sizing");
    }

    if (cards.stressResponse.stressScore > 70) {
      flags.push("stress_overload");
    }

    if (cards.socialInfluence.influenceScore > 60) {
      flags.push("social_influence_risk");
    }

    return flags;
  }

  /**
   * Generate actionable suggestions
   */
  private generateSuggestions(cards: any): string[] {
    const suggestions: string[] = [];

    if (cards.convictionCollapse.score < 50) {
      suggestions.push("Consider longer hold times or larger position sizing");
    }

    if (cards.positionSizing.sizingConsistency < 40) {
      suggestions.push("Implement systematic position sizing rules");
    }

    if (cards.fomoFearCycle.fomoScore > 50) {
      suggestions.push("Implement 24-hour cooling period for social-driven trades");
    }

    if (cards.narrativeLoyalty.loyaltyScore > 85) {
      suggestions.push("Consider diversifying across different market narratives");
    }

    if (cards.stressResponse.stressScore > 60) {
      suggestions.push("Reduce position sizes during high-stress periods");
    }

    return suggestions;
  }

  /**
   * Generate Groq-powered psychological narratives
   */
  private async generateGroqNarratives(profile: Omit<WhispererProfile, 'narratives'>): Promise<WhispererProfile['narratives']> {
    const prompt = this.buildNarrativePrompt(profile);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are The Whisperer, a brutally honest crypto trading psychoanalyst. Generate 4 different narrative styles for this trader profile. Be observational, not prescriptive. Show patterns, not solutions. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const result = await response.json();
      return JSON.parse(result.choices[0].message.content);
      
    } catch (error) {
      console.error('Groq narrative generation failed:', error);
      throw error;
    }
  }

  /**
   * Build narrative generation prompt
   */
  private buildNarrativePrompt(profile: Omit<WhispererProfile, 'narratives'>): string {
    return `
Analyze this crypto trader's psychological profile and generate 4 narrative styles.

TRADER PROFILE:
- Archetype: ${profile.archetype}
- Conviction Collapse Score: ${profile.convictionCollapse}/100
- Position Sizing Consistency: ${profile.sizingConsistency}%
- Dominant Narrative: ${profile.narrativeLoyalty}
- Diversification: ${profile.diversification.style} (Top 3: ${profile.diversification.top3Percentage}%)
- Contradictions: ${profile.contradictions.join(', ')}
- Behavioral Flags: ${profile.flags.join(', ')}

Generate responses in this JSON format:
{
  "brutal": "Harsh but accurate psychological mirror - show them their patterns",
  "encouraging": "Supportive but realistic - acknowledge strengths while noting areas for growth", 
  "analytical": "Clinical and precise - focus on data patterns and behavioral observations",
  "chaotic": "Unpredictable and wild - creative psychological insights with edge"
}

Each narrative should be 2-3 sentences and feel like a psychoanalyst reading their trading soul.
`;
  }

  /**
   * Fallback narratives when LLM is unavailable
   */
  private generateFallbackNarratives(profile: Omit<WhispererProfile, 'narratives'>): WhispererProfile['narratives'] {
    const brutal = this.generateBrutalNarrative(profile);
    const encouraging = this.generateEncouragingNarrative(profile);
    const analytical = this.generateAnalyticalNarrative(profile);
    const chaotic = this.generateChaoticNarrative(profile);

    return { brutal, encouraging, analytical, chaotic };
  }

  private generateBrutalNarrative(profile: Omit<WhispererProfile, 'narratives'>): string {
    if (profile.convictionCollapse < 50) {
      return `Welcome back, paper hands. You've flipped positions ${profile.contradictions.length} times this week. Your conviction crumbles faster than a house of cards in a hurricane.`;
    }
    
    if (profile.sizingConsistency < 40) {
      return `Your position sizing is pure chaos. ${profile.sizingConsistency}% consistency means you're trading with your heart, not your head. Emotions are expensive.`;
    }
    
    return `You're the definition of organized confusion. High conviction but scattered execution. Pick a lane and stick to it.`;
  }

  private generateEncouragingNarrative(profile: Omit<WhispererProfile, 'narratives'>): string {
    if (profile.archetype.includes("Premium")) {
      return `You've got the premium strategy down - those gas fees show commitment. Now let's work on the psychological consistency to match your technical approach.`;
    }
    
    return `Your ${profile.narrativeLoyalty} focus shows dedication. With ${profile.diversification.top3Percentage}% in top positions, you understand concentration. Time to refine the timing.`;
  }

  private generateAnalyticalNarrative(profile: Omit<WhispererProfile, 'narratives'>): string {
    return `Analysis: ${profile.contradictions.length} contradictions detected in behavioral pattern matrix. Primary deviation: conviction metrics vs execution frequency. Recommendation: systematic approach implementation.`;
  }

  private generateChaoticNarrative(profile: Omit<WhispererProfile, 'narratives'>): string {
    const chaos = [
      "Your wallet reads like a fever dream written by a caffeinated hamster on a trading floor.",
      "Congratulations, you've achieved quantum superposition in trading - simultaneously convicted and panicked.",
      "Your portfolio is a beautiful disaster, like abstract art made of green and red candles."
    ];
    
    return chaos[Math.floor(Math.random() * chaos.length)];
  }
}

export const whispererEngine = new WhispererEngine();
import { prisma } from '../prisma';
import { getCachedCardData, cacheCardData } from '../redis';
import duneClient from '../dune';

/**
 * Abstract base class for all psychoanalytic card calculators
 * Implements the "backend controls the brain, the card is just the face" pattern
 */
export abstract class PsychoCardCalculator {
  abstract cardType: string;
  abstract duneQueryId: string;
  
  /**
   * Transform raw Dune data into card format
   * This is where the card-specific calculation logic lives
   */
  abstract transform(duneData: any): any;
  
  /**
   * Get card data for a wallet
   * Implements caching, database storage, and calculation logic
   */
  async getCardData(walletAddress: string, forceRefresh = false): Promise<any> {
    // Try cache first (unless force refresh requested)
    if (!forceRefresh) {
      const cachedData = await getCachedCardData(walletAddress, this.cardType);
      if (cachedData) return cachedData;
    }
    
    try {
      // Fetch from Dune
      const duneData = await duneClient.fetchDuneData(
        this.duneQueryId, 
        { wallet: walletAddress.toLowerCase() },
        forceRefresh
      );
      
      // Transform raw data into card format
      const cardData = this.transform(duneData);
      
      // Add metadata
      const enrichedCardData = {
        ...cardData,
        metadata: {
          calculatedAt: new Date().toISOString(),
          cardType: this.cardType,
          walletAddress
        }
      };
      
      // Cache result (24 hours TTL)
      await cacheCardData(walletAddress, this.cardType, enrichedCardData);
      
      // Store in database
      await this.storeCardData(walletAddress, enrichedCardData);
      
      return enrichedCardData;
    } catch (error: unknown) {
      console.error(`Error calculating ${this.cardType} card for wallet ${walletAddress}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return this.createErrorCard(walletAddress, errorMessage);
    }
  }
  
  /**
   * Create an error card when calculation fails
   */
  protected createErrorCard(walletAddress: string, errorMessage: string): any {
    return {
      error: true,
      message: errorMessage,
      cardType: this.cardType,
      metadata: {
        calculatedAt: new Date().toISOString(),
        cardType: this.cardType,
        walletAddress
      }
    };
  }

  /**
   * Store card data in the database
   */
  private async storeCardData(walletAddress: string, cardData: any): Promise<void> {
    try {
      // Get or create wallet profile
      const wallet = await prisma.walletProfile.upsert({
        where: { walletAddress },
        update: { lastUpdated: new Date() },
        create: { walletAddress }
      });
      
      // Store card data
      await prisma.psychoCard.upsert({
        where: {
          walletId_cardType: {
            walletId: wallet.id,
            cardType: this.cardType
          }
        },
        update: {
          value: cardData,
          calculatedAt: new Date()
        },
        create: {
          walletId: wallet.id,
          cardType: this.cardType,
          value: cardData
        }
      });
    } catch (error: unknown) {
      console.error(`Error storing ${this.cardType} for ${walletAddress}:`, error);
      // Don't throw - this is a non-critical operation
    }
  }
}

/**
 * WALLET WHISPERER CARD CONTROLLER
 * 
 * Central registry and manager for all psychoanalytic cards.
 * Implements the "backend controls the brain, the card is just the face" pattern.
 */

// Import card calculators
import archetypeClassifier from './archetype-classifier';
import riskAppetiteMeter from './risk-appetite-meter';
import fomoFearCycle from './fomo-fear-cycle';

// Import base types
import { PsychoCardCalculator } from './base';

// Card registry - add all card calculators here
const cardRegistry: Record<string, PsychoCardCalculator> = {
  'archetype-classifier': archetypeClassifier,
  'risk-appetite-meter': riskAppetiteMeter,
  'fomo-fear-cycle': fomoFearCycle,
};

/**
 * Card Controller - main interface for accessing card data
 */
export class CardController {
  /**
   * Get data for a specific card type and wallet
   */
  async getCard(walletAddress: string, cardType: string, forceRefresh = false): Promise<any> {
    const calculator = this.getCardCalculator(cardType);
    if (!calculator) {
      throw new Error(`Unknown card type: ${cardType}`);
    }
    
    return calculator.getCardData(walletAddress, forceRefresh);
  }
  
  /**
   * Get data for multiple cards for a wallet
   */
  async getCards(walletAddress: string, cardTypes: string[], forceRefresh = false): Promise<any[]> {
    // Validate card types
    const validCardTypes = cardTypes.filter(type => this.getCardCalculator(type));
    
    if (validCardTypes.length === 0) {
      throw new Error('No valid card types specified');
    }
    
    // Process cards in parallel
    const cardPromises = validCardTypes.map(cardType => 
      this.getCard(walletAddress, cardType, forceRefresh)
        .catch(error => ({
          error: true,
          message: error.message,
          cardType,
          metadata: {
            calculatedAt: new Date().toISOString(),
            cardType,
            walletAddress
          }
        }))
    );
    
    return Promise.all(cardPromises);
  }
  
  /**
   * Get all available cards for a wallet
   */
  async getAllCards(walletAddress: string, forceRefresh = false): Promise<any[]> {
    const allCardTypes = Object.keys(cardRegistry);
    return this.getCards(walletAddress, allCardTypes, forceRefresh);
  }
  
  /**
   * Get a card calculator by type
   */
  private getCardCalculator(cardType: string): PsychoCardCalculator | null {
    return cardRegistry[cardType] || null;
  }
  
  /**
   * Get all available card types
   */
  getAvailableCardTypes(): string[] {
    return Object.keys(cardRegistry);
  }
}

// Export singleton instance
export default new CardController();

#!/bin/bash

# Test all 17 card types with the Cented wallet
WALLET="CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o"
BASE_URL="http://localhost:5000"

# All supported card types
CARD_TYPES=(
  "archetype-classifier"
  "trading-rhythm" 
  "risk-appetite-meter"
  "position-sizing-psychology"
  "time-of-day-patterns"
  "token-rotation-intelligence"
  "gas-fee-personality"
  "market-timing-ability"
  "conviction-collapse-detector"
  "fomo-fear-cycle"
  "post-rug-behavior"
  "loss-aversion"
  "profit-taking-discipline"
  "narrative-loyalty"
  "stress-response-patterns"
  "social-trading-influence"
  "false-conviction"
  "llm-insight-generator"
)

echo "🔍 Testing all 17 card types for wallet: $WALLET"
echo "=================================================================="

SUCCESS_COUNT=0
FAILED_CARDS=()

for card in "${CARD_TYPES[@]}"; do
  echo -n "Testing $card... "
  
  response=$(curl -s -X POST "$BASE_URL/api/cards/$WALLET" \
    -H "Content-Type: application/json" \
    -d "{\"cardTypes\": [\"$card\"]}")
  
  if echo "$response" | grep -q "\"error\":null" && echo "$response" | grep -q "\"cardType\":\"$card\""; then
    echo "✅ PASS"
    ((SUCCESS_COUNT++))
  else
    echo "❌ FAIL"
    FAILED_CARDS+=("$card")
  fi
done

echo "=================================================================="
echo "📊 Results: $SUCCESS_COUNT/17 cards passed"

if [ ${#FAILED_CARDS[@]} -eq 0 ]; then
  echo "🎉 All card types are working correctly!"
else
  echo "⚠️  Failed cards: ${FAILED_CARDS[*]}"
fi
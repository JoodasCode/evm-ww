// Manual audit of Cented's psychological card calculations
import { walletPipeline } from './server/postgresWalletPipeline';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false }
});

async function auditCentedCalculations() {
  console.log('🔍 MANUAL AUDIT: Cented Wallet Calculation Logic');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const centedWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o';
  
  try {
    // Get raw transaction data from database
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT raw_data, signature, block_time 
      FROM wallet_trades 
      WHERE wallet_address = $1 
      ORDER BY block_time DESC 
      LIMIT 100
    `, [centedWallet]);
    
    const transactions = result.rows.map(row => {
      try {
        return typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data;
      } catch (e) {
        console.log('Failed to parse:', row.raw_data);
        return null;
      }
    }).filter(tx => tx !== null);
    console.log(`📊 Raw Data: ${transactions.length} transactions found`);
    
    // AUDIT 1: Gas Fee Personality - Manual Calculation
    console.log('\n🔍 AUDIT 1: GAS FEE PERSONALITY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const fees = transactions
      .map(tx => tx.fee || 0)
      .filter(fee => fee > 0);
    
    console.log(`Total transactions with fees: ${fees.length}`);
    console.log(`Fee samples (first 10):`, fees.slice(0, 10));
    
    const avgFee = fees.reduce((sum, fee) => sum + fee, 0) / fees.length;
    const minFee = Math.min(...fees);
    const maxFee = Math.max(...fees);
    const medianFee = fees.sort((a, b) => a - b)[Math.floor(fees.length / 2)];
    
    console.log(`Manual Calculations:`);
    console.log(`  Average Fee: ${avgFee.toFixed(0)} lamports (${(avgFee / 1000000000).toFixed(6)} SOL)`);
    console.log(`  Min Fee: ${minFee.toFixed(0)} lamports`);
    console.log(`  Max Fee: ${maxFee.toFixed(0)} lamports`);
    console.log(`  Median Fee: ${medianFee.toFixed(0)} lamports`);
    
    // Fee variance calculation
    const feeVariance = fees.reduce((sum, fee) => sum + Math.pow(fee - avgFee, 2), 0) / fees.length;
    const feeStdDev = Math.sqrt(feeVariance);
    console.log(`  Standard Deviation: ${feeStdDev.toFixed(0)} lamports`);
    console.log(`  Variance: ${feeVariance.toFixed(0)}`);
    
    // Personality classification logic check
    let personality = "Standard Strategy";
    if (avgFee > 8000000) personality = "Premium Strategy";
    else if (avgFee < 3000000) personality = "Cost Optimizer";
    
    console.log(`  Manual Personality: ${personality}`);
    console.log(`  Urgency Score: ${Math.min(100, (avgFee / 10000000) * 100).toFixed(1)}/100`);
    
    // AUDIT 2: Position Sizing Psychology - Manual Calculation
    console.log('\n🔍 AUDIT 2: POSITION SIZING PSYCHOLOGY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const tokenTransfers = transactions
      .filter(tx => tx.tokenTransfers && tx.tokenTransfers.length > 0)
      .flatMap(tx => tx.tokenTransfers);
    
    console.log(`Total token transfers: ${tokenTransfers.length}`);
    
    const transferAmounts = tokenTransfers
      .map(transfer => transfer.tokenAmount || 0)
      .filter(amount => amount > 0);
    
    console.log(`Transfer amount samples (first 10):`, transferAmounts.slice(0, 10));
    
    const avgPosition = transferAmounts.reduce((sum, amount) => sum + amount, 0) / transferAmounts.length;
    const minPosition = Math.min(...transferAmounts);
    const maxPosition = Math.max(...transferAmounts);
    
    console.log(`Manual Calculations:`);
    console.log(`  Average Position: ${avgPosition.toFixed(0)}`);
    console.log(`  Min Position: ${minPosition}`);
    console.log(`  Max Position: ${maxPosition}`);
    console.log(`  Position Range: ${((maxPosition - minPosition) / avgPosition * 100).toFixed(1)}% of average`);
    
    // Position variance
    const positionVariance = transferAmounts.reduce((sum, amount) => sum + Math.pow(amount - avgPosition, 2), 0) / transferAmounts.length;
    const sizingConsistency = Math.max(0, 100 - (positionVariance / avgPosition) * 100);
    
    console.log(`  Position Variance: ${positionVariance.toFixed(0)}`);
    console.log(`  Manual Sizing Consistency: ${sizingConsistency.toFixed(1)}/100`);
    console.log(`  Pattern: ${sizingConsistency > 70 ? "Systematic Sizing" : "Emotional Sizing"}`);
    
    // AUDIT 3: Conviction Collapse - Manual Analysis
    console.log('\n🔍 AUDIT 3: CONVICTION COLLAPSE DETECTOR');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Look for quick buy-sell patterns
    const swapTransactions = transactions.filter(tx => 
      tx.description && (tx.description.includes('swap') || tx.description.includes('buy') || tx.description.includes('sell'))
    );
    
    console.log(`Total swap transactions: ${swapTransactions.length}`);
    console.log(`Swap descriptions (first 5):`);
    swapTransactions.slice(0, 5).forEach((tx, i) => {
      console.log(`  ${i + 1}. ${tx.description} (${new Date(tx.blockTime * 1000).toISOString()})`);
    });
    
    // Check for rapid reversals (buy then sell within 24 hours)
    let convictionCollapses = 0;
    for (let i = 0; i < swapTransactions.length - 1; i++) {
      const current = swapTransactions[i];
      const next = swapTransactions[i + 1];
      
      const timeDiff = Math.abs(current.blockTime - next.blockTime) * 1000; // ms
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        // Check if it's a reversal pattern
        const isBuyThenSell = 
          (current.description.includes('buy') && next.description.includes('sell')) ||
          (current.description.includes('swap') && next.description.includes('swap'));
        
        if (isBuyThenSell) {
          convictionCollapses++;
          console.log(`  Potential collapse: ${current.description} → ${next.description} (${hoursDiff.toFixed(1)}h apart)`);
        }
      }
    }
    
    const collapseRate = (convictionCollapses / swapTransactions.length) * 100;
    console.log(`Manual Calculations:`);
    console.log(`  Rapid reversals found: ${convictionCollapses}`);
    console.log(`  Collapse rate: ${collapseRate.toFixed(1)}%`);
    console.log(`  Manual conviction score: ${Math.max(0, 100 - collapseRate * 10).toFixed(0)}/100`);
    
    // AUDIT 4: Diversification Check
    console.log('\n🔍 AUDIT 4: DIVERSIFICATION PSYCHOLOGY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const uniqueTokens = new Set();
    transactions.forEach(tx => {
      if (tx.tokenTransfers) {
        tx.tokenTransfers.forEach(transfer => {
          if (transfer.mint) uniqueTokens.add(transfer.mint);
        });
      }
    });
    
    console.log(`Unique tokens traded: ${uniqueTokens.size}`);
    console.log(`Token mints (first 10):`, Array.from(uniqueTokens).slice(0, 10));
    
    const diversificationScore = Math.min(100, (uniqueTokens.size / 20) * 100);
    let strategy = "Balanced";
    if (uniqueTokens.size < 5) strategy = "Concentrated";
    else if (uniqueTokens.size > 15) strategy = "Over-Diversified";
    
    console.log(`Manual Calculations:`);
    console.log(`  Diversification Score: ${diversificationScore.toFixed(0)}/100`);
    console.log(`  Strategy: ${strategy}`);
    
    // SUMMARY OF FINDINGS
    console.log('\n🎯 AUDIT SUMMARY & RED FLAGS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log(`\n🚨 POTENTIAL ISSUES DETECTED:`);
    
    if (sizingConsistency < 10) {
      console.log(`  ❌ Position sizing consistency (${sizingConsistency.toFixed(1)}%) seems too low - check variance calculation`);
    }
    
    if (convictionCollapses === 0 && uniqueTokens.size > 20) {
      console.log(`  ❌ Zero conviction collapses despite ${uniqueTokens.size} tokens - logic might be too strict`);
    }
    
    if (avgFee > 8000000 && collapseRate === 0) {
      console.log(`  ❌ Premium fees but no emotional trading detected - contradiction in logic`);
    }
    
    console.log(`\n✅ VERIFIED CALCULATIONS:`);
    console.log(`  ✓ Gas fee personality: ${personality} (${avgFee.toFixed(0)} lamports avg)`);
    console.log(`  ✓ Diversification: ${strategy} (${uniqueTokens.size} tokens)`);
    console.log(`  ✓ Transaction volume: ${transactions.length} transactions analyzed`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    throw error;
  }
}

// Run the audit
auditCentedCalculations()
  .then(() => {
    console.log('\n🔍 Manual audit completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Audit failed:', error);
    process.exit(1);
  });
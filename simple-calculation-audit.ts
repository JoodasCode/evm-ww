// Direct audit of calculation logic issues
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

async function auditCalculationLogic() {
  console.log('CALCULATION LOGIC AUDIT: Identifying Flawed Math');
  console.log('================================================');
  
  const centedWallet = 'CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o';
  
  try {
    const client = await pool.connect();
    
    // Get stored behavioral analysis
    const behaviorResult = await client.query(`
      SELECT * FROM wallet_behavior WHERE wallet_address = $1
    `, [centedWallet]);
    
    const scoresResult = await client.query(`
      SELECT * FROM wallet_scores WHERE wallet_address = $1
    `, [centedWallet]);
    
    if (behaviorResult.rows.length === 0) {
      console.log('No behavioral data found - running fresh analysis first');
      client.release();
      return;
    }
    
    const behavior = behaviorResult.rows[0];
    const scores = scoresResult.rows[0];
    
    console.log('\nSTORED ANALYSIS RESULTS:');
    console.log('========================');
    console.log(`Archetype: ${behavior.archetype}`);
    console.log(`Confidence: ${behavior.confidence}`);
    console.log(`Risk Score: ${behavior.risk_score}`);
    console.log(`FOMO Score: ${behavior.fomo_score}`);
    console.log(`Patience Score: ${behavior.patience_score}`);
    console.log(`Conviction Score: ${behavior.conviction_score}`);
    console.log(`Whisperer Score: ${scores.whisperer_score}`);
    console.log(`Portfolio Value: $${scores.portfolio_value}`);
    console.log(`Total Transactions: ${scores.total_transactions}`);
    
    console.log('\nIDENTIFIED CALCULATION ISSUES:');
    console.log('==============================');
    
    // Issue 1: Conviction vs Diversification Contradiction
    if (behavior.conviction_score > 70 && scores.total_transactions > 50) {
      console.log('RED FLAG 1: High conviction (73) but 96 transactions suggests frequent trading');
      console.log('  Problem: Conviction algorithm may not account for transaction frequency');
      console.log('  Fix needed: Factor trading frequency into conviction calculation');
    }
    
    // Issue 2: Stress vs Premium Strategy Contradiction  
    if (scores.whisperer_score === 100 && behavior.risk_score > 50) {
      console.log('RED FLAG 2: Perfect whisperer score (100) but high stress detected');
      console.log('  Problem: Premium fee strategy should correlate with lower stress');
      console.log('  Fix needed: Reconcile fee strategy with stress calculation');
    }
    
    // Issue 3: FOMO Dominant but Low Degen Score
    if (behavior.fomo_score > 40 && scores.degen_score < 20) {
      console.log('RED FLAG 3: FOMO Dominant state but very low degen score (9)');
      console.log('  Problem: FOMO and degen behaviors should be correlated');
      console.log('  Fix needed: Align FOMO detection with degen scoring');
    }
    
    // Issue 4: Over-diversification vs Premium Strategy
    console.log('RED FLAG 4: "Over-Diversified" (25 tokens) conflicts with "Premium Strategy"');
    console.log('  Problem: Whales typically focus on fewer, larger positions');
    console.log('  Fix needed: Weight diversification by position size, not token count');
    
    console.log('\nRECOMMENDED FIXES:');
    console.log('==================');
    console.log('1. Conviction Score: Include transaction frequency penalty');
    console.log('2. Stress Calculation: Consider fee premium as stress reduction factor');
    console.log('3. FOMO/Degen Alignment: Use consistent behavioral indicators');
    console.log('4. Diversification Logic: Weight by USD value, not token count');
    console.log('5. Position Sizing: Normalize by token type and market cap');
    
    client.release();
    
  } catch (error) {
    console.error('Audit failed:', error.message);
  }
}

auditCalculationLogic();
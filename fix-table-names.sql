-- Fix table name inconsistencies between schema and pipeline code

-- The main schema created 'trading_narratives' but the pipeline expects 'wallet_narratives'
-- Let's rename it to match the pipeline code

ALTER TABLE trading_narratives RENAME TO wallet_narratives;

-- Update the view to use the correct table name
DROP VIEW IF EXISTS complete_wallet_profile;

CREATE VIEW complete_wallet_profile AS
SELECT 
    ws.wallet_address,
    ws.whisperer_score,
    ws.degen_score,
    ws.portfolio_value,
    wb.archetype,
    wb.risk_score,
    wn.dominant_narrative,
    tp.avg_hold_time,
    COUNT(wh.mint_address) as current_holdings_count,
    SUM(wh.balance_usd) as total_holdings_value,
    COUNT(wl.label) as manual_labels_count,
    COUNT(wbt.tag_name) as behavior_tags_count,
    COUNT(wc.connected_address) as connections_count
FROM wallet_scores ws
LEFT JOIN wallet_behavior wb ON ws.wallet_address = wb.wallet_address
LEFT JOIN wallet_narratives wn ON ws.wallet_address = wn.wallet_address
LEFT JOIN trading_patterns tp ON ws.wallet_address = tp.wallet_address
LEFT JOIN wallet_holdings wh ON ws.wallet_address = wh.wallet_address
LEFT JOIN wallet_labels wl ON ws.wallet_address = wl.wallet_address AND wl.is_active = TRUE
LEFT JOIN wallet_behavior_tags wbt ON ws.wallet_address = wbt.wallet_address
LEFT JOIN wallet_connections wc ON ws.wallet_address = wc.wallet_address AND wc.is_active = TRUE
GROUP BY ws.wallet_address, ws.whisperer_score, ws.degen_score, ws.portfolio_value, 
         wb.archetype, wb.risk_score, wn.dominant_narrative, tp.avg_hold_time;
import { Router } from 'express';
import supabaseAdmin from '../lib/supabase-admin';
import { isAdminClientConfigured } from '../lib/supabase-admin';

const router = Router();

/**
 * Health check endpoint
 * GET /api/health
 * Returns status of various system components
 */
router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    components: {
      server: {
        status: 'healthy',
      },
      supabase: {
        status: 'checking',
        reachable: false,
        walletTableSchema: false,
        serviceKeyPermissions: false,
      }
    }
  };

  // Check Supabase connection
  try {
    if (!isAdminClientConfigured()) {
      health.components.supabase.status = 'misconfigured';
      throw new Error('Supabase client not configured');
    }

    // Test basic connection
    const { data: walletProfiles, error: connectionError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('count')
      .limit(1);

    if (connectionError) {
      health.components.supabase.status = 'error';
      throw connectionError;
    }

    health.components.supabase.reachable = true;

    // Test wallet table schema
    const { data: schemaData, error: schemaError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('id, wallet_address, blockchain_type')
      .limit(1);

    if (schemaError) {
      health.components.supabase.status = 'schema_error';
      throw schemaError;
    }

    health.components.supabase.walletTableSchema = true;

    // Test service key permissions by attempting to write
    const testWalletAddress = '0x0000000000000000000000000000000000000000';
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('wallet_profiles')
      .upsert({
        wallet_address: testWalletAddress,
        blockchain_type: 'evm',
        display_name: 'Health Check',
      })
      .select()
      .single();

    if (insertError && !insertError.message.includes('duplicate')) {
      health.components.supabase.status = 'permission_error';
      throw insertError;
    }

    // Clean up test data
    await supabaseAdmin
      .from('wallet_profiles')
      .delete()
      .eq('wallet_address', testWalletAddress);

    health.components.supabase.serviceKeyPermissions = true;
    health.components.supabase.status = 'healthy';

  } catch (error) {
    console.error('Health check failed for Supabase:', error);
    // Status is already set in the specific error cases
    if (health.components.supabase.status === 'checking') {
      health.components.supabase.status = 'error';
    }
    health.status = 'degraded';
  }

  // Return appropriate status code based on health
  const statusCode = health.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(health);
});

export default router;

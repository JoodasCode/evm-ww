import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Web3WalletConnect from '@/components/Web3WalletConnect';
import { useAccount } from 'wagmi';
import { useWagmiAuth } from '@/hooks/useWagmiAuth';
import { supabase } from '@/lib/supabase';

const AuthDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'account'>('signin');
  const { address, isConnected } = useAccount();
  const { walletProfile, isPremium, upgradeToPremium } = useWagmiAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<Array<{type: string, timestamp: string}>>([]);

  // Fetch recent activities when wallet profile is available
  useEffect(() => {
    const fetchActivities = async () => {
      if (isConnected && address && walletProfile?.user_id) {
        try {
          setIsLoading(true);
          
          // Get recent activities
          const { data: recentActivities, error: activitiesError } = await supabase
            .from('user_activity')
            .select('activity_type, timestamp')
            .eq('user_id', walletProfile.user_id)
            .order('timestamp', { ascending: false })
            .limit(5);
            
          if (activitiesError) {
            console.error('Error fetching activities:', activitiesError);
          } else if (recentActivities) {
            setActivities(recentActivities.map(act => ({
              type: act.activity_type,
              timestamp: new Date(act.timestamp).toLocaleString()
            })));
          }
        } catch (err) {
          console.error('Error fetching activities:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchActivities();
  }, [isConnected, address, walletProfile]);

  // Handle premium upgrade using useWagmiAuth hook
  const handlePremiumUpgrade = async () => {
    try {
      setIsLoading(true);
      await upgradeToPremium();
      
      // Add to activities
      setActivities(prev => [
        { type: 'premium_upgrade', timestamp: new Date().toLocaleString() },
        ...prev
      ]);
    } catch (err) {
      console.error('Error upgrading to premium:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Demo</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'signin' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('account')}
            disabled={!isConnected}
          >
            Account
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'signin' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Connect your wallet</h2>
                <p className="text-gray-600 mb-4">
                  Connect your wallet to access premium features and manage your account.
                </p>
                
                <Web3WalletConnect className="w-full" />
              </div>
            </div>
          )}
          
          {activeTab === 'account' && (
            <div className="space-y-6">
              {isConnected ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-2">Account Details</h2>
                    <p className="text-gray-600 mb-4">
                      Manage your account and subscription.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Wallet Address</p>
                          <p className="text-sm text-gray-600">
                            {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Connected
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Subscription Status</p>
                          <p className="text-sm text-gray-600">
                            {isPremium ? 'Premium' : 'Free Tier'}
                          </p>
                        </div>
                        {!isPremium && (
                          <button
                            onClick={handlePremiumUpgrade}
                            className="bg-purple-500 text-white py-1 px-3 rounded text-sm hover:bg-purple-600"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Processing...' : 'Upgrade to Premium'}
                          </button>
                        )}
                        {isPremium && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-2">Activity</h2>
                    <p className="text-gray-600 mb-4">
                      Recent account activity.
                    </p>
                    
                    <div className="space-y-2">
                      {activities.length > 0 ? (
                        activities.map((activity, index) => (
                          <div key={index} className="text-sm p-2 bg-gray-100 rounded">
                            <p className="font-medium">{activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                            <p className="text-xs text-gray-600">{activity.timestamp}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No recent activity</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Please connect your wallet to view account details.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('signin');
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Link href="/">
          <a className="text-blue-500 hover:underline">← Back to Home</a>
        </Link>
      </div>
    </div>
  );
};

export default AuthDemo;

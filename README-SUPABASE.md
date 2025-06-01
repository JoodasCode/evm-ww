# Wallet Whisperer Supabase Setup Guide

This guide will walk you through setting up Supabase for Wallet Whisperer, including authentication and database tables.

## Prerequisites

1. A Supabase account (free tier is sufficient for development)
2. Access to the Supabase dashboard

## Step 1: Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Enter project details:
   - Name: `wallet-whisperer` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
4. Click "Create new project"

## Step 2: Configure Authentication

1. In your Supabase dashboard, navigate to "Authentication" → "Providers"
2. Enable the following providers:
   - Email (enabled by default)
   - Google (OAuth)

### Setting up Google OAuth

1. Navigate to "Authentication" → "Providers" → "Google"
2. Toggle "Enable Google OAuth"
3. You'll need to create OAuth credentials in the Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use an existing one
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Set Application Type to "Web application"
   - Add the following Authorized redirect URIs:
     - `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
4. Copy the Client ID and Client Secret back to Supabase
5. Click "Save"

## Step 3: Set Up Database Tables

1. In your Supabase dashboard, navigate to "SQL Editor"
2. Create a new query
3. Copy and paste the contents of the `setup-supabase-auth-tables.sql` file
4. Run the query

This will create the following tables:
- `user_profiles`: Extended user information
- `wallet_profiles`: Linked wallet addresses
- `user_activity`: Activity logging

## Step 4: Configure Environment Variables

### For Local Development

Create or update your `.env.local` file with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

You can find these values in your Supabase dashboard under "Settings" → "API".

### For Production

Add the same environment variables to your production environment.

## Step 5: Test the Connection

1. Start your development server
2. Try signing in with Google
3. Check the Supabase dashboard to verify that a new user was created

## Using the Mock Client for Development

Wallet Whisperer includes a mock Supabase client for development without credentials:

- If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set, the mock client will be used automatically
- The mock client simulates authentication and database operations
- Check the console for "[Mock Supabase]" logs to confirm it's being used

## Database Schema Details

### User Profiles

Extends the built-in Supabase Auth users table with additional fields:

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  credits_remaining INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Wallet Profiles

Stores linked wallet addresses:

```sql
CREATE TABLE IF NOT EXISTS wallet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  blockchain_type TEXT DEFAULT 'evm',
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT TRUE,
  verification_signature TEXT,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, blockchain_type)
);
```

### User Activity

Logs user activities for analytics:

```sql
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  wallet_address TEXT,
  activity_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT
);
```

## Row Level Security (RLS)

The SQL setup includes Row Level Security policies to ensure users can only access their own data:

- Users can only view and update their own profiles
- Users can only view, insert, update, and delete their own wallet profiles
- Users can only view their own activity logs
- Anyone can insert activity logs (for anonymous tracking)

## Automatic User Profile Creation

A trigger function automatically creates a user profile when a new user signs up through Supabase Auth.

## Next Steps

After setting up Supabase, you can:

1. Test the authentication flow with Google OAuth
2. Test wallet linking with signature verification
3. Verify activity logging is working properly
4. Explore the Supabase dashboard to view your data

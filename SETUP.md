# Supabase Setup Guide

## Quick Setup

1. **Get your Supabase credentials:**
   - Visit [https://app.supabase.com](https://app.supabase.com)
   - Sign in or create an account
   - Create a new project (or select an existing one)
   - Wait for the project to finish initializing

2. **Find your API credentials:**
   - In your Supabase project dashboard, go to **Settings** → **API**
   - You'll see:
     - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
     - **anon public** key (a long JWT token starting with `eyJ...`)

3. **Add credentials to `.env.local`:**
   - Open `.env.local` in the root of this project
   - Replace the empty values:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - **Important:** Use your actual values from step 2

4. **Restart your development server:**
   - Stop the current server (press `Ctrl+C` in the terminal)
   - Run `npm run dev` again
   - The app should now connect to Supabase

## Database Setup

After configuring the environment variables, you'll need to run the database migrations:

1. **Using Supabase Dashboard (Recommended):**
   - Go to your Supabase project
   - Navigate to **SQL Editor**
   - Copy the contents of `supabase/migrations/00001_initial_schema.sql`
   - Paste and run it in the SQL Editor

2. **Using Supabase CLI (Alternative):**
   ```bash
   # Install Supabase CLI if you haven't
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

## Verification

Once set up, you should be able to:
- Visit `http://localhost:3000` and see the home page
- Navigate to `/dashboard` and see the dashboard (may show 0s if no data yet)
- Access `/dashboard/properties` and add properties

## Troubleshooting

**Error: "Missing Supabase env"**
- Make sure `.env.local` exists in the project root
- Verify the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check that there are no extra spaces or quotes around the values
- Restart your dev server after making changes

**Error: "Invalid API key"**
- Double-check you copied the **anon public** key (not the service_role key)
- Make sure the URL doesn't have a trailing slash
- Verify the project is active in Supabase dashboard

**Database errors**
- Make sure you've run the migration SQL script
- Check that Row Level Security (RLS) policies are enabled
- Verify your user has the correct permissions

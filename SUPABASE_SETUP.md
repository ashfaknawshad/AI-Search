# Supabase Setup Guide for AI Search Visualizer

## 📋 Prerequisites
- ✅ Supabase project created (`ai-search`)
- Supabase account at [supabase.com](https://supabase.com)

---

## 🚀 Step-by-Step Setup

### Step 1: Run the Database Schema

1. **Open Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your `ai-search` project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar (📝 icon)
   - Click "+ New query"

3. **Run the Schema**
   - Copy the entire contents of `supabase-schema.sql`
   - Paste it into the SQL editor
   - Click "Run" button (or press Ctrl/Cmd + Enter)
   - Wait for "Success. No rows returned" message

4. **Verify Tables Created**
   - Click "Table Editor" in left sidebar
   - You should see these tables:
     - ✅ `profiles`
     - ✅ `graphs`
     - ✅ `shared_links`
     - ✅ `graph_likes`
     - ✅ `graph_comments`

---

### Step 2: Configure Authentication

1. **Enable Email Provider**
   - Go to "Authentication" → "Providers"
   - Find "Email" provider
   - Toggle it ON if not already enabled
   - Configure settings:
     - ✅ Enable email confirmations (recommended)
     - ✅ Secure email change
     - Set "Site URL" to your Vercel URL (will add later)

2. **Enable OAuth Providers (Optional but Recommended)**
   
   **For Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret
   - Back in Supabase: Authentication → Providers → Google
   - Paste Client ID and Secret
   - Toggle ON

   **For GitHub OAuth:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in:
     - Application name: "AI Search Visualizer"
     - Homepage URL: Your Vercel URL
     - Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Generate Client Secret
   - Copy Client ID and Secret
   - Back in Supabase: Authentication → Providers → GitHub
   - Paste Client ID and Secret
   - Toggle ON

3. **Configure Email Templates**
   - Go to Authentication → Email Templates
   - Customize templates:
     - Confirm signup
     - Magic Link
     - Change Email Address
     - Reset Password
   - Add your app branding/logo

---

### Step 3: Get Your API Credentials

1. **Get Project URL and Keys**
   - Go to "Project Settings" → "API"
   - Copy these values (you'll need them):

   ```
   Project URL: https://<your-project-ref>.supabase.co
   anon/public key: eyJhbGc...
   service_role key: eyJhbGc... (keep this SECRET!)
   ```

2. **Create Environment File**
   - Create a `.env.local` file in your Next.js project root:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
   
   # App URLs (update after Vercel deployment)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_GITHUB_PAGES_URL=https://ashfaknawshad.github.io/AI-Search
   
   # Future: AI APIs
   # OPENAI_API_KEY=sk-...
   # ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **⚠️ Important Security Notes**
   - ✅ Add `.env.local` to `.gitignore` (never commit secrets!)
   - ✅ The `anon` key is safe to use in client-side code
   - ❌ NEVER expose the `service_role` key in client-side code
   - ✅ Use environment variables in Vercel dashboard for production

---

### Step 4: Configure Storage

1. **Verify Storage Buckets**
   - Go to "Storage" in left sidebar
   - You should see two buckets:
     - ✅ `graph-thumbnails` (public)
     - ✅ `avatars` (public)

2. **Test Storage Access**
   - Click on `avatars` bucket
   - Try uploading a test image
   - Verify you can view it via the public URL

---

### Step 5: Test Database Connection

You can test your database with a simple query in SQL Editor:

```sql
-- Create a test profile (replace with a real user ID after signup)
SELECT * FROM profiles;

-- Check if RLS policies are working
SELECT * FROM graphs WHERE is_public = true;
```

---

## 📊 What Was Created?

### Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User profile info | Username, avatar, bio |
| `graphs` | Saved search graphs | Title, data, public/private |
| `shared_links` | Shareable graph URLs | Short codes, expiration |
| `graph_likes` | User likes on graphs | Future social features |
| `graph_comments` | Comments on graphs | Future collaboration |

### Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **Users can only edit their own data**
✅ **Public graphs visible to everyone**
✅ **Private graphs only visible to owner**
✅ **Shared links work without authentication**

### Automatic Features

🤖 **Auto-create profile** when user signs up
🤖 **Auto-update timestamps** on edits
🤖 **View counters** for graphs and shared links
🤖 **Cascade deletes** (delete user → delete all their graphs)

---

## 🧪 Testing the Setup

### Test 1: Create a Test User

1. Go to Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Check "Auto Confirm User" (for testing)
5. Click "Create user"

### Test 2: Verify Profile Created

```sql
SELECT * FROM profiles;
```

You should see the new user's profile!

### Test 3: Create a Test Graph

```sql
INSERT INTO graphs (user_id, title, graph_data, is_public)
VALUES (
  '<user-id-from-step-1>',
  'Test Graph',
  '{"nodes": {}, "metadata": {}}',
  true
);

SELECT * FROM graphs;
```

### Test 4: Test RLS Policies

```sql
-- This should work (viewing public graphs)
SET request.jwt.claim.sub = '<different-user-id>';
SELECT * FROM graphs WHERE is_public = true;

-- This should fail (viewing someone else's private graphs)
SET request.jwt.claim.sub = '<different-user-id>';
SELECT * FROM graphs WHERE user_id = '<original-user-id>' AND is_public = false;
```

---

## 🔧 Troubleshooting

### Issue: "permission denied for table X"
**Solution:** Make sure you ran all RLS policies in the schema file

### Issue: "relation X does not exist"
**Solution:** Run the schema file again, ensure no errors

### Issue: Profile not auto-created on signup
**Solution:** Check that the trigger was created:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: Storage upload fails
**Solution:** Check storage policies were created:
```sql
SELECT * FROM storage.policies;
```

---

## 📚 Useful Supabase Docs

- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

---

## ✅ Checklist

Before moving to Next.js app development:

- [ ] Schema SQL ran successfully
- [ ] All 5 tables visible in Table Editor
- [ ] Email authentication enabled
- [ ] API credentials copied to `.env.local`
- [ ] Storage buckets created (avatars, graph-thumbnails)
- [ ] Test user created and profile auto-generated
- [ ] RLS policies verified working

---

## 🎯 Next Steps

Once Supabase is fully configured:

1. ✅ **Update `index.html`** with your actual Supabase config (if needed)
2. ⏭️ **Create Next.js app** with Supabase client
3. ⏭️ **Build authentication flows** (login, signup, logout)
4. ⏭️ **Create dashboard** to view saved graphs
5. ⏭️ **Implement save/load** functionality
6. ⏭️ **Deploy to Vercel** and test live

Ready to proceed? 🚀

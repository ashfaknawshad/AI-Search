# Deployment Guide - AI Search Visualizer

Complete step-by-step guide to deploy your AI Search Visualizer to Vercel with Supabase.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- [x] Settings page completed
- [x] All features tested locally
- [x] Supabase project set up
- [x] GitHub repository ready
- [x] Environment variables documented
- [ ] Vercel account created

## 🗄️ Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New project"
3. Fill in:
   - **Name**: `ai-search-visualizer` (or your choice)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be ready (~2 minutes)

### 1.2 Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Paste the following SQL:

```sql
-- Create graphs table
create table graphs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  thumbnail_url text,
  graph_data jsonb not null,
  is_public boolean default false,
  view_count integer default 0,
  share_code text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table graphs enable row level security;

-- Policies for secure access
create policy "Users can view their own graphs"
  on graphs for select
  using (auth.uid() = user_id);

create policy "Users can view public graphs"
  on graphs for select
  using (is_public = true);

create policy "Users can insert their own graphs"
  on graphs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own graphs"
  on graphs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own graphs"
  on graphs for delete
  using (auth.uid() = user_id);

-- Indexes for better query performance
create index graphs_user_id_idx on graphs(user_id);
create index graphs_share_code_idx on graphs(share_code);
create index graphs_is_public_idx on graphs(is_public);
create index graphs_created_at_idx on graphs(created_at desc);
```

4. Click **"Run"** or press `Ctrl+Enter`
5. Verify: You should see "Success. No rows returned"

### 1.3 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be on by default)
3. Go to **Authentication** → **URL Configuration**
4. You'll add your Vercel URL here after deployment (Step 3.5)

### 1.4 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL**: `https://[your-project].supabase.co`
   - **anon public key**: `eyJhbG...` (long string)
3. Save these somewhere safe!

---

## 🐙 Step 2: GitHub Setup

### 2.1 Push to GitHub

If you haven't already:

```bash
cd C:\Users\SNC\AI-Search

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - AI Search Visualizer"

# Create GitHub repo and push
git remote add origin https://github.com/ashfaknawshad/AI-Search.git
git branch -M main
git push -u origin main
```

### 2.2 Verify Repository

1. Go to your GitHub repository
2. Ensure all files are present, especially:
   - `nextjs-app/` directory
   - `package.json`
   - `next.config.ts`
   - All source files

---

## 🚀 Step 3: Vercel Deployment

### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Find your `AI-Search` repository
3. Click **"Import"**

### 3.3 Configure Project Settings

**Root Directory:**
- Click "Edit" next to Root Directory
- Enter: `nextjs-app`
- This is crucial! The Next.js app is in the subdirectory

**Framework Preset:**
- Should auto-detect as "Next.js"
- Leave as default

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

### 3.4 Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Important:** Make sure variable names are exact, including `NEXT_PUBLIC_` prefix!

### 3.5 Deploy!

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. You'll see:
   - ✅ Building
   - ✅ Deploying
   - 🎉 Success!

### 3.6 Get Your Deployment URL

After successful deployment:
1. Copy your deployment URL (e.g., `your-app.vercel.app`)
2. Test it: Click "Visit" to open your live site

---

## 🔧 Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Auth URLs

1. Go back to **Supabase Dashboard**
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add these:
     ```
     https://your-app.vercel.app/auth/callback
     https://your-app.vercel.app/dashboard
     ```

### 4.2 Test Authentication

1. Go to your Vercel URL
2. Click "Sign Up"
3. Create a test account
4. Verify:
   - ✅ Email confirmation works
   - ✅ Login redirects to dashboard
   - ✅ Logout works

### 4.3 Test Core Functionality

Go through each feature:

**Dashboard:**
- ✅ Dashboard loads
- ✅ "New Graph" button works

**Create Graph:**
- ✅ Visualizer loads in iframe
- ✅ Can add nodes and connections
- ✅ Can save graph
- ✅ Thumbnail generated
- ✅ Redirects to dashboard after save

**My Graphs:**
- ✅ Saved graph appears with thumbnail
- ✅ "Edit" opens graph correctly
- ✅ "View" shows read-only version
- ✅ "Delete" removes graph

**Explore:**
- ✅ Public graphs appear (if any)
- ✅ Search works
- ✅ Can view public graphs

**Share:**
- ✅ Can generate share link
- ✅ Share link works in incognito/private mode
- ✅ Shared graphs are read-only

**Settings:**
- ✅ Can update profile name
- ✅ Account info displays correctly

---

## 🔄 Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. In Vercel, go to **Settings** → **Domains**
2. Click "Add"
3. Enter your domain (e.g., `ai-search.yourdomain.com`)
4. Follow DNS configuration instructions

### 5.2 Update Supabase URLs

After domain is verified:
1. Update Supabase Auth configuration
2. Add custom domain to redirect URLs
3. Test authentication with custom domain

---

## 🐛 Troubleshooting Deployment Issues

### Build Fails

**Error: "Cannot find module"**
- Check `package.json` has all dependencies
- Run `npm install` locally to verify

**Error: "Root directory not found"**
- Verify Root Directory is set to `nextjs-app` in Vercel

### Authentication Not Working

**Error: "Invalid redirect URL"**
- Add Vercel URL to Supabase redirect URLs
- Check SUPABASE_URL environment variable
- Verify anon key is correct

### Database Errors

**Error: "relation 'graphs' does not exist"**
- Run database setup SQL in Supabase
- Check RLS is enabled
- Verify policies exist

### Visualizer Not Loading

**Blank iframe:**
- Check `public/` directory files deployed
- Verify `visualizer.html` path
- Check browser console for errors

### Thumbnails Not Showing

**Placeholder appears instead of image:**
- Old graphs won't have thumbnails
- Re-save graph to generate thumbnail
- Check thumbnail_url column in database

---

## 📊 Step 6: Monitoring & Analytics

### 6.1 Vercel Analytics

1. Go to **Analytics** tab in Vercel
2. View:
   - Page views
   - Unique visitors
   - Geographic distribution
   - Performance metrics

### 6.2 Supabase Monitoring

1. Go to **Database** → **Logs**
2. Monitor:
   - Query performance
   - Error logs
   - API usage

---

## 🎯 Success Criteria

Your deployment is successful if:

- ✅ Website loads at Vercel URL
- ✅ Sign up creates new users
- ✅ Login works correctly
- ✅ Can create and save graphs
- ✅ Thumbnails generate and display
- ✅ Can edit saved graphs
- ✅ Can delete graphs
- ✅ Explore page shows public graphs
- ✅ Share links work
- ✅ Settings page functions
- ✅ No console errors
- ✅ Mobile responsive

---

## 🔐 Security Checklist

Before going public:

- ✅ Row Level Security enabled on all tables
- ✅ Environment variables secure (not in git)
- ✅ API keys are read-only where possible
- ✅ Supabase Auth redirect URLs configured
- ✅ HTTPS enforced (Vercel does this automatically)
- ✅ No sensitive data in console logs

---

## 📈 Post-Launch Tasks

### Immediate (Within 24 hours)
1. Monitor error logs
2. Test all features in production
3. Fix any critical bugs
4. Share with friends for feedback

### Short-term (Within 1 week)
1. Add Google Analytics (optional)
2. Set up error tracking (Sentry, etc.)
3. Monitor database usage
4. Gather user feedback

### Long-term
1. Plan new features based on usage
2. Optimize performance
3. Consider adding more algorithms
4. Build community features

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Logs:**
   - Vercel: Deployment → Functions → Logs
   - Supabase: Database → Logs

2. **Common Resources:**
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)

3. **Community Support:**
   - Vercel Discord
   - Supabase Discord
   - Stack Overflow

---

## 🎉 Congratulations!

Your AI Search Visualizer is now live! 🚀

**Next Steps:**
1. Share your deployment URL
2. Gather user feedback
3. Iterate and improve
4. Build more features!

**Your Live URLs:**
- **App**: `https://your-app.vercel.app`
- **Dashboard**: `https://your-app.vercel.app/dashboard`
- **Explore**: `https://your-app.vercel.app/dashboard/explore`

Happy visualizing! 🎨📊

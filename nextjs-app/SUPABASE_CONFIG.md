# Supabase Client Configuration

This document explains the Supabase setup for the AI Search Visualizer app.

## 📁 Files Created

### Client Configuration
- **`lib/supabase/client.ts`** - Browser-side Supabase client
- **`lib/supabase/server.ts`** - Server-side Supabase client
- **`middleware.ts`** - Auth session refresh middleware

### Types & Utilities
- **`lib/types/database.ts`** - TypeScript types for database tables
- **`lib/utils/helpers.ts`** - Utility functions (share codes, formatting, etc.)

### React Hooks
- **`lib/hooks/useUser.ts`** - Get current authenticated user
- **`lib/hooks/useGraphs.ts`** - Fetch user's graphs and public graphs

### Environment
- **`.env.local`** - Environment variables (NOT committed to git)
- **`.env.local.example`** - Template for environment variables

---

## 🔧 Setup Instructions

### Step 1: Get Supabase Credentials

1. Go to https://app.supabase.com
2. Select your `ai-search` project
3. Navigate to **Project Settings** → **API**
4. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJhbGc...`)
   - **service_role key** (starts with `eyJhbGc...`) - ⚠️ Keep this secret!

### Step 2: Configure Environment Variables

1. Open `.env.local` in this folder
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-actual-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-actual-service-role-key...
```

3. Save the file

### Step 3: Restart Development Server

If your server is running, restart it to load the new environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 📚 How to Use

### Client Components (Browser)

Use `createClient()` from `lib/supabase/client.ts`:

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  
  // Use the client
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password'
    })
  }
  
  return <button onClick={handleLogin}>Login</button>
}
```

### Server Components

Use `createClient()` from `lib/supabase/server.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function MyServerComponent() {
  const supabase = await createClient()
  
  // Fetch data server-side
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>Welcome {user?.email}</div>
}
```

### Using Hooks

#### Get Current User

```typescript
'use client'

import { useUser } from '@/lib/hooks/useUser'

export default function Profile() {
  const { user, loading } = useUser()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  
  return <div>Welcome {user.email}</div>
}
```

#### Get User's Graphs

```typescript
'use client'

import { useGraphs } from '@/lib/hooks/useGraphs'
import { useUser } from '@/lib/hooks/useUser'

export default function MyGraphs() {
  const { user } = useUser()
  const { graphs, loading, error } = useGraphs(user?.id)
  
  if (loading) return <div>Loading graphs...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {graphs.map(graph => (
        <div key={graph.id}>{graph.title}</div>
      ))}
    </div>
  )
}
```

---

## 🔒 Security Notes

### Environment Variables

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Safe to expose (public)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Safe to expose (has RLS protection)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - **NEVER expose in client code!**

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only read/write their own data
- Public graphs are viewable by everyone
- Shared links work without authentication

### Middleware

The middleware automatically:
- Refreshes expired auth sessions
- Updates cookies for authenticated users
- Runs on every request (except static files)

---

## 🎯 Next Steps

Now that Supabase is configured, you can:

1. ✅ Create authentication pages (login/signup)
2. ✅ Build the user dashboard
3. ✅ Implement save/load graph functionality
4. ✅ Add sharing features

---

## 🐛 Troubleshooting

### Error: "Invalid Supabase URL"
- Check that your URL in `.env.local` is correct
- Restart the dev server after changing `.env.local`

### Error: "Invalid API key"
- Verify you copied the full `anon` key
- Check for extra spaces or newlines

### TypeScript errors
- Run `npm run build` to check for type errors
- Make sure all imports are correct

### Auth not working
- Check middleware is running (should see it in terminal logs)
- Verify RLS policies are set up in Supabase

---

## 📖 Documentation

- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

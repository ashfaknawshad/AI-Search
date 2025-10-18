# AI Search Visualizer - Full Application Plan

## 🎯 Project Overview

Transform the current static GitHub Pages visualizer into a full-fledged collaborative platform similar to Tinkercad, with user accounts, cloud storage, sharing capabilities, and future AI integration.

## 🏗️ Architecture

### Current Setup (GitHub Pages)
- **URL**: `https://yourusername.github.io/AI-Search/`
- **Purpose**: Free, public visualizer for quick use
- **Features**: All visualization features, no account needed
- **New Addition**: Bottom banner linking to full app

### Full Application (Vercel)
- **URL**: `https://ai-search-app.vercel.app` (or custom domain)
- **Purpose**: Complete platform with user accounts
- **Tech Stack**:
  - **Frontend**: Next.js 14+ (App Router)
  - **Styling**: Tailwind CSS + shadcn/ui components
  - **Backend**: Next.js API Routes + Supabase
  - **Database**: Supabase (PostgreSQL)
  - **Auth**: Supabase Auth
  - **Deployment**: Vercel
  - **Future**: OpenAI API / Anthropic API for AI features

---

## 📊 Database Schema (Supabase)

### Tables

#### 1. `users` (handled by Supabase Auth)
```sql
-- Automatically created by Supabase Auth
id (uuid, primary key)
email (text)
created_at (timestamp)
```

#### 2. `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `graphs`
```sql
CREATE TABLE graphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Graph',
  description TEXT,
  thumbnail_url TEXT,
  graph_data JSONB NOT NULL,  -- Full graph state
  algorithm_used TEXT,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_is_public (is_public),
  INDEX idx_created_at (created_at)
);
```

#### 4. `shared_links`
```sql
CREATE TABLE shared_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_id UUID REFERENCES graphs(id) ON DELETE CASCADE,
  short_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_short_code (short_code)
);
```

#### 5. `graph_likes` (for future)
```sql
CREATE TABLE graph_likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  graph_id UUID REFERENCES graphs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  PRIMARY KEY (user_id, graph_id)
);
```

#### 6. `graph_comments` (for future)
```sql
CREATE TABLE graph_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_id UUID REFERENCES graphs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_graph_id (graph_id)
);
```

---

## 🎨 Application Structure

```
ai-search-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # User's saved graphs
│   │   ├── explore/
│   │   │   └── page.tsx          # Public graphs
│   │   ├── settings/
│   │   │   └── page.tsx          # User settings
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── visualizer/
│   │   ├── page.tsx              # Main visualizer (embedded)
│   │   └── [id]/
│   │       └── page.tsx          # Load specific graph
│   ├── share/
│   │   └── [code]/
│   │       └── page.tsx          # Shared graph view
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...]/            # Auth routes
│   │   ├── graphs/
│   │   │   ├── route.ts          # CRUD operations
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── share/
│   │       └── route.ts          # Generate share links
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthProvider.tsx
│   ├── dashboard/
│   │   ├── GraphCard.tsx
│   │   ├── GraphGrid.tsx
│   │   ├── Sidebar.tsx
│   │   └── SearchBar.tsx
│   ├── visualizer/
│   │   ├── VisualizerCanvas.tsx  # Port your current visualizer
│   │   ├── Toolbar.tsx
│   │   ├── AlgorithmPanel.tsx
│   │   └── SaveDialog.tsx
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── shared/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGraphs.ts
│   │   └── useShare.ts
│   └── utils/
│       ├── graph-helpers.ts
│       └── share-code.ts
├── public/
│   └── (static assets)
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Features Breakdown

### Phase 1: Core Application (Week 1-2)
- [x] Add banner to GitHub Pages version
- [ ] Set up Next.js 14 with App Router
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Create landing page with features showcase
- [ ] Set up Supabase project
- [ ] Implement authentication (email/password)
- [ ] Create basic dashboard layout

### Phase 2: Graph Management (Week 2-3)
- [ ] Port visualizer to React/Next.js component
- [ ] Implement save graph functionality
- [ ] Create graph listing page (My Graphs)
- [ ] Add edit/delete operations
- [ ] Generate thumbnails for saved graphs
- [ ] Add search and filter functionality

### Phase 3: Sharing Features (Week 3-4)
- [ ] Implement share link generation
- [ ] Create public graph view page
- [ ] Add explore/discover page for public graphs
- [ ] Implement view counter
- [ ] Add copy-to-clipboard for share links
- [ ] Optional: Add embed code for graphs

### Phase 4: Enhanced Features (Week 4-5)
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Implement user profiles
- [ ] Add graph versioning/history
- [ ] Create graph templates
- [ ] Add export options (PNG, PDF, JSON)
- [ ] Implement collaborative features (comments, likes)

### Phase 5: AI Integration (Future)
- [ ] Algorithm recommendation based on graph structure
- [ ] Auto-generate optimal heuristics
- [ ] Natural language graph creation
- [ ] Performance optimization suggestions
- [ ] Graph complexity analysis
- [ ] Learning mode with explanations

---

## 🔐 Authentication Flow

```
1. User visits app → Check auth state
2. Not authenticated → Show landing page
3. Click "Login" → Redirect to /login
4. Enter credentials → Supabase Auth
5. Success → Redirect to /dashboard
6. Persist session → Supabase handles tokens
7. Protected routes → Middleware checks auth
```

---

## 💾 Graph Data Structure

```typescript
interface GraphData {
  version: string;
  metadata: {
    title: string;
    description: string;
    algorithm: string;
    createdAt: string;
    updatedAt: string;
  };
  nodes: {
    [key: string]: {
      id: number;
      position: [number, number];
      state: 'source' | 'goal' | 'empty' | 'visited' | 'path';
      heuristic: number;
      children: { [key: number]: number };  // childId: weight
    };
  };
  visualSettings: {
    zoom: number;
    panX: number;
    panY: number;
    colors: {
      source: string;
      goal: string;
      empty: string;
      visited: string;
      path: string;
    };
  };
}
```

---

## 🔗 Share Link System

### Short Code Generation
```typescript
// Generate 8-character alphanumeric code
function generateShareCode(): string {
  return nanoid(8); // e.g., "aB3xY9Zq"
}
```

### Share URL Structure
```
https://ai-search-app.vercel.app/share/aB3xY9Zq
```

### Embed Code
```html
<iframe 
  src="https://ai-search-app.vercel.app/share/aB3xY9Zq/embed"
  width="800" 
  height="600"
  frameborder="0"
></iframe>
```

---

## 🎯 Key User Flows

### 1. New User Journey
1. Visit GitHub Pages → Try visualizer
2. See banner → Click "Login to Full App"
3. Land on app homepage → Click "Sign Up"
4. Create account → Verify email
5. Tour dashboard → Create first graph
6. Save graph → Share with friends

### 2. Save Graph Flow
1. Create graph in visualizer
2. Click "Save" button → Login check
3. Show save dialog → Enter title/description
4. Click "Save" → Upload to Supabase
5. Generate thumbnail → Store metadata
6. Redirect to dashboard → Show success

### 3. Share Graph Flow
1. Open saved graph → Click "Share"
2. Choose visibility (public/private)
3. Generate share link → Copy to clipboard
4. Optional: Set expiration date
5. Share link with others → Track views
6. Recipients view without login

---

## 🌐 Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URLs
NEXT_PUBLIC_APP_URL=https://ai-search-app.vercel.app
NEXT_PUBLIC_GITHUB_PAGES_URL=https://yourusername.github.io/AI-Search

# Future: AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 📱 Responsive Design

- **Desktop**: Full features, dual-pane layout
- **Tablet**: Collapsible sidebar, optimized toolbar
- **Mobile**: Bottom navigation, simplified controls

---

## 🚀 Deployment Steps

### 1. Supabase Setup
```bash
# Create project on supabase.com
# Run SQL migrations
# Configure auth providers
# Set up Row Level Security (RLS)
```

### 2. Vercel Deployment
```bash
# Connect GitHub repo
# Add environment variables
# Deploy to production
# Configure custom domain (optional)
```

### 3. GitHub Pages Update
```bash
# Update banner URL to production
# Test static site with new banner
# Commit and push changes
```

---

## 🔒 Security Considerations

1. **RLS Policies**: Ensure users can only access their own graphs
2. **API Rate Limiting**: Prevent abuse
3. **Input Validation**: Sanitize all user inputs
4. **CORS Configuration**: Restrict to your domains
5. **Environment Secrets**: Never expose service keys

---

## 📈 Analytics & Monitoring (Future)

- Vercel Analytics for performance
- Supabase logs for database monitoring
- Error tracking with Sentry
- User behavior tracking
- Graph popularity metrics

---

## 💡 Future AI Features

1. **Smart Heuristics**: Auto-calculate optimal h(n) values
2. **Algorithm Suggestion**: "Best algorithm for your graph: A*"
3. **Natural Language**: "Create a graph with 5 nodes in a tree structure"
4. **Learning Mode**: Step-by-step explanations
5. **Optimization**: "Your graph can be simplified to..."
6. **Pattern Recognition**: "This graph resembles a..."

---

## 🎨 Branding

- **Name**: AI Search Visualizer (or rebrand)
- **Tagline**: "Visualize. Learn. Share."
- **Colors**: Purple gradient (current theme)
- **Logo**: Design needed

---

## ✅ Next Steps

1. ✅ Add banner to GitHub Pages
2. ⏭️ Create Next.js project (I can help scaffold this)
3. ⏭️ Set up Supabase project
4. ⏭️ Implement authentication
5. ⏭️ Port visualizer to React
6. ⏭️ Build dashboard
7. ⏭️ Deploy to Vercel

Would you like me to start creating the Next.js project structure?

# AI Search Visualizer 🔍

> **An interactive web platform for visualizing and understanding graph search algorithms through hands-on exploration**

A modern full-stack application that brings computer science algorithms to life. Create custom graphs, run pathfinding algorithms in real-time, and share your visualizations with the community. Perfect for students learning AI search algorithms, educators creating demonstrations, or anyone curious about how algorithms explore problem spaces.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## 🌟 Features

### Core Functionality
- **Interactive Graph Editor** - Drag-and-drop interface to create nodes, edges, and weighted graphs
- **6 Search Algorithms** - Visualize BFS, DFS, Dijkstra, A*, Greedy Best-First Search, and UCS with step-by-step execution
- **Real-time Animation** - Watch algorithms explore the graph with visual feedback on visited nodes and optimal paths
- **Cloud Persistence** - Save unlimited graphs to the cloud with Supabase PostgreSQL
- **Share & Collaborate** - Generate unique shareable links with view tracking
- **Public Gallery** - Discover and learn from community-created graph demonstrations

### User Experience
- **OAuth Authentication** - Seamless Google sign-in with Supabase Auth
- **Personal Dashboard** - Grid view of all your graphs with thumbnails and metadata
- **Smart Search** - Debounced search across public graphs
- **Read-only Mode** - View shared graphs with toolbar hidden for clean presentation
- **Unsaved Changes Protection** - Never lose work with browser navigation warnings
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices

### Technical Highlights
- **Canvas-based Rendering** - Hardware-accelerated visualization using HTML5 Canvas
- **Python in Browser** - Run authentic Python algorithm code client-side via Brython
- **Server-side Rendering** - Fast initial loads and SEO-friendly with Next.js 15 App Router
- **Type-safe** - End-to-end TypeScript for reliability and maintainability
- **Row Level Security** - Granular database permissions with Supabase RLS policies
- **Modern Styling** - Tailwind CSS 4 with clean, minimalistic design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashfaknawshad/AI-Search.git
   cd AI-Search/nextjs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `nextjs-app` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run this SQL in your Supabase SQL Editor:
   ```sql
   -- ============================================
   -- TABLES
   -- ============================================
   
   -- Graphs table: stores user-created graph visualizations
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

   -- ============================================
   -- ROW LEVEL SECURITY (RLS)
   -- ============================================
   
   alter table graphs enable row level security;

   -- Allow users to view their own graphs
   create policy "Users can view their own graphs"
     on graphs for select
     using (auth.uid() = user_id);

   -- Allow anyone to view public graphs
   create policy "Users can view public graphs"
     on graphs for select
     using (is_public = true);

   -- Allow anyone to view graphs with share codes (for sharing)
   create policy "Anyone can view graphs with share codes"
     on graphs for select
     using (share_code is not null);

   -- Allow users to create their own graphs
   create policy "Users can insert their own graphs"
     on graphs for insert
     with check (auth.uid() = user_id);

   -- Allow users to update their own graphs
   create policy "Users can update their own graphs"
     on graphs for update
     using (auth.uid() = user_id);

   -- Allow users to delete their own graphs
   create policy "Users can delete their own graphs"
     on graphs for delete
     using (auth.uid() = user_id);

   -- ============================================
   -- INDEXES
   -- ============================================
   
   create index graphs_user_id_idx on graphs(user_id);
   create index graphs_share_code_idx on graphs(share_code);
   create index graphs_is_public_idx on graphs(is_public);
   create index graphs_created_at_idx on graphs(created_at desc);

   -- ============================================
   -- FUNCTIONS
   -- ============================================
   
   -- Function to increment view count (for share links)
   create or replace function increment_graph_views(graph_id uuid)
   returns void
   language plpgsql
   security definer
   as $$
   begin
     update graphs
     set view_count = coalesce(view_count, 0) + 1
     where id = graph_id;
   end;
   $$;
   ```

5. **Add environment variables**
   
   Don't forget to add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` for server-side operations:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Graph

1. **Sign up** for an account or **log in**
2. Click **"New Graph"** from the dashboard
3. Use the toolbar to:
   - Add nodes (click on canvas)
   - Connect nodes (drag from one node to another)
   - Set start/goal nodes
   - Adjust edge weights
4. Click **"Save"** and fill in the details
5. Optionally make it public to share with the community

### Running Search Algorithms

1. Set a **start node** (green)
2. Set a **goal node** (red)
3. Select an algorithm from the dropdown
4. Click **"Run"** to visualize the pathfinding
5. Use **"Step"** for step-by-step execution

### Sharing Graphs

1. Save your graph
2. Check **"Make public"** when saving
3. Share the generated link with others
4. Or let others discover it in the **Explore** page

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 15.5.6 (App Router)
- React 19.1.0
- TypeScript 5.0
- Tailwind CSS 4
- Fabric.js 5.3.0 (Canvas rendering)

**Backend:**
- Supabase (PostgreSQL + Auth)
- Next.js API Routes

**Algorithm Engine:**
- Python 3.9 (via Brython 3.9.0)
- Custom search algorithm implementations

### Project Structure

```
nextjs-app/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   └── dashboard/
│   │       ├── page.tsx     # My Graphs
│   │       ├── new/         # Create new graph
│   │       ├── edit/[id]/   # Edit graph
│   │       ├── graph/[id]/  # View graph
│   │       ├── explore/     # Public graphs
│   │       └── settings/    # User settings
│   ├── api/                 # API routes
│   │   ├── graphs/          # CRUD operations
│   │   └── share/           # Share functionality
│   ├── share/[code]/        # Public share pages
│   └── globals.css          # Global styles
├── components/
│   ├── auth/                # Auth components
│   ├── dashboard/           # Dashboard components
│   └── visualizer/          # Visualizer components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── types/               # TypeScript types
│   └── utils/               # Helper functions
└── public/
    ├── visualizer.html      # Main visualizer page
    ├── graph-integration.js # Save/load integration
    ├── main.py              # Python graph logic
    ├── Node.py              # Node class
    ├── PriorityQueue.py     # Priority queue
    └── SearchAgent.py       # Search algorithms
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Set root directory to `nextjs-app`

3. **Configure Environment Variables**
   Add these in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   Click "Deploy" and wait for build to complete

### Post-Deployment

1. **Update Supabase URL Settings**
   - Add your Vercel domain to Supabase Auth URL configuration

2. **Test the deployment**
   - Sign up/Login
   - Create a graph
   - Save and share

## 🐛 Troubleshooting

### Common Issues

**"Authentication error" on login**
- Check Supabase URL and key in `.env.local`
- Verify Supabase Auth is enabled

**Graphs not saving**
- Check database table exists
- Verify RLS policies are set up correctly
- Check browser console for errors

**Visualizer not loading**
- Ensure Brython scripts are loading
- Check `public/` directory has all files
- Verify iframe src path is correct

**Thumbnail not displaying**
- Check thumbnail_url column exists
- Verify base64 data is being saved
- Check GraphCard component is updated

## 📧 Contact

Ashfak Nawshad - [@ashfaknawshad](https://github.com/ashfaknawshad)

Project Link: [https://github.com/ashfaknawshad/AI-Search](https://github.com/ashfaknawshad/AI-Search)

---

Made with ❤️ using Next.js and Supabase

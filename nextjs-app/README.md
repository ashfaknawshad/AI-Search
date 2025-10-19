# AI Search Visualizer

A full-stack web application for creating, visualizing, and sharing graph-based search algorithm demonstrations. Built with Next.js, Supabase, and Python (Brython).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🌟 Features

### Core Functionality
- **Interactive Graph Visualizer** - Create nodes, connections, and visualize search algorithms in real-time
- **Multiple Search Algorithms** - BFS, DFS, Dijkstra, A*, Greedy Best-First Search, and UCS
- **Cloud Storage** - Save and load graphs with Supabase PostgreSQL
- **Share Functionality** - Generate shareable links for your graphs
- **Public Discovery** - Browse and explore graphs shared by the community

### User Experience
- **Authentication** - Secure sign-up/login with Supabase Auth
- **Personal Dashboard** - Manage all your saved graphs
- **Thumbnails** - Visual previews of graphs in dashboard and explore pages
- **Real-time Search** - Find public graphs with debounced search
- **Unsaved Changes Protection** - Prompts before losing work
- **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features
- **Canvas-based Rendering** - Smooth, performant visualization with Fabric.js
- **Python in Browser** - Brython enables Python-based algorithm execution
- **Server-side Rendering** - Fast initial page loads with Next.js App Router
- **Type Safety** - Full TypeScript implementation
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

   -- Policies
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

   -- Indexes for performance
   create index graphs_user_id_idx on graphs(user_id);
   create index graphs_share_code_idx on graphs(share_code);
   create index graphs_is_public_idx on graphs(is_public);
   ```

5. **Run the development server**
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

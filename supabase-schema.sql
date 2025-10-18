-- AI Search Visualizer Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Extends the auth.users table with additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ============================================
-- 2. GRAPHS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.graphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Graph',
  description TEXT,
  thumbnail_url TEXT,
  graph_data JSONB NOT NULL,
  algorithm_used TEXT,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 200)
);

-- Enable Row Level Security
ALTER TABLE public.graphs ENABLE ROW LEVEL SECURITY;

-- Graphs policies
CREATE POLICY "Users can view their own graphs" 
  ON public.graphs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Public graphs are viewable by everyone" 
  ON public.graphs FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can insert their own graphs" 
  ON public.graphs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own graphs" 
  ON public.graphs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own graphs" 
  ON public.graphs FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_graphs_user_id ON public.graphs(user_id);
CREATE INDEX IF NOT EXISTS idx_graphs_is_public ON public.graphs(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_graphs_created_at ON public.graphs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_graphs_algorithm ON public.graphs(algorithm_used);

-- ============================================
-- 3. SHARED LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.shared_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_id UUID NOT NULL REFERENCES public.graphs(id) ON DELETE CASCADE,
  short_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT short_code_length CHECK (char_length(short_code) = 8)
);

-- Enable Row Level Security
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;

-- Shared links policies
CREATE POLICY "Anyone can view shared links" 
  ON public.shared_links FOR SELECT 
  USING (expires_at IS NULL OR expires_at > NOW());

CREATE POLICY "Graph owners can create shared links" 
  ON public.shared_links FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.graphs 
      WHERE graphs.id = graph_id AND graphs.user_id = auth.uid()
    )
  );

CREATE POLICY "Graph owners can delete their shared links" 
  ON public.shared_links FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.graphs 
      WHERE graphs.id = graph_id AND graphs.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shared_links_short_code ON public.shared_links(short_code);
CREATE INDEX IF NOT EXISTS idx_shared_links_graph_id ON public.shared_links(graph_id);

-- ============================================
-- 4. GRAPH LIKES TABLE (for future features)
-- ============================================
CREATE TABLE IF NOT EXISTS public.graph_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  graph_id UUID NOT NULL REFERENCES public.graphs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (user_id, graph_id)
);

-- Enable Row Level Security
ALTER TABLE public.graph_likes ENABLE ROW LEVEL SECURITY;

-- Graph likes policies
CREATE POLICY "Anyone can view likes" 
  ON public.graph_likes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can like graphs" 
  ON public.graph_likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike graphs" 
  ON public.graph_likes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_graph_likes_graph_id ON public.graph_likes(graph_id);
CREATE INDEX IF NOT EXISTS idx_graph_likes_user_id ON public.graph_likes(user_id);

-- ============================================
-- 5. GRAPH COMMENTS TABLE (for future features)
-- ============================================
CREATE TABLE IF NOT EXISTS public.graph_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_id UUID NOT NULL REFERENCES public.graphs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT comment_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000)
);

-- Enable Row Level Security
ALTER TABLE public.graph_comments ENABLE ROW LEVEL SECURITY;

-- Graph comments policies
CREATE POLICY "Anyone can view comments on public graphs" 
  ON public.graph_comments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.graphs 
      WHERE graphs.id = graph_id AND (graphs.is_public = true OR graphs.user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can comment" 
  ON public.graph_comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.graph_comments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.graph_comments FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_graph_comments_graph_id ON public.graph_comments(graph_id);
CREATE INDEX IF NOT EXISTS idx_graph_comments_user_id ON public.graph_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_graph_comments_created_at ON public.graph_comments(created_at DESC);

-- ============================================
-- 6. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_graphs_updated ON public.graphs;
CREATE TRIGGER on_graphs_updated
  BEFORE UPDATE ON public.graphs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_comments_updated ON public.graph_comments;
CREATE TRIGGER on_comments_updated
  BEFORE UPDATE ON public.graph_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_graph_views(graph_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.graphs 
  SET view_count = view_count + 1 
  WHERE id = graph_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment shared link views
CREATE OR REPLACE FUNCTION public.increment_share_link_views(link_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.shared_links 
  SET view_count = view_count + 1 
  WHERE short_code = link_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. HELPER VIEWS
-- ============================================

-- View for graphs with user info and like counts
CREATE OR REPLACE VIEW public.graphs_with_details AS
SELECT 
  g.*,
  p.username,
  p.full_name,
  p.avatar_url,
  COUNT(DISTINCT gl.user_id) as like_count,
  COUNT(DISTINCT gc.id) as comment_count
FROM public.graphs g
LEFT JOIN public.profiles p ON g.user_id = p.id
LEFT JOIN public.graph_likes gl ON g.id = gl.graph_id
LEFT JOIN public.graph_comments gc ON g.id = gc.graph_id
GROUP BY g.id, p.username, p.full_name, p.avatar_url;

-- Grant access to the view
GRANT SELECT ON public.graphs_with_details TO authenticated, anon;

-- ============================================
-- 8. STORAGE BUCKETS (for thumbnails/avatars)
-- ============================================

-- Create storage bucket for graph thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('graph-thumbnails', 'graph-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for graph thumbnails
CREATE POLICY "Anyone can view graph thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'graph-thumbnails');

CREATE POLICY "Authenticated users can upload graph thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'graph-thumbnails' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own graph thumbnails"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'graph-thumbnails' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own graph thumbnails"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'graph-thumbnails' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- DONE!
-- ============================================
-- Your database is now ready for the AI Search Visualizer app!
-- 
-- Next steps:
-- 1. Get your Supabase project URL and anon key from Project Settings > API
-- 2. Enable email authentication in Authentication > Providers
-- 3. (Optional) Enable OAuth providers (Google, GitHub) in Authentication > Providers
-- 4. Create a .env.local file in your Next.js project with these values

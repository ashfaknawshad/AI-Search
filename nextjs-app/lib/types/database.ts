/**
 * Database types matching Supabase schema
 */

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Graph {
  id: string
  user_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  graph_data: GraphData
  algorithm_used: string | null
  is_public: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface GraphData {
  version: string
  metadata: {
    title: string
    description: string
    algorithm: string
    createdAt: string
    updatedAt: string
  }
  nodes: {
    [key: string]: {
      id: number
      position: [number, number]
      state: 'source' | 'goal' | 'empty' | 'visited' | 'path'
      heuristic: number
      children: { [key: number]: number } // childId: weight
    }
  }
  visualSettings: {
    zoom: number
    panX: number
    panY: number
    colors: {
      source: string
      goal: string
      empty: string
      visited: string
      path: string
    }
  }
}

export interface SharedLink {
  id: string
  graph_id: string
  short_code: string
  expires_at: string | null
  view_count: number
  created_at: string
}

export interface GraphLike {
  user_id: string
  graph_id: string
  created_at: string
}

export interface GraphComment {
  id: string
  graph_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

// View types with joined data
export interface GraphWithDetails extends Graph {
  username: string | null
  full_name: string | null
  avatar_url: string | null
  like_count: number
  comment_count: number
}

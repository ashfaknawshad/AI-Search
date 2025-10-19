'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Graph, GraphWithDetails } from '@/lib/types/database'

/**
 * Hook to fetch user's graphs
 */
export function useGraphs(userId?: string) {
  const [graphs, setGraphs] = useState<Graph[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchGraphs = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('graphs')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })

        if (error) throw error
        setGraphs(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch graphs')
      } finally {
        setLoading(false)
      }
    }

    fetchGraphs()
  }, [userId, supabase])

  return { graphs, loading, error, refetch: () => setLoading(true) }
}

/**
 * Hook to fetch public graphs (for explore page)
 */
export function usePublicGraphs() {
  const [graphs, setGraphs] = useState<GraphWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchPublicGraphs = async () => {
      try {
        const { data, error } = await supabase
          .from('graphs_with_details')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setGraphs(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch public graphs')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicGraphs()
  }, [supabase])

  return { graphs, loading, error }
}

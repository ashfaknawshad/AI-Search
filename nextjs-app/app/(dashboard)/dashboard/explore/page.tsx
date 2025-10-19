'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PublicGraph {
  id: string
  title: string
  description?: string
  thumbnail_url?: string | null
  view_count: number
  created_at: string
  updated_at: string
  author?: {
    id?: string
    full_name: string | null
    avatar_url?: string | null
  } | null
}

export default function ExplorePage() {
  const [graphs, setGraphs] = useState<PublicGraph[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch public graphs
  useEffect(() => {
    async function fetchPublicGraphs() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (debouncedSearch) {
          params.append('search', debouncedSearch)
        }
        
        const response = await fetch(`/api/graphs/public?${params.toString()}`)
        const data = await response.json()
        
        if (response.ok) {
          setGraphs(data.graphs || [])
        } else {
          console.error('Error fetching public graphs:', data.error)
        }
      } catch (error) {
        console.error('Error fetching public graphs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicGraphs()
  }, [debouncedSearch])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Explore Graphs</h1>
              <p className="text-sm text-gray-600 mt-1">
                Discover and learn from graphs shared by the community
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search graphs by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading graphs...</div>
          </div>
        ) : graphs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No graphs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'No public graphs available yet. Be the first to share one!'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800"
                >
                  Create a graph
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {graphs.length} {graphs.length === 1 ? 'graph' : 'graphs'} found
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {graphs.map((graph) => (
                <ExploreGraphCard key={graph.id} graph={graph} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ExploreGraphCard({ graph }: { graph: PublicGraph }) {
  return (
    <Link
      href={`/dashboard/graph/${graph.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      {graph.thumbnail_url ? (
        <div className="w-full h-48 bg-gray-100">
          <img
            src={graph.thumbnail_url}
            alt={graph.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
          {graph.title || 'Untitled Graph'}
        </h3>
        
        {graph.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {graph.description}
          </p>
        )}
        
        {/* Author info */}
        {graph.author && graph.author.full_name && (
          <div className="flex items-center gap-2 mb-4">
            {graph.author.avatar_url ? (
              <img
                src={graph.author.avatar_url}
                alt={graph.author.full_name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                {graph.author.full_name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-gray-700">
              {graph.author.full_name}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Date(graph.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{graph.view_count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface GraphCardProps {
  graph: {
    id: string
    title: string
    description?: string
    thumbnail_url?: string | null
    is_public: boolean
    updated_at: string
  }
}

export default function GraphCard({ graph }: GraphCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!confirm(`Are you sure you want to delete "${graph.title}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/graphs/${graph.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete graph')
      }
    } catch (error) {
      console.error('Error deleting graph:', error)
      alert('Failed to delete graph')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900 truncate flex-1">
            {graph.title || 'Untitled Graph'}
          </h3>
          <div className="flex items-center gap-2 ml-2">
            {graph.is_public && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full whitespace-nowrap">
                Public
              </span>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
              title="Delete graph"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {graph.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {graph.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {new Date(graph.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/graph/${graph.id}`}
              className="text-gray-900 hover:underline font-medium"
            >
              View
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href={`/dashboard/edit/${graph.id}`}
              className="text-gray-600 hover:text-gray-900"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

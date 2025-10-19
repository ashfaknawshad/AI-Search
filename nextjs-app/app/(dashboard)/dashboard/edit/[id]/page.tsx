'use client'

import { useEffect, useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SaveGraphDialog from '@/components/dashboard/SaveGraphDialog'

interface EditGraphPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditGraphPage({ params }: EditGraphPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const resolvedParams = use(params)
  const [graph, setGraph] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [graphData, setGraphData] = useState<any>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    async function loadGraph() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: graphData, error } = await supabase
        .from('graphs')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error || !graphData) {
        router.push('/dashboard')
        return
      }

      if (graphData.user_id !== user.id) {
        router.push('/dashboard')
        return
      }

      setGraph(graphData)
      setLoading(false)
    }

    loadGraph()
  }, [resolvedParams.id, router, supabase])

  useEffect(() => {
    // Listen for save messages from the visualizer iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SAVE_GRAPH') {
        console.log('Received SAVE_GRAPH message:', event.data)
        console.log('Thumbnail:', event.data.thumbnail ? event.data.thumbnail.substring(0, 50) + '...' : 'null')
        setGraphData(event.data.data.graphData)
        setThumbnail(event.data.thumbnail || null)
        setShowSaveDialog(true)
      } else if (event.data.type === 'NAVIGATE_BACK') {
        // Navigate back to dashboard
        router.push('/dashboard')
      } else if (event.data.type === 'HAS_UNSAVED_CHANGES') {
        // Track unsaved changes state from iframe
        setHasUnsavedChanges(event.data.hasChanges)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  useEffect(() => {
    // Warn user before leaving page with unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading graph...</div>
      </div>
    )
  }

  if (!graph) {
    return null
  }

  const handleSaveSuccess = () => {
    // Send success message to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'SAVE_SUCCESS' }, '*')
    }
    // Mark as saved
    setHasUnsavedChanges(false)
  }

  return (
    <>
      <div className="fixed inset-0 bg-gray-900">
        <iframe
          ref={iframeRef}
          src={`/visualizer.html?graphData=${encodeURIComponent(JSON.stringify(graph.graph_data))}&graphId=${graph.id}`}
          className="w-full h-full border-0"
          title={`Edit ${graph.title}`}
        />
      </div>

      {showSaveDialog && (
        <SaveGraphDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          graphData={graphData}
          thumbnail={thumbnail}
          existingGraphId={graph.id}
          existingTitle={graph.title}
          existingDescription={graph.description}
          existingIsPublic={graph.is_public}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import SaveGraphDialog from '@/components/dashboard/SaveGraphDialog'

export default function NewGraphPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [graphData, setGraphData] = useState<any>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    // Listen for messages from the visualizer iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SAVE_GRAPH') {
        console.log('Received SAVE_GRAPH message:', event.data)
        console.log('Thumbnail:', event.data.thumbnail ? event.data.thumbnail.substring(0, 50) + '...' : 'null')
        setGraphData(event.data.data.graphData)
        setThumbnail(event.data.thumbnail || null)
        setShowSaveDialog(true)
      } else if (event.data.type === 'NAVIGATE_BACK') {
        // Navigate back to dashboard
        window.location.href = '/dashboard'
      } else if (event.data.type === 'HAS_UNSAVED_CHANGES') {
        // Track unsaved changes state from iframe
        setHasUnsavedChanges(event.data.hasChanges)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

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
          src="/visualizer.html"
          className="w-full h-full border-0"
          title="AI Search Visualizer"
        />
      </div>

      {showSaveDialog && (
        <SaveGraphDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          graphData={graphData}
          thumbnail={thumbnail}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </>
  )
}

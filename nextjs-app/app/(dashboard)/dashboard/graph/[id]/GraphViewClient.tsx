'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { copyToClipboard } from '@/lib/utils/helpers';

interface GraphViewClientProps {
  graph: any;
  isOwner: boolean;
}

export default function GraphViewClient({ graph, isOwner }: GraphViewClientProps) {
  const router = useRouter();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleGenerateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graph_id: graph.id }),
      });

      const data = await response.json();
      if (response.ok) {
        const link = `${window.location.origin}/share/${data.shareLink.share_code}`;
        setShareLink(link);
        setShowShareDialog(true);
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      copyToClipboard(shareLink);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this graph? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/graphs/${graph.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete graph:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Graphs
          </Link>
          <div className="flex items-start justify-between mt-4">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">{graph.title}</h1>
              {graph.description && (
                <p className="mt-2 text-gray-600">{graph.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>
                  Updated {new Date(graph.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span className={graph.is_public ? 'text-green-600' : 'text-gray-500'}>
                  {graph.is_public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 ml-4">
              <button
                onClick={handleGenerateShareLink}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Share'}
              </button>
              {isOwner && (
                <>
                  <Link
                    href={`/dashboard/edit/${graph.id}`}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Graph Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={`/visualizer.html?graphData=${encodeURIComponent(JSON.stringify(graph.graph_data))}&readOnly=true`}
              className="w-full h-full border-0"
              title={graph.title}
            />
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      {showShareDialog && shareLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Share Graph</h2>
            <p className="text-gray-600 mb-4">
              Anyone with this link can view your graph:
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowShareDialog(false)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

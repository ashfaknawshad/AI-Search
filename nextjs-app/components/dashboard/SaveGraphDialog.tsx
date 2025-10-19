'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface SaveGraphDialogProps {
  isOpen: boolean;
  onClose: () => void;
  graphData: any;
  thumbnail?: string | null;
  existingGraphId?: string;
  onSaveSuccess?: () => void;
  existingTitle?: string;
  existingDescription?: string;
  existingIsPublic?: boolean;
}

export default function SaveGraphDialog({
  isOpen,
  onClose,
  graphData,
  thumbnail,
  existingGraphId,
  onSaveSuccess,
  existingTitle = '',
  existingDescription = '',
  existingIsPublic = false,
}: SaveGraphDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState(existingTitle);
  const [description, setDescription] = useState(existingDescription);
  const [isPublic, setIsPublic] = useState(existingIsPublic);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = existingGraphId
        ? `/api/graphs/${existingGraphId}`
        : '/api/graphs';
      
      const method = existingGraphId ? 'PUT' : 'POST';

      console.log('Saving graph with thumbnail:', thumbnail ? thumbnail.substring(0, 50) + '...' : 'null');

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          graph_data: graphData,
          is_public: isPublic,
          thumbnail: thumbnail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save graph');
      }

      // Call success callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }

      // Refresh the dashboard to show the new/updated graph
      router.push('/dashboard');
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {existingGraphId ? 'Update Graph' : 'Save Graph'}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              placeholder="My Search Graph"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              placeholder="Describe your graph..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Make this graph public (others can view it)
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : existingGraphId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

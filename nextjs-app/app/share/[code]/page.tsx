import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

interface SharePageProps {
  params: {
    code: string;
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const supabase = await createClient();

  // Get the graph from share code
  const { data: shareLink } = await supabase
    .from('shared_links')
    .select('graph_id, graphs(*, profiles(full_name, email))')
    .eq('share_code', params.code)
    .single();

  if (!shareLink || !shareLink.graphs) {
    notFound();
  }

  const graph = Array.isArray(shareLink.graphs) ? shareLink.graphs[0] : shareLink.graphs;

  // Increment view count
  await supabase.rpc('increment_graph_views', { graph_id: graph.id });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              AI Search Visualizer
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      {/* Graph Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {graph.title}
          </h1>
          {graph.description && (
            <p className="text-gray-600 mb-4">{graph.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              Created by {graph.profiles?.full_name || graph.profiles?.email?.split('@')[0] || 'Anonymous'}
            </span>
            <span>•</span>
            <span>
              {new Date(graph.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span>•</span>
            <span>{graph.view_count || 0} views</span>
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
      </div>
    </div>
  );
}

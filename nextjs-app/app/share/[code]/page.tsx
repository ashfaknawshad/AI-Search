import { createClient, createServiceClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

interface SharePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { code } = await params;
  const supabase = await createClient();

  // Get the graph from share code
  const { data: graph, error } = await supabase
    .from('graphs')
    .select('*')
    .eq('share_code', code)
    .single();

  console.log('Share code lookup:', { 
    code, 
    hasGraph: !!graph, 
    error: error ? { 
      message: error.message, 
      details: error.details, 
      hint: error.hint,
      code: error.code 
    } : null 
  });

  if (!graph) {
    notFound();
  }

  // Get user info from auth.users using service client
  let creatorName = 'Anonymous';
  if (graph.user_id) {
    const serviceClient = createServiceClient();
    const { data: userData } = await serviceClient.auth.admin.getUserById(graph.user_id);
    if (userData?.user) {
      creatorName = userData.user.user_metadata?.full_name 
        || userData.user.email?.split('@')[0] 
        || 'Anonymous';
    }
  }

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
            <span>Created by {creatorName}</span>
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

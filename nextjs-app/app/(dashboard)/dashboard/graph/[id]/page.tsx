import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import GraphViewClient from './GraphViewClient';

interface GraphViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GraphViewPage({ params }: GraphViewPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;

  // Get the graph
  const { data: graph, error } = await supabase
    .from('graphs')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !graph) {
    notFound();
  }

  // Check if user owns this graph
  if (graph.user_id !== user.id) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this graph.</p>
        </div>
      </main>
    );
  }

  return <GraphViewClient graph={graph} />;
}

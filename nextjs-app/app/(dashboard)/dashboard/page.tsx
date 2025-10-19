import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import GraphCard from '@/components/dashboard/GraphCard';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's graphs
  const { data: graphs } = await supabase
    .from('graphs')
    .select('*')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })
    .limit(10);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Graphs</h1>
          <p className="mt-2 text-gray-600">
            Your saved search algorithm visualizations
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          + New Graph
        </Link>
      </div>

      {graphs && graphs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {graphs.map((graph) => (
            <GraphCard key={graph.id} graph={graph} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
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
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No graphs yet</h3>
            <p className="mt-2 text-sm text-gray-600">
              Get started by creating your first search algorithm visualization
            </p>
            <Link
              href="/dashboard/new"
              className="mt-6 inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Create your first graph
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

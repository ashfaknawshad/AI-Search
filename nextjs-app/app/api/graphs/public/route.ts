import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET all public graphs
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('search') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('graphs')
    .select('id, title, description, thumbnail_url, is_public, view_count, created_at, updated_at, user_id')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Add search filter if provided
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: graphs, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get unique user IDs
  const userIds = [...new Set(graphs?.map(g => g.user_id) || [])];
  
  // Fetch profiles for all users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);

  // Map profiles to graphs
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
  
  const graphsWithAuthors = (graphs || []).map(graph => ({
    ...graph,
    author: profileMap.get(graph.user_id) || null,
  }));

  return NextResponse.json({ graphs: graphsWithAuthors });
}

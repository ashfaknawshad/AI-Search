import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET all graphs for the authenticated user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: graphs, error } = await supabase
    .from('graphs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ graphs });
}

// POST - Create a new graph
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, graph_data, is_public, thumbnail } = body;

  // Validate required fields
  if (!title || !graph_data) {
    return NextResponse.json(
      { error: 'Title and graph_data are required' },
      { status: 400 }
    );
  }

  const { data: graph, error } = await supabase
    .from('graphs')
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      graph_data,
      is_public: is_public || false,
      thumbnail_url: thumbnail || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ graph }, { status: 201 });
}

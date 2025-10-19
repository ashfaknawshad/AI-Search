import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET a specific graph by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: graph, error } = await supabase
    .from('graphs')
    .select('*, profiles(full_name, email)')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Check if user has access (owner or public graph)
  if (!graph.is_public && (!user || graph.user_id !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ graph });
}

// PUT - Update a graph
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, graph_data, is_public, thumbnail } = body;

  // Verify ownership
  const { data: existingGraph } = await supabase
    .from('graphs')
    .select('user_id')
    .eq('id', params.id)
    .single();

  if (!existingGraph || existingGraph.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: graph, error } = await supabase
    .from('graphs')
    .update({
      title,
      description,
      graph_data,
      is_public,
      thumbnail_url: thumbnail || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ graph });
}

// DELETE a graph
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const { data: existingGraph } = await supabase
    .from('graphs')
    .select('user_id')
    .eq('id', params.id)
    .single();

  if (!existingGraph || existingGraph.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await supabase
    .from('graphs')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

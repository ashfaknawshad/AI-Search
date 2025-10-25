import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateShareCode } from '@/lib/utils/helpers';

// POST - Generate a share link for a graph
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { graph_id } = body;

  if (!graph_id) {
    return NextResponse.json(
      { error: 'graph_id is required' },
      { status: 400 }
    );
  }

  // Get the graph and verify ownership
  const { data: graph, error: fetchError } = await supabase
    .from('graphs')
    .select('id, user_id, share_code')
    .eq('id', graph_id)
    .single();

  if (fetchError || !graph) {
    return NextResponse.json({ error: 'Graph not found' }, { status: 404 });
  }

  if (graph.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // If share code already exists, return it
  if (graph.share_code) {
    return NextResponse.json({ 
      shareLink: { 
        share_code: graph.share_code,
        graph_id: graph.id 
      } 
    });
  }

  // Generate unique share code
  let shareCode = generateShareCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .from('graphs')
      .select('share_code')
      .eq('share_code', shareCode)
      .single();

    if (!existing) break;
    
    shareCode = generateShareCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return NextResponse.json(
      { error: 'Failed to generate unique share code' },
      { status: 500 }
    );
  }

  // Update graph with share code
  const { data: updatedGraph, error: updateError } = await supabase
    .from('graphs')
    .update({ share_code: shareCode })
    .eq('id', graph_id)
    .select('share_code, id')
    .single();

  console.log('Share code update:', { 
    graphId: graph_id,
    shareCode, 
    updatedGraph, 
    error: updateError 
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ 
    shareLink: { 
      share_code: updatedGraph.share_code,
      graph_id: updatedGraph.id 
    } 
  }, { status: 201 });
}
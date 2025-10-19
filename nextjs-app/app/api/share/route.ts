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

  // Verify ownership
  const { data: graph } = await supabase
    .from('graphs')
    .select('user_id')
    .eq('id', graph_id)
    .single();

  if (!graph || graph.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Check if share link already exists
  const { data: existingLink } = await supabase
    .from('shared_links')
    .select('*')
    .eq('graph_id', graph_id)
    .single();

  if (existingLink) {
    return NextResponse.json({ shareLink: existingLink });
  }

  // Generate unique share code
  let shareCode = generateShareCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .from('shared_links')
      .select('share_code')
      .eq('share_code', shareCode)
      .single();

    if (!existing) break;
    
    shareCode = generateShareCode();
    attempts++;
  }

  // Create share link
  const { data: shareLink, error } = await supabase
    .from('shared_links')
    .insert({
      graph_id,
      share_code: shareCode,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ shareLink }, { status: 201 });
}

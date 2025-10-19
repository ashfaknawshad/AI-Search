import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    
    // Sync profile data from auth.users to profiles table
    if (data.user) {
      const userId = data.user.id;
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (existingProfile) {
        // Profile exists - ONLY update avatar from Google, NEVER touch full_name
        if (data.user.user_metadata?.avatar_url) {
          await supabase
            .from('profiles')
            .update({ 
              avatar_url: data.user.user_metadata.avatar_url 
            })
            .eq('id', userId);
        }
      } else {
        // New user - create profile with Google data
        await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
            avatar_url: data.user.user_metadata?.avatar_url || null,
          });
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  // Fetch profile data from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  // Merge profile data with user data (profiles table is source of truth)
  const userWithProfile = {
    ...user,
    user_metadata: {
      ...user.user_metadata,
      // Use profile table as source of truth for full_name
      full_name: profile?.full_name !== null && profile?.full_name !== undefined 
        ? profile.full_name 
        : (user.user_metadata?.full_name || user.user_metadata?.name),
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={userWithProfile} />
      {children}
    </div>
  );
}

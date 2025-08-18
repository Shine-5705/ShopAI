import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { auth, supabase } from '../lib/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, setLoading } = useAuthStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user } = await auth.getCurrentUser();
      setAuth(user, null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        setAuth(session?.user ?? null, session);
        
        // Create or update profile when user signs up/in
        if (session?.user && event === 'SIGNED_IN') {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name,
              avatar_url: session.user.user_metadata?.avatar_url,
              updated_at: new Date().toISOString()
            });
          
          if (error) {
            console.error('Error creating/updating profile:', error);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setAuth, setLoading]);

  return <>{children}</>;
}
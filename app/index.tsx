import { Redirect, useRouter } from 'expo-router';
    import { useAuth } from '@/providers/AuthProvider';
    import { useEffect } from 'react';

    export default function Index() {
      const { session, loading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        if (!loading) {
          if (session) {
            router.replace('/(tabs)');
          } else {
            router.replace('/login');
          }
        }
      }, [session, loading]);

      return null; // Or a loading indicator
    }


import { useQuery } from '@tanstack/react-query';
import { getActivities } from '@/services/supabaseService';
import { Activity } from '@/types/supabase';

export function useActivities() {
  const { 
    data: activities,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Activity[], Error>({
    queryKey: ['activities'],
    queryFn: getActivities,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  return {
    activities,
    isLoading,
    isError,
    error,
    refetch
  };
}

export default useActivities;

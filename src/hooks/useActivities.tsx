
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
    queryFn: getActivities
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

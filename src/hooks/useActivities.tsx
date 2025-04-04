
import { useQuery } from '@tanstack/react-query';
import { getActivities } from '@/services/supabaseService';
import { Activity } from '@/types/supabase';

export const useActivities = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    gcTime: 1000 * 60 * 60, // 1 hour
  });
  
  // The Activities page already has fallback data if nothing comes from the database
  const activities = data || [];
  
  return {
    activities,
    isLoading,
    isError: !!error
  };
};

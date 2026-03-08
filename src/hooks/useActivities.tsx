
import { useQuery } from '@tanstack/react-query';
import { getActivities } from '@/services/supabaseService';

export const useActivities = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    gcTime: 1000 * 60 * 60,
  });
  
  const activities = data ?? [];
  
  const filterByCategory = (categoryFilter: string | null) => {
    if (!categoryFilter || categoryFilter === 'all') return activities;
    return activities.filter(activity => activity.category?.toLowerCase() === categoryFilter.toLowerCase());
  };
  
  const filterByDifficulty = (difficultyFilter: string | null) => {
    if (!difficultyFilter || difficultyFilter === 'all') return activities;
    return activities.filter(activity => activity.difficulty?.toLowerCase() === difficultyFilter.toLowerCase());
  };
  
  return {
    activities,
    isLoading,
    isError: !!error,
    filterByCategory,
    filterByDifficulty
  };
};


import { useQuery } from '@tanstack/react-query';
import { getActivities } from '@/services/supabaseService';
import { Activity } from '@/types/supabase';
import { dandeliActivities } from '@/data/activities';

export const useActivities = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    gcTime: 1000 * 60 * 60, // 1 hour
  });
  
  // The Activities page already has fallback data if nothing comes from the database
  const activities = data && data.length > 0 
    ? data 
    : dandeliActivities.map(activity => {
        return {
          id: activity.id,
          name: activity.title,
          description: activity.description,
          price: activity.price,
          duration: activity.duration,
          max_participants: activity.maxParticipants,
          category: activity.category,
          difficulty: activity.difficulty,
          rating: activity.rating,
          image: activity.image,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Activity;
      });
  
  return {
    activities,
    isLoading,
    isError: !!error
  };
};

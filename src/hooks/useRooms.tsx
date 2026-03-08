
import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/services/supabaseService';

export const useRooms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    gcTime: 1000 * 60 * 60,
  });
  
  const rooms = data ?? [];
  
  return {
    rooms,
    isLoading,
    isError: !!error
  };
};


import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/services/supabaseService';
import { Room } from '@/types/supabase';

export function useRooms() {
  const { 
    data: rooms,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Room[], Error>({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  return {
    rooms,
    isLoading,
    isError,
    error,
    refetch
  };
}

export default useRooms;


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
    queryFn: getRooms
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

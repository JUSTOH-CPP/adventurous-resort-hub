import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/services/supabaseService';
import { kenyaRooms } from '@/data/rooms';
import { Room } from '@/types/supabase';

export const useRooms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    gcTime: 1000 * 60 * 60, // 1 hour
  });
  
  // If we have data from Supabase, use it
  // Otherwise, fall back to our predefined rooms
  const rooms = data && data.length > 0 
    ? data 
    : kenyaRooms.map(room => {
        return {
          id: room.id,
          name: room.title,
          description: room.description,
          price: room.price,
          capacity: room.capacity,
          amenities: room.amenities,
          images: [room.image],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Room;
      });
  
  return {
    rooms,
    isLoading,
    isError: !!error
  };
};


import { supabase } from '@/integrations/supabase/client';
import { Activity, ActivityBooking } from '@/types/supabase';

export interface ActivityBookingFormData {
  activityId: string;
  date: Date;
  participants: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export const createActivityBooking = async (bookingData: ActivityBookingFormData): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;
    
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', bookingData.activityId)
      .single();
      
    if (activityError || !activity) {
      console.error("Activity fetch error:", activityError);
      throw new Error('Failed to fetch activity details');
    }
    
    const totalPrice = (activity as unknown as Activity).price * bookingData.participants;
    
    const bookingRecord: Record<string, unknown> = {
      activity_id: bookingData.activityId,
      date: bookingData.date.toISOString().split('T')[0],
      participants: bookingData.participants,
      total_price: totalPrice,
      contact_name: bookingData.name,
      contact_email: bookingData.email,
      contact_phone: bookingData.phone,
      special_requests: bookingData.specialRequests || null,
    };
    
    if (userId) {
      bookingRecord.user_id = userId;
      bookingRecord.status = 'pending';
    }
    
    const { data, error } = await supabase
      .from('activity_bookings')
      .insert(bookingRecord as any)
      .select()
      .single();
      
    if (error) {
      console.error("Activity booking error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No booking data returned');
    }
    
    return (data as any).id;
  } catch (error) {
    console.error('Error creating activity booking:', error);
    throw error;
  }
};

export const getUserActivityBookings = async (): Promise<ActivityBooking[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await (supabase
      .from('activity_bookings')
      .select('*, activity:activity_id(*)') as any)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return (data as unknown as ActivityBooking[]) || [];
  } catch (error) {
    console.error('Error getting user activity bookings:', error);
    return [];
  }
};

export const cancelActivityBooking = async (bookingId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('activity_bookings')
      .update({ status: 'cancelled' } as any)
      .eq('id', bookingId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error cancelling activity booking:', error);
    throw error;
  }
};

export const getActivityAvailability = async (activityId: string, date: string): Promise<number> => {
  try {
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('max_participants')
      .eq('id', activityId)
      .single();
    
    if (activityError || !activity) {
      console.error("Error fetching activity:", activityError);
      throw new Error('Could not fetch activity details');
    }
    
    const { data: bookings, error: bookingsError } = await (supabase
      .from('activity_bookings')
      .select('participants') as any)
      .eq('activity_id', activityId)
      .eq('date', date)
      .neq('status', 'cancelled');
    
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      throw new Error('Could not fetch bookings');
    }
    
    const bookedParticipants = bookings?.reduce((sum, booking) => sum + (booking as any).participants, 0) || 0;
    const maxParticipants = (activity as any).max_participants || 0;
    const availableSpots = Math.max(0, maxParticipants - bookedParticipants);
    
    return availableSpots;
  } catch (error) {
    console.error('Error checking activity availability:', error);
    return 0;
  }
};

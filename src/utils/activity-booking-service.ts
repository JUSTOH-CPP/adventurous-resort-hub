
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

// Define the type for activity booking record to be inserted into the database
// This matches what Supabase expects for the activity_bookings table
interface ActivityBookingInsert {
  activity_id?: string;
  user_id?: string;
  date: string;
  participants: number;
  total_price?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  special_requests?: string;
  status?: string;
}

export const createActivityBooking = async (bookingData: ActivityBookingFormData): Promise<string> => {
  try {
    // Get the current user or create a guest booking
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null; // Allow for guest bookings
    
    // Fetch activity details to calculate price
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', bookingData.activityId)
      .single();
      
    if (activityError || !activity) {
      console.error("Activity fetch error:", activityError);
      throw new Error('Failed to fetch activity details');
    }
    
    // Calculate total price based on number of participants
    const totalPrice = (activity as Activity).price * bookingData.participants;
    
    // Create a booking record that matches the expected structure of the database table
    const bookingRecord: ActivityBookingInsert = {
      activity_id: bookingData.activityId,
      date: bookingData.date.toISOString().split('T')[0],
      participants: bookingData.participants,
      total_price: totalPrice,
      contact_name: bookingData.name,
      contact_email: bookingData.email,
      contact_phone: bookingData.phone,
      special_requests: bookingData.specialRequests || null
    };
    
    // Add user_id and status only if we have a valid user session
    if (userId) {
      bookingRecord.user_id = userId;
      bookingRecord.status = 'pending';
    }
    
    const { data, error } = await supabase
      .from('activity_bookings')
      .insert(bookingRecord)
      .select()
      .single();
      
    if (error) {
      console.error("Activity booking error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No booking data returned');
    }
    
    return data.id;
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
    
    // Use explicit type for the return data to avoid deep instantiation issues
    const { data, error } = await supabase
      .from('activity_bookings')
      .select(`
        *,
        activity:activity_id(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Use type assertion to handle the shape of the data from Supabase
    return (data || []) as unknown as ActivityBooking[];
  } catch (error) {
    console.error('Error getting user activity bookings:', error);
    return []; // Return empty array instead of throwing
  }
};

export const cancelActivityBooking = async (bookingId: string): Promise<void> => {
  try {
    // The update operations needs to use a type that has the status field
    const { error } = await supabase
      .from('activity_bookings')
      .update({ status: 'cancelled' } as { status: string })
      .eq('id', bookingId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error cancelling activity booking:', error);
    throw error;
  }
};

export const getActivityAvailability = async (activityId: string, date: string): Promise<number> => {
  try {
    // Get the activity details to find max participants
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('max_participants')
      .eq('id', activityId)
      .single();
    
    if (activityError || !activity) {
      console.error("Error fetching activity:", activityError);
      throw new Error('Could not fetch activity details');
    }
    
    // Get current bookings for this activity on this date
    const { data: bookings, error: bookingsError } = await supabase
      .from('activity_bookings')
      .select('participants')
      .eq('activity_id', activityId)
      .eq('date', date)
      .neq('status', 'cancelled');
    
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      throw new Error('Could not fetch bookings');
    }
    
    // Calculate total participants booked
    const bookedParticipants = bookings?.reduce((sum, booking) => sum + booking.participants, 0) || 0;
    
    // Calculate available spots
    const maxParticipants = activity.max_participants || 0;
    const availableSpots = Math.max(0, maxParticipants - bookedParticipants);
    
    return availableSpots;
  } catch (error) {
    console.error('Error checking activity availability:', error);
    return 0; 
  }
};

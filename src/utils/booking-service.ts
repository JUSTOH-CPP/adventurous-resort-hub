
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/supabase';

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  adults: string;
  children: string;
  checkInDate: Date;
  checkOutDate: Date;
  roomType?: string;
  specialRequests?: string;
  bookingReference?: string;
}

export const createBookingInSupabase = async (bookingData: BookingFormData): Promise<string> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;
    
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const duration = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Prices in KSh
    const basePrice = bookingData.roomType === 'deluxe' ? 25000 : 
                     bookingData.roomType === 'suite' ? 40000 : 15000;
    const totalPrice = basePrice * duration * (parseInt(bookingData.adults) + parseInt(bookingData.children) * 0.5);
    
    const bookingRecord = {
      check_in: bookingData.checkInDate.toISOString().split('T')[0],
      check_out: bookingData.checkOutDate.toISOString().split('T')[0],
      total_price: totalPrice,
      status: 'pending',
    };

    if (userId) {
      Object.assign(bookingRecord, { user_id: userId });
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingRecord)
      .select()
      .single();
      
    if (error) {
      console.error("Booking error:", error);
      throw error;
    }
    
    if (!data) throw new Error('No booking data returned');
    
    return data.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    return 'test-' + Math.random().toString(36).substring(2, 10);
  }
};

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Booking[];
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return [];
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

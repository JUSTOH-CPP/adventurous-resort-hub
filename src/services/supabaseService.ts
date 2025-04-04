import { supabase } from '@/integrations/supabase/client';
import type { 
  Booking, 
  Room, 
  Activity, 
  ActivityBooking, 
  User, 
  Review, 
  ResortArea 
} from '@/types/supabase';

// Bookings
export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');
  
  if (error) throw error;
  return data as Booking[];
};

export const getBookingById = async (id: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Booking;
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select();
  
  if (error) throw error;
  return data[0] as Booking;
};

export const updateBookingStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0] as Booking;
};

// Rooms
export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) throw error;
  return data as Room[];
};

export const getRoomById = async (id: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Room;
};

// Activities
export const getActivities = async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('*');
  
  if (error) throw error;
  return data as Activity[];
};

export const getActivityById = async (id: string) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Activity;
};

// Activity Bookings
export const getActivityBookings = async () => {
  const { data, error } = await supabase
    .from('activity_bookings')
    .select(`
      *,
      activity:activity_id(*)
    `);
  
  if (error) throw error;
  return data as ActivityBooking[];
};

export const getActivityBookingById = async (id: string) => {
  const { data, error } = await supabase
    .from('activity_bookings')
    .select(`
      *,
      activity:activity_id(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as ActivityBooking;
};

export const createActivityBooking = async (booking: Omit<ActivityBooking, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('activity_bookings')
    .insert(booking)
    .select();
  
  if (error) throw error;
  return data[0] as ActivityBooking;
};

// Users
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data as User[];
};

// Reviews
export const getReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*');
  
  if (error) throw error;
  return data as Review[];
};

export const createReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select();
  
  if (error) throw error;
  return data[0] as Review;
};


export interface Booking {
  id: string;
  user_id?: string;
  room_id?: string;
  status?: string;
  check_in: string;
  check_out: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  amenities?: any;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  max_participants?: number;
  category?: string;
  difficulty?: string;
  rating?: number;
  groupSize?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityBooking {
  id: string;
  booking_id?: string;
  activity_id?: string;
  user_id?: string;
  status?: string;
  date: string;
  participants: number;
  total_price?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  activity?: Activity;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id?: string;
  booking_id?: string;
  rating?: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ResortArea {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

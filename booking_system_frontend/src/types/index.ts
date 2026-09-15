// API Data Models matching backend schemas

export type SeatClass = 'economy' | 'business' | 'galaxium';

export const SEAT_CLASS_LABELS: Record<SeatClass, string> = {
  economy: 'Economy',
  business: 'Business',
  galaxium: 'Galaxium',
};

export const SEAT_CLASS_MULTIPLIERS: Record<SeatClass, number> = {
  economy: 1,
  business: 2,
  galaxium: 4,
};

export const SEAT_CLASSES: SeatClass[] = ['economy', 'business', 'galaxium'];

export interface Flight {
  flight_id: number;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seats_economy: number;
  seats_business: number;
  seats_galaxium: number;
}

export interface Booking {
  booking_id: number;
  user_id: number;
  flight_id: number;
  status: 'booked' | 'cancelled' | 'completed';
  booking_time: string;
  seat_class: SeatClass;
}

export interface User {
  user_id: number;
  name: string;
  email: string;
}

export interface BookingRequest {
  user_id: number;
  name: string;
  flight_id: number;
  seat_class: SeatClass;
}

export interface UserRegistration {
  name: string;
  email: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  error_code: string;
  details?: string;
}

export interface BookingWithFlight extends Booking {
  flight?: Flight;
}

export interface FlightFilters {
  origin?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Made with Bob

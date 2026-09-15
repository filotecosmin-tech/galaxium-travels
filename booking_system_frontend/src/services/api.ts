import axios from 'axios';
import type {
  Flight,
  Booking,
  User,
  BookingRequest,
  UserRegistration,
  ErrorResponse,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) return Promise.reject(error.response.data);
    return Promise.reject({
      success: false,
      error: 'Network error',
      error_code: 'NETWORK_ERROR',
      details: error.message,
    } as ErrorResponse);
  }
);

/** Get all available flights */
export const getFlights = async (): Promise<Flight[]> => {
  const response = await api.get<Flight[]>('/flights');
  return response.data;
};

/** Register a new user */
export const registerUser = async (data: UserRegistration): Promise<User | ErrorResponse> => {
  const response = await api.post<User | ErrorResponse>('/register', data);
  return response.data;
};

/** Get user by name and email */
export const getUserByCredentials = async (name: string, email: string): Promise<User | ErrorResponse> => {
  const response = await api.get<User | ErrorResponse>('/user', { params: { name, email } });
  return response.data;
};

/** Book a flight */
export const bookFlight = async (data: BookingRequest): Promise<Booking | ErrorResponse> => {
  const response = await api.post<Booking | ErrorResponse>('/book', data);
  return response.data;
};

/** Get all bookings for a user */
export const getUserBookings = async (userId: number): Promise<Booking[]> => {
  const response = await api.get<Booking[]>(`/bookings/${userId}`);
  return response.data;
};

/** Cancel a booking */
export const cancelBooking = async (bookingId: number): Promise<Booking | ErrorResponse> => {
  const response = await api.post<Booking | ErrorResponse>(`/cancel/${bookingId}`);
  return response.data;
};

/** Check if response is an error */
export const isErrorResponse = (response: unknown): response is ErrorResponse => {
  return !!response && typeof response === 'object' && (response as ErrorResponse).success === false;
};

/** Health check */
export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await api.get<{ status: string }>('/');
  return response.data;
};

export default api;

// Made with Bob

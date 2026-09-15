import { format, parseISO } from 'date-fns';

/** Format a date string to a readable format */
export const formatDate = (dateString: string, formatString: string = 'MMM dd, yyyy HH:mm'): string => {
  try {
    return format(parseISO(dateString), formatString);
  } catch {
    return dateString;
  }
};

/** Format date to short format */
export const formatDateShort = (dateString: string): string => formatDate(dateString, 'MMM dd, yyyy');

/** Format time only */
export const formatTime = (dateString: string): string => formatDate(dateString, 'HH:mm');

/** Format currency (USD) */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

/** Format large numbers with commas */
export const formatNumber = (num: number): string => new Intl.NumberFormat('en-US').format(num);

/** Calculate flight duration */
export const calculateDuration = (departureTime: string, arrivalTime: string): string => {
  try {
    const departure = parseISO(departureTime);
    const arrival = parseISO(arrivalTime);
    const diffInHours = (arrival.getTime() - departure.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return `${Math.round(diffInHours * 60)} min`;
    const hours = Math.floor(diffInHours);
    const minutes = Math.round((diffInHours - hours) * 60);
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  } catch {
    return 'N/A';
  }
};

// Made with Bob

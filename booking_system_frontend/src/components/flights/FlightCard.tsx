import type { Flight, SeatClass } from '../../types';
import { SEAT_CLASS_LABELS, SEAT_CLASS_MULTIPLIERS } from '../../types';
import { Card, Button } from '../common';
import { Plane, Clock, DollarSign, Users } from 'lucide-react';
import { formatCurrency, formatDate, formatTime, calculateDuration } from '../../utils/formatters';
import { motion } from 'framer-motion';

interface FlightCardProps {
  flight: Flight;
  seatClass: SeatClass;
  onBook: (flight: Flight, seatClass: SeatClass) => void;
}

const CLASS_BADGE_STYLES: Record<SeatClass, string> = {
  economy: 'bg-white/10 text-star-white/80',
  business: 'bg-cosmic-purple/30 text-cosmic-purple',
  galaxium: 'bg-alien-green/20 text-alien-green',
};

export const FlightCard = ({ flight, seatClass, onBook }: FlightCardProps) => {
  const seatsKey = `seats_${seatClass}` as keyof Flight;
  const seatsAvailable = flight[seatsKey] as number;
  const price = flight.price * SEAT_CLASS_MULTIPLIERS[seatClass];
  const isLowSeats = seatsAvailable <= 2;
  const isSoldOut = seatsAvailable === 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cosmic-gradient"><Plane className="text-white" size={24} /></div>
            <div>
              <h3 className="text-xl font-bold text-star-white">{flight.origin} → {flight.destination}</h3>
              <p className="text-sm text-star-white/60">Flight #{flight.flight_id}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CLASS_BADGE_STYLES[seatClass]}`}>{SEAT_CLASS_LABELS[seatClass]}</span>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-star-white/60 mb-1">Departure</p>
              <p className="text-sm font-medium text-star-white">{formatDate(flight.departure_time, 'MMM dd, yyyy')}</p>
              <p className="text-lg font-bold text-cosmic-purple">{formatTime(flight.departure_time)}</p>
            </div>
            <div>
              <p className="text-xs text-star-white/60 mb-1">Arrival</p>
              <p className="text-sm font-medium text-star-white">{formatDate(flight.arrival_time, 'MMM dd, yyyy')}</p>
              <p className="text-lg font-bold text-cosmic-purple">{formatTime(flight.arrival_time)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-star-white/70">
            <Clock size={16} /><span className="text-sm">Duration: {calculateDuration(flight.departure_time, flight.arrival_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-alien-green" />
            <span className="text-2xl font-bold text-star-white">{formatCurrency(price)}</span>
            <span className="text-sm text-star-white/60">per seat</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className={isLowSeats ? 'text-solar-orange' : 'text-star-white/70'} />
            <span className={`text-sm ${isLowSeats ? 'text-solar-orange font-semibold' : 'text-star-white/70'}`}>
              {isSoldOut ? 'Sold Out' : `${seatsAvailable} seats available`}
            </span>
          </div>
        </div>

        <Button onClick={() => onBook(flight, seatClass)} disabled={isSoldOut} className="w-full">
          {isSoldOut ? 'Sold Out' : 'Book Now'}
        </Button>
      </Card>
    </motion.div>
  );
};

// Made with Bob

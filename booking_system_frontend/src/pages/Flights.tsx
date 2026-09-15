import { useState, useEffect } from 'react';
import type { Flight, SeatClass } from '../types';
import { SEAT_CLASSES } from '../types';
import { LoadingSpinner } from '../components/common';
import { FlightCard } from '../components/flights/FlightCard';
import { UserIdentification } from '../components/user/UserIdentification';
import { BookingModal } from '../components/bookings/BookingModal';
import { getFlights } from '../services/api';
import { useUser } from '../hooks/useUser';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const Flights = () => {
  const { user } = useUser();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedSeatClass, setSelectedSeatClass] = useState<SeatClass>('economy');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => { loadFlights(); }, []);

  useEffect(() => {
    if (!searchTerm.trim()) { setFilteredFlights(flights); return; }
    const term = searchTerm.toLowerCase();
    setFilteredFlights(flights.filter(f => f.origin.toLowerCase().includes(term) || f.destination.toLowerCase().includes(term)));
  }, [searchTerm, flights]);

  const loadFlights = async () => {
    setIsLoading(true);
    try {
      const data = await getFlights();
      setFlights(data); setFilteredFlights(data);
    } catch {
      toast.error('Failed to load flights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookFlight = (flight: Flight, seatClass: SeatClass) => {
    setSelectedFlight(flight); setSelectedSeatClass(seatClass);
    if (!user) setShowUserModal(true); else setShowBookingModal(true);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-star-white mb-4">Available <span className="bg-cosmic-gradient bg-clip-text text-transparent">Flights</span></h1>
        <p className="text-star-white/70 text-lg">Choose your destination and embark on an interplanetary adventure</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-star-white/50" size={20} />
            <input type="text" placeholder="Search by origin or destination..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-star-white placeholder-star-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-purple" />
          </div>
          <div className="flex items-center gap-2 text-star-white/70">
            <Filter size={20} /><span className="text-sm">{filteredFlights.length} of {flights.length} flights</span>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading flights..." />
      ) : filteredFlights.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-star-white/70 text-lg">{searchTerm ? 'No flights found matching your search' : 'No flights available'}</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlights.flatMap((flight) => SEAT_CLASSES.map((seatClass) => (
            <FlightCard key={`${flight.flight_id}-${seatClass}`} flight={flight} seatClass={seatClass} onBook={handleBookFlight} />
          )))}
        </motion.div>
      )}

      <UserIdentification isOpen={showUserModal} onClose={() => setShowUserModal(false)} onSuccess={() => setShowBookingModal(true)} />
      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} flight={selectedFlight} seatClass={selectedSeatClass} onSuccess={loadFlights} />
    </div>
  );
};

// Made with Bob

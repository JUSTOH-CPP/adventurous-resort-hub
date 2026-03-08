
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRooms } from '@/hooks/useRooms';
import { Users, Wifi, Coffee, Tv, Waves, UtensilsCrossed, Wind, Car, Flower2, ShowerHead } from 'lucide-react';

const amenityIconMap: Record<string, { icon: React.ReactNode; label: string }> = {
  wifi: { icon: <Wifi size={14} />, label: 'WiFi' },
  pool: { icon: <Waves size={14} />, label: 'Pool' },
  restaurant: { icon: <UtensilsCrossed size={14} />, label: 'Restaurant' },
  coffee: { icon: <Coffee size={14} />, label: 'Coffee' },
  tv: { icon: <Tv size={14} />, label: 'TV' },
  ac: { icon: <Wind size={14} />, label: 'A/C' },
  parking: { icon: <Car size={14} />, label: 'Parking' },
  spa: { icon: <Flower2 size={14} />, label: 'Spa' },
  shower: { icon: <ShowerHead size={14} />, label: 'Shower' },
};

const parseAmenities = (amenities: any): { icon: React.ReactNode; label: string }[] => {
  if (!amenities) return [];
  const list: string[] = Array.isArray(amenities) ? amenities : typeof amenities === 'string' ? amenities.split(',').map(s => s.trim()) : [];
  return list.map(a => {
    const key = a.toLowerCase().trim();
    return amenityIconMap[key] || { icon: <Coffee size={14} />, label: a };
  });
};

const Accommodation: React.FC = () => {
  const { rooms, isLoading, isError } = useRooms();
  const [filter, setFilter] = useState<string>('all');

  const filteredRooms = filter === 'all' ? rooms : rooms.filter(room => {
    const kshPrice = room.price * 150;
    if (filter === 'budget' && kshPrice < 25000) return true;
    if (filter === 'standard' && kshPrice >= 25000 && kshPrice < 40000) return true;
    if (filter === 'luxury' && kshPrice >= 40000) return true;
    return false;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero */}
        <section className="relative h-[50vh] bg-accent text-accent-foreground overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 animate-fade-in">Accommodations</h1>
            <p className="text-xl max-w-2xl animate-fade-in">Luxury safari lodges in the heart of Kenya</p>
          </div>
        </section>
        
        {/* Filters */}
        <section className="py-8 container px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { value: 'all', label: 'All' },
              { value: 'budget', label: 'Budget (Under KSh 25,000)' },
              { value: 'standard', label: 'Standard (KSh 25,000–40,000)' },
              { value: 'luxury', label: 'Luxury (Above KSh 40,000)' },
            ].map(option => (
              <button key={option.value} onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${filter === option.value ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground/70 hover:bg-secondary/80'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </section>
        
        {/* Grid */}
        <section className="pb-16 container px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading rooms...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-destructive">Error loading rooms. Please try again later.</p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room, index) => (
                <div key={room.id} className="bg-card rounded-xl overflow-hidden shadow-md transition-all duration-500 animate-slide-up card-hover" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="aspect-video relative overflow-hidden">
                    <img src={room.images?.[0] || '/placeholder.svg'} alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-accent">
                      KSh {(room.price * 150).toLocaleString()} <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-display font-semibold">{room.name}</h3>
                      <div className="flex items-center text-muted-foreground">
                        <Users size={16} className="mr-1" />
                        <span className="text-sm">Up to {room.capacity}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-5 line-clamp-2">{room.description || 'No description available'}</p>
                    <Link to="/booking" className="block w-full py-3 text-center bg-accent text-accent-foreground rounded-md transition-all duration-300 hover:bg-accent/90">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {rooms.length === 0 ? "No rooms available yet. Check back soon!" : "No rooms match your filter."}
              </p>
              {rooms.length > 0 && (
                <button onClick={() => setFilter('all')} className="mt-4 px-6 py-2 bg-accent text-accent-foreground rounded-md">View All</button>
              )}
            </div>
          )}
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-accent text-accent-foreground">
          <div className="container px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-display font-bold mb-4">Ready to Book?</h2>
              <p className="text-xl mb-8 text-accent-foreground/90">Secure your perfect safari lodge now</p>
              <Link to="/booking" className="inline-block px-8 py-4 bg-background text-accent font-medium text-lg rounded-md transition-all duration-300 hover:bg-background/90 hover:shadow-lg">
                Book Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Accommodation;

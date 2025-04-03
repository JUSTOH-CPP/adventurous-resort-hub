import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import { Wifi, Coffee, Users, Tv, MapPin } from 'lucide-react';

type RoomType = {
  id: string;
  title: string;
  description: string;
  price: number;
  capacity: number;
  size: string;
  bedType: string;
  image: string;
  views: string;
  amenities: {
    icon: React.ReactNode;
    label: string;
  }[];
};

const Accommodation: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const accommodations: RoomType[] = [{
    id: "deluxe-cottage",
    title: "Deluxe Cottage",
    description: "Spacious cottage with a private garden and modern amenities, perfect for families or small groups.",
    price: 150,
    capacity: 4,
    size: "450 sq ft",
    bedType: "1 King + 2 Singles",
    image: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=800&q=80",
    views: "Garden",
    amenities: [{
      icon: <Wifi size={16} />,
      label: "Free Wi-Fi"
    }, {
      icon: <Coffee size={16} />,
      label: "Coffee Maker"
    }, {
      icon: <Tv size={16} />,
      label: "Smart TV"
    }, {
      icon: <Users size={16} />,
      label: "Up to 4 Guests"
    }]
  }, {
    id: "riverside-suite",
    title: "Riverside Suite",
    description: "Elegant suite with panoramic views of the Kali River, featuring a private balcony and luxury furnishings.",
    price: 220,
    capacity: 2,
    size: "550 sq ft",
    bedType: "1 King",
    image: "/lovable-uploads/6b9bf7ef-20c4-4fa9-9f1a-2cd3310bf013.png",
    views: "River",
    amenities: [{
      icon: <Wifi size={16} />,
      label: "Free Wi-Fi"
    }, {
      icon: <Coffee size={16} />,
      label: "Premium Coffee"
    }, {
      icon: <Tv size={16} />,
      label: "Smart TV"
    }, {
      icon: <Users size={16} />,
      label: "Up to 2 Guests"
    }]
  }, {
    id: "treehouse-villa",
    title: "Treehouse Villa",
    description: "Elevated living experience with stunning canopy views, built sustainably around existing trees.",
    price: 280,
    capacity: 2,
    size: "400 sq ft",
    bedType: "1 Queen",
    image: "/lovable-uploads/a9ae304d-ac8b-4671-94c1-c3a3013a0711.png",
    views: "Forest Canopy",
    amenities: [{
      icon: <Wifi size={16} />,
      label: "Free Wi-Fi"
    }, {
      icon: <Coffee size={16} />,
      label: "Organic Tea & Coffee"
    }, {
      icon: <Tv size={16} />,
      label: "Smart TV"
    }, {
      icon: <Users size={16} />,
      label: "Up to 2 Guests"
    }]
  }, {
    id: "jungle-cabin",
    title: "Jungle Cabin",
    description: "Rustic yet comfortable cabins nestled in the jungle, offering an authentic wilderness experience.",
    price: 120,
    capacity: 3,
    size: "350 sq ft",
    bedType: "1 Queen + 1 Single",
    image: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=800&q=80",
    views: "Jungle",
    amenities: [{
      icon: <Wifi size={16} />,
      label: "Free Wi-Fi"
    }, {
      icon: <Coffee size={16} />,
      label: "Coffee Maker"
    }, {
      icon: <Tv size={16} />,
      label: "Smart TV"
    }, {
      icon: <Users size={16} />,
      label: "Up to 3 Guests"
    }]
  }, {
    id: "luxury-tent",
    title: "Luxury Safari Tent",
    description: "Spacious tents with hardwood floors, en-suite bathrooms, and all the comforts of a luxury room.",
    price: 180,
    capacity: 2,
    size: "400 sq ft",
    bedType: "1 King",
    image: "/lovable-uploads/7185274f-a6c4-4980-b354-5641039bc323.png",
    views: "Grassland",
    amenities: [{
      icon: <Wifi size={16} />,
      label: "Free Wi-Fi"
    }, {
      icon: <Coffee size={16} />,
      label: "Gourmet Coffee"
    }, {
      icon: <Tv size={16} />,
      label: "Bluetooth Speaker"
    }, {
      icon: <Users size={16} />,
      label: "Up to 2 Guests"
    }]
  }, {
    id: "family-bungalow",
    title: "Family Bungalow",
    description: "Spacious two-bedroom bungalow ideal for larger families or groups, with a private garden and outdoor dining area.",
    price: 320,
    capacity: 6,
    size: "750 sq ft",
    bedType: "2 Kings + 2 Singles",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80",
    views: "Garden & Forest",
    amenities: [{
      icon: <Wifi size={16} />,
      label: "Free Wi-Fi"
    }, {
      icon: <Coffee size={16} />,
      label: "Full Kitchen"
    }, {
      icon: <Tv size={16} />,
      label: "Smart TV"
    }, {
      icon: <Users size={16} />,
      label: "Up to 6 Guests"
    }]
  }];

  const filteredAccommodations = filter === 'all' ? accommodations : accommodations.filter(room => {
    if (filter === 'budget' && room.price < 150) return true;
    if (filter === 'standard' && room.price >= 150 && room.price < 250) return true;
    if (filter === 'luxury' && room.price >= 250) return true;
    return false;
  });

  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative h-[50vh] bg-accent text-accent-foreground overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 animate-fade-in">Accommodations</h1>
            <p className="text-xl max-w-2xl animate-fade-in animation-delay-200">
              Luxurious comfort embraced by wilderness
            </p>
          </div>
        </section>
        
        {/* Introduction */}
        <section className="py-16 container">
          <div className="max-w-3xl mx-auto text-center px-4 animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">
              Your Sanctuary in the Wilderness
            </h2>
            <p className="text-foreground/80">
              At Dandeli Adventures, we offer a range of accommodations designed to provide comfort while maintaining harmony with the natural surroundings. From riverside suites to treetop villas, each space is thoughtfully crafted to create a memorable stay. All rooms feature sustainable design elements, locally sourced furnishings, and modern amenities to ensure a comfortable and rejuvenating experience.
            </p>
          </div>
        </section>
        
        {/* Filters */}
        <section className="py-4 container px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
            {[{
            value: 'all',
            label: 'All Accommodations'
          }, {
            value: 'budget',
            label: 'Budget (Under $150)'
          }, {
            value: 'standard',
            label: 'Standard ($150-$250)'
          }, {
            value: 'luxury',
            label: 'Luxury (Above $250)'
          }].map(option => <button key={option.value} onClick={() => setFilter(option.value)} className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${filter === option.value ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground/70 hover:bg-secondary/80'}`}>
                {option.label}
              </button>)}
          </div>
        </section>
        
        {/* Accommodations Grid */}
        <section className="py-8 container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccommodations.map((room, index) => <RoomCard key={room.id} image={room.image} title={room.title} description={room.description} price={room.price} capacity={room.capacity} amenities={room.amenities} delay={index * 100} />)}
          </div>
          
          {filteredAccommodations.length === 0 && <div className="text-center py-12">
              <p className="text-foreground/70">
                No accommodations match your current filter. Please try another category.
              </p>
              <button onClick={() => setFilter('all')} className="mt-4 px-6 py-2 bg-accent text-accent-foreground rounded-md">
                View All Accommodations
              </button>
            </div>}
        </section>
        
        {/* Amenities */}
        <section className="py-20 bg-secondary">
          <div className="container px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Resort Amenities
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Enjoy these facilities during your stay at Dandeli Adventures
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
              title: "Wilderness Dining",
              description: "Farm-to-table cuisine featuring local ingredients and traditional recipes.",
              image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
            }, {
              title: "Infinity Pool",
              description: "A stunning pool overlooking the river, perfect for relaxation after adventures.",
              image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80"
            }, {
              title: "Wellness Spa",
              description: "Rejuvenating treatments using organic products and traditional techniques.",
              image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80"
            }].map((amenity, index) => <div key={index} className="rounded-xl overflow-hidden shadow-md bg-white animate-fade-in" style={{
              animationDelay: `${index * 200}ms`
            }}>
                  <div className="aspect-video">
                    <img src={amenity.image} alt={amenity.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-semibold mb-2">
                      {amenity.title}
                    </h3>
                    <p className="text-foreground/70">
                      {amenity.description}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        
        {/* Policies */}
        <section className="py-20 container">
          <div className="max-w-4xl mx-auto px-4 animate-slide-up">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              Accommodation Policies
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Check-in & Check-out</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>Check-in time: 12:00 PM</li>
                  <li>Check-out time: 11:00 AM (Max 24hrs)</li>
                  <li>Early check-in and late check-out available upon request (subject to availability)</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Booking & Cancellation</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>Advance booking recommended, especially during peak season (October to March)</li>
                  <li>30% deposit required at the time of booking</li>
                  <li>Free cancellation up to 7 days before arrival</li>
                  <li>Cancellations within 7 days of arrival are subject to a one-night charge</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Additional Information</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>All accommodations are non-smoking</li>
                  <li>Pets are not permitted (due to proximity to wildlife sanctuary)</li>
                  <li>Children of all ages are welcome</li>
                  <li>Eco-friendly practices are followed throughout the resort</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-accent text-accent-foreground">
          <div className="container px-4 text-center">
            <div className="max-w-2xl mx-auto animate-fade-in">
              <h2 className="text-3xl font-display font-bold mb-4">
                Ready to Book Your Stay?
              </h2>
              <p className="text-xl mb-8 text-accent-foreground/90">
                Secure your perfect accommodation now
              </p>
              <Link to="/booking" className="inline-block px-8 py-4 bg-white text-accent font-medium text-lg rounded-md transition-all duration-300 hover:bg-white/90 hover:shadow-lg">
                Book Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};

export default Accommodation;

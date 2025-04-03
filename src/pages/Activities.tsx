
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Filter, ArrowRight, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ActivityCard from '@/components/ActivityCard';
import { useActivities } from '@/hooks/useActivities';

const Activities: React.FC = () => {
  const { activities, isLoading, isError } = useActivities();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<boolean>(false);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  
  // Sample activities data as fallback if database isn't populated yet
  const sampleActivities = [
    {
      id: "game-drive",
      title: "Game Drive Safari",
      description: "Experience the thrill of spotting Africa's Big Five on our guided game drives in Kenya's world-famous Maasai Mara National Reserve.",
      image: "/lovable-uploads/dc56b3d5-8de2-40a9-b259-35829487f125.png",
      duration: "3-4 hours",
      difficulty: "Easy",
      groupSize: "4-8 people",
      rating: 4.9,
      price: 85,
      category: "safari"
    },
    {
      id: "great-migration",
      title: "Great Migration Experience",
      description: "Witness one of nature's most spectacular events as millions of wildebeest and zebra cross the Mara River during their annual migration.",
      image: "/lovable-uploads/003350e1-bba1-4aed-9001-4acf317067fb.png",
      duration: "Full day",
      difficulty: "Easy",
      groupSize: "4-6 people",
      rating: 5.0,
      price: 120,
      category: "safari"
    },
    {
      id: "walking-safari",
      title: "Walking Safari",
      description: "Walk alongside Maasai guides as they share their ancestral knowledge of the savanna, its plants, animals, and survival techniques.",
      image: "/lovable-uploads/41b176ee-c1a4-467f-8c90-a34ecc92fb8b.png",
      duration: "2-3 hours",
      difficulty: "Moderate",
      groupSize: "4-8 people",
      rating: 4.6,
      price: 60,
      category: "adventure"
    },
    {
      id: "balloon-safari",
      title: "Hot Air Balloon Safari",
      description: "Soar above the plains at dawn for a bird's eye view of Kenya's magnificent landscapes and wildlife, followed by a champagne breakfast.",
      image: "/lovable-uploads/504eed73-ca66-4273-aa1a-905482b892fe.png",
      duration: "3-4 hours",
      difficulty: "Easy",
      groupSize: "8-16 people",
      rating: 4.8,
      price: 450,
      category: "air"
    },
    {
      id: "maasai-village",
      title: "Maasai Village Visit",
      description: "Immerse yourself in authentic Maasai culture with a visit to a local village, where you can learn about their traditions, dances, and way of life.",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80",
      duration: "Half day",
      difficulty: "Easy",
      groupSize: "6-12 people",
      rating: 4.7,
      price: 45,
      category: "cultural"
    },
    {
      id: "night-safari",
      title: "Night Safari Adventure",
      description: "Explore the savanna after dark to encounter nocturnal wildlife such as lions on the hunt, hyenas, bush babies, and other creatures of the night.",
      image: "/lovable-uploads/8fe5892b-b9ce-440c-8423-786ee90235e7.png",
      duration: "3 hours",
      difficulty: "Easy",
      groupSize: "4-8 people",
      rating: 4.5,
      price: 95,
      category: "safari"
    },
    {
      id: "photography",
      title: "Wildlife Photography Tour",
      description: "Join our professional wildlife photographer for specialized safari focused on capturing stunning images of Kenya's iconic wildlife and landscapes.",
      image: "/lovable-uploads/a86fb74f-d5e7-48b5-a676-777476545216.png",
      duration: "Full day",
      difficulty: "Easy",
      groupSize: "3-6 people",
      rating: 4.9,
      price: 180,
      category: "safari"
    },
    {
      id: "conservation",
      title: "Conservation Experience",
      description: "Participate in our conservation activities including wildlife monitoring, anti-poaching efforts, and community education programs.",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80",
      duration: "Half day",
      difficulty: "Moderate",
      groupSize: "4-10 people",
      rating: 4.8,
      price: 75,
      category: "conservation"
    }
  ];
  
  const categories = [
    { id: "all", label: "All Activities" },
    { id: "safari", label: "Safari Experiences" },
    { id: "adventure", label: "Adventure Activities" },
    { id: "air", label: "Aerial Experiences" },
    { id: "cultural", label: "Cultural Experiences" },
    { id: "conservation", label: "Conservation" }
  ];
  
  const difficulties = [
    { id: "all", label: "All Levels" },
    { id: "Easy", label: "Easy" },
    { id: "Moderate", label: "Moderate" },
    { id: "Challenging", label: "Challenging" }
  ];
  
  useEffect(() => {
    const activitiesToFilter = activities && activities.length > 0 ? activities : sampleActivities;
    
    let filtered = [...activitiesToFilter];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(activity => activity.difficulty === selectedDifficulty);
    }
    
    setFilteredActivities(filtered);
  }, [selectedCategory, selectedDifficulty, activities]);
  
  const toggleFilter = () => {
    setActiveFilter(!activeFilter);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/003350e1-bba1-4aed-9001-4acf317067fb.png" 
              alt="Kenyan Safari" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative container h-full flex flex-col justify-center items-center text-center text-white p-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 animate-slide-down">
              Discover Wild Kenya
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in animation-delay-200">
              Embark on unforgettable safari adventures in the heart of East Africa's most spectacular wildlife reserves
            </p>
            <Link 
              to="/booking" 
              className="bg-white text-accent px-8 py-3 rounded-md font-medium text-lg transition-all duration-300 hover:bg-white/90 hover:shadow-lg animate-slide-up animation-delay-400"
            >
              Book Your Safari
            </Link>
          </div>
        </section>
        
        {/* Activities Section */}
        <section className="py-16 px-4 container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Explore Our Safari Activities
              </h2>
              <p className="text-foreground/70 max-w-xl">
                From thrilling game drives to cultural experiences, discover the wonders of Kenya's wildlife and heritage.
              </p>
            </div>
            
            <Button 
              onClick={toggleFilter}
              variant="outline" 
              className="flex items-center gap-2 md:self-start"
            >
              <Filter size={16} /> Filters
            </Button>
          </div>
          
          {/* Filter Section */}
          <div className={cn(
            "bg-card p-6 rounded-lg shadow-md mb-8 transition-all duration-300 overflow-hidden",
            activeFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge 
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Difficulty Level</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(difficulty => (
                    <Badge 
                      key={difficulty.id}
                      variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                    >
                      {difficulty.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Activities Grid */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">Loading activities...</h3>
                <p className="text-foreground/70">Please wait</p>
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">Error loading activities</h3>
                <p className="text-foreground/70">Please try again later</p>
              </div>
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <ActivityCard 
                  key={activity.id}
                  id={activity.id}
                  image={activity.image}
                  title={activity.title}
                  description={activity.description}
                  duration={activity.duration}
                  difficulty={activity.difficulty as 'Easy' | 'Moderate' | 'Challenging'}
                  groupSize={activity.groupSize}
                  rating={activity.rating}
                  price={activity.price}
                  delay={index * 100}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No activities found</h3>
                <p className="text-foreground/70">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Safari Guidelines Section */}
        <section className="bg-secondary py-16 px-4">
          <div className="container">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              Safari Guidelines
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Safety First",
                  description: "Always follow your guide's instructions and never leave the vehicle unless instructed it's safe to do so.",
                  image: "/lovable-uploads/61d7b6e2-720c-42fc-a459-7624b56b81d0.png"
                },
                {
                  title: "Respect Wildlife",
                  description: "Maintain a respectful distance from animals, keep noise to a minimum, and never feed wildlife.",
                  image: "https://images.unsplash.com/photo-1471005197911-88e9d4a7834d?auto=format&fit=crop&w=400&q=80"
                },
                {
                  title: "What to Bring",
                  description: "Neutral-colored clothing, hat, sunscreen, binoculars, camera, and insect repellent are essential for your safari.",
                  image: "https://images.unsplash.com/photo-1581912492723-688317ba2162?auto=format&fit=crop&w=400&q=80"
                },
                {
                  title: "Booking Policy",
                  description: "Advance booking is required. Cancellations need to be made 48 hours prior for a full refund.",
                  image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80"
                }
              ].map((guideline, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg overflow-hidden shadow-md animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={guideline.image} 
                      alt={guideline.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-semibold mb-2">
                      {guideline.title}
                    </h3>
                    <p className="text-foreground/70">
                      {guideline.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-accent text-accent-foreground relative">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/003350e1-bba1-4aed-9001-4acf317067fb.png')] bg-cover bg-center opacity-20"></div>
          <div className="container relative z-10 px-4 text-center">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Ready for Your Kenyan Safari?
              </h2>
              <p className="text-xl mb-8 text-accent-foreground/90">
                Book your adventure now and witness the magic of Kenya's wildlife up close.
              </p>
              <Link 
                to="/booking" 
                className="inline-block px-8 py-4 bg-white text-accent font-medium text-lg rounded-md transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:translate-y-[-2px]"
              >
                Book Your Safari
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Activities;

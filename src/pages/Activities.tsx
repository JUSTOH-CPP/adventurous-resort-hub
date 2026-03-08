
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Filter, ArrowRight, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ActivityCard from '@/components/ActivityCard';
import { useActivities } from '@/hooks/useActivities';
import type { Activity } from '@/types/supabase';

const Activities: React.FC = () => {
  const { activities, isLoading, isError } = useActivities();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<boolean>(false);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  
  const categories = [
    { id: "all", label: "All Activities" },
    { id: "safari", label: "Safari" },
    { id: "adventure", label: "Adventure" },
    { id: "air", label: "Aerial" },
    { id: "cultural", label: "Cultural" },
    { id: "conservation", label: "Conservation" },
    { id: "wildlife", label: "Wildlife" },
    { id: "water", label: "Water" }
  ];
  
  const difficulties = [
    { id: "all", label: "All Levels" },
    { id: "Easy", label: "Easy" },
    { id: "Moderate", label: "Moderate" },
    { id: "Challenging", label: "Challenging" }
  ];
  
  useEffect(() => {
    let filtered = [...activities];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(a => a.difficulty === selectedDifficulty);
    }
    setFilteredActivities(filtered);
  }, [selectedCategory, selectedDifficulty, activities]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-accent">
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center text-accent-foreground p-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-slide-down">Discover Activities</h1>
            <p className="text-lg md:text-xl max-w-2xl animate-fade-in">
              Explore our curated safari and adventure experiences
            </p>
          </div>
        </section>
        
        {/* Activities Section */}
        <section className="py-16 px-4 container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Activities</h2>
              <p className="text-muted-foreground max-w-xl">Browse and book from our available experiences.</p>
            </div>
            <Button onClick={() => setActiveFilter(!activeFilter)} variant="outline" className="flex items-center gap-2">
              <Filter size={16} /> Filters
            </Button>
          </div>
          
          {/* Filters */}
          <div className={cn(
            "bg-card p-6 rounded-lg shadow-md mb-8 transition-all duration-300 overflow-hidden",
            activeFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <Badge key={c.id} variant={selectedCategory === c.id ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(c.id)}>
                      {c.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(d => (
                    <Badge key={d.id} variant={selectedDifficulty === d.id ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedDifficulty(d.id)}>
                      {d.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading activities...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <p className="text-destructive">Error loading activities. Please try again later.</p>
              </div>
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <ActivityCard 
                  key={activity.id}
                  id={activity.id}
                  image={activity.image || ''}
                  title={activity.name}
                  description={activity.description || ''}
                  duration={`${activity.duration} min`}
                  difficulty={(activity.difficulty as 'Easy' | 'Moderate' | 'Challenging') || 'Easy'}
                  groupSize={activity.groupSize || 'Flexible'}
                  rating={activity.rating ?? undefined}
                  price={activity.price}
                  delay={index * 100}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No activities found</h3>
                <p className="text-muted-foreground">
                  {activities.length === 0 ? "No activities have been added yet. Check back soon!" : "Try adjusting your filters."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Activities;

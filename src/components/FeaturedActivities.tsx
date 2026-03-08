
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivities } from '@/hooks/useActivities';

type ActivityProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  delay: number;
}

const ActivityCardPreview: React.FC<ActivityProps> = ({ title, description, image, link, delay }) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl shadow-md transition-all duration-500 animate-fade-in",
        "hover:shadow-xl card-hover"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <img src={image || '/placeholder.svg'} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 p-6 w-full">
        <h3 className="text-2xl font-display font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/80 mb-4 line-clamp-2">{description}</p>
        <Link to={link} className="inline-flex items-center text-white group-hover:translate-x-1 transition-transform duration-300">
          Explore <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

const FeaturedActivities: React.FC = () => {
  const { activities, isLoading } = useActivities();
  
  const featured = activities.slice(0, 4);
  
  if (isLoading || featured.length === 0) return null;
  
  return (
    <section className="section-padding container">
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Experiences</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the thrill and tranquility of our curated adventures.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((activity, index) => (
          <ActivityCardPreview 
            key={activity.id}
            title={activity.name}
            description={activity.description || ''}
            image={activity.image || '/placeholder.svg'}
            link={`/activities`}
            delay={index * 100}
          />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Link to="/activities" className="btn-primary inline-flex items-center">
          View All Activities <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedActivities;

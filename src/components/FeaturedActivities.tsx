
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivityProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  delay: number;
}

const ActivityCard: React.FC<ActivityProps> = ({ title, description, image, link, delay }) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl shadow-md transition-all duration-500 animate-fade-in",
        "hover:shadow-xl card-hover"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 p-6 w-full">
        <h3 className="text-2xl font-display font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/80 mb-4 line-clamp-2">{description}</p>
        <Link 
          to={link}
          className="inline-flex items-center text-white group-hover:translate-x-1 transition-transform duration-300"
        >
          Explore <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

const FeaturedActivities: React.FC = () => {
  const activities = [
    {
      id: 1,
      title: "Safari Game Drive",
      description: "Experience the thrill of seeing the Big Five in Kenya's world-famous Maasai Mara.",
      image: "/lovable-uploads/003350e1-bba1-4aed-9001-4acf317067fb.png",
      link: "/activities#safari-game-drive"
    },
    {
      id: 2,
      title: "Great Migration",
      description: "Witness one of nature's most spectacular events as millions of wildebeest cross the Mara River.",
      image: "/lovable-uploads/dc56b3d5-8de2-40a9-b259-35829487f125.png",
      link: "/activities#great-migration"
    },
    {
      id: 3,
      title: "Maasai Cultural Visit",
      description: "Discover the rich traditions and customs of Kenya's iconic Maasai people.",
      image: "/lovable-uploads/41b176ee-c1a4-467f-8c90-a34ecc92fb8b.png",
      link: "/activities#maasai-culture"
    },
    {
      id: 4,
      title: "Hot Air Balloon Safari",
      description: "Soar above the Maasai Mara at dawn for breathtaking views of wildlife and landscapes.",
      image: "/lovable-uploads/504eed73-ca66-4273-aa1a-905482b892fe.png",
      link: "/activities#balloon-safari"
    }
  ];
  
  return (
    <section className="section-padding container">
      <div className="text-center mb-16 animate-slide-up">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Experiences</h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Discover the thrill and tranquility of our curated adventures in the heart of Kenya's magnificent wilderness.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((activity, index) => (
          <ActivityCard 
            key={activity.id}
            title={activity.title}
            description={activity.description}
            image={activity.image}
            link={activity.link}
            delay={index * 100}
          />
        ))}
      </div>
      
      <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <Link 
          to="/activities" 
          className="btn-primary inline-flex items-center"
        >
          View All Activities <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedActivities;

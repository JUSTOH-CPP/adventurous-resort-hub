
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SlideData = {
  id: number;
  imageSrc: string;
  title: string;
  subtitle: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    imageSrc: '/lovable-uploads/44997248-2a7d-4c4b-8656-13d704d35b37.png',
    title: 'Luxury Safari Lodges',
    subtitle: 'Experience unparalleled comfort with stunning views of the Maasai Mara'
  },
  {
    id: 2,
    imageSrc: '/lovable-uploads/cc6dd7ad-c5fb-4fef-9dd0-f8dca5d5a10d.png',
    title: 'Spectacular Wildlife',
    subtitle: 'Witness the majesty of Kenya\'s Big Five in their natural habitat'
  },
  {
    id: 3,
    imageSrc: '/lovable-uploads/968e9c7f-6872-4c43-ad59-1dd92c92d29a.png',
    title: 'Guided Safari Adventures',
    subtitle: 'Explore Kenya\'s national parks with expert Maasai guides'
  },
  {
    id: 4,
    imageSrc: '/lovable-uploads/003350e1-bba1-4aed-9001-4acf317067fb.png', 
    title: 'Great Migration',
    subtitle: 'Experience the wonder of the wildebeest migration across the Mara River'
  },
  {
    id: 5,
    imageSrc: '/lovable-uploads/b4c6f3a5-3500-43ad-97e1-e69041317e64.png', 
    title: 'Hot Air Balloon Safaris',
    subtitle: 'Soar above the savanna at dawn for breathtaking panoramic views'
  },
  {
    id: 6,
    imageSrc: '/lovable-uploads/d6a0abf8-3fb5-4717-9fff-6a3a99f2becf.png',
    title: 'Mountain Adventures',
    subtitle: 'Trek through Kenya\'s beautiful mountains and valleys'
  },
  {
    id: 7,
    imageSrc: '/lovable-uploads/fa6d6df3-ea4b-4f3f-9db1-81fbb2370f9f.png',
    title: 'Authentic Cultural Experiences',
    subtitle: 'Connect with local Maasai communities and learn about their traditions'
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds interval for images
    
    return () => clearInterval(interval);
  }, []);
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Image Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1500 ease-in-out',
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transform transition-transform duration-10000 scale-105"
            style={{ 
              backgroundImage: `url(${slide.imageSrc})`,
              transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-20">
            <h1 
              className={cn(
                "text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white max-w-5xl leading-tight mb-4",
                "transition-all duration-700 transform",
                currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
            >
              {slide.title}
            </h1>
            <p 
              className={cn(
                "text-lg md:text-xl text-white/90 max-w-2xl mb-8",
                "transition-all duration-700 delay-300 transform",
                currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
            >
              {slide.subtitle}
            </p>
            <div 
              className={cn(
                "transition-all duration-700 delay-500 transform",
                currentSlide === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
            >
              <Link 
                to="/booking" 
                className="btn-primary text-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                Book Your Adventure
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300 transform',
              currentSlide === index 
                ? 'bg-white scale-125 shadow-glow' 
                : 'bg-white/50 hover:bg-white/80 hover:scale-110'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-[slide-down_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default Hero;

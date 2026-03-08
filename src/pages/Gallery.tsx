
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
      alt: "Lions resting in the Masai Mara",
      category: "wildlife"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=800&q=80",
      alt: "Elephants at Amboseli with Mt Kilimanjaro",
      category: "wildlife"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      alt: "Zebras on the savanna",
      category: "wildlife"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=800&q=80",
      alt: "Wildebeest migration crossing the Mara River",
      category: "wildlife"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=800&q=80",
      alt: "Kenyan sunset over the savanna",
      category: "landscape"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1611601322175-ef8db9e3e30a?auto=format&fit=crop&w=800&q=80",
      alt: "Giraffes in Nairobi National Park",
      category: "wildlife"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=800&q=80",
      alt: "Flamingos at Lake Nakuru",
      category: "wildlife"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?auto=format&fit=crop&w=800&q=80",
      alt: "Maasai people in traditional dress",
      category: "culture"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1528277342758-f1d7613953a2?auto=format&fit=crop&w=800&q=80",
      alt: "Diani Beach, Kenyan coast",
      category: "beach"
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
      alt: "Cheetah in the wild",
      category: "wildlife"
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1612880484613-a9e4a005551e?auto=format&fit=crop&w=800&q=80",
      alt: "Mount Kenya at sunrise",
      category: "landscape"
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&w=800&q=80",
      alt: "Safari jeep on dusty trail",
      category: "adventure"
    }
  ];

  const openModal = (src: string) => {
    setSelectedImage(src);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const getCurrentIndex = () => {
    if (!selectedImage) return -1;
    return galleryImages.findIndex(img => img.src === selectedImage);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    const currentIndex = getCurrentIndex();
    if (currentIndex === -1) return;

    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % galleryImages.length 
      : (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    
    setSelectedImage(galleryImages[newIndex].src);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Gallery</h1>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Explore the breathtaking natural beauty of Kenya through our collection of stunning photographs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div 
                key={image.id} 
                className="relative overflow-hidden rounded-lg shadow-md group hover-scale"
                onClick={() => openModal(image.src)}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                    <p className="font-display text-lg">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full">
            <button onClick={closeModal} className="absolute -top-12 right-0 text-white p-2 hover:text-gray-300 transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => navigateImage('prev')} 
                className="bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="flex-grow flex justify-center mx-2">
                <img 
                  src={selectedImage} 
                  alt="Gallery image" 
                  className="max-h-[80vh] object-contain" 
                />
              </div>
              
              <button 
                onClick={() => navigateImage('next')} 
                className="bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors"
              >
                <ArrowRight size={24} />
              </button>
            </div>
            
            <div className="text-center text-white mt-4">
              <p>{getCurrentIndex() + 1} / {galleryImages.length}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;


import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Calendar, Users, Tag, Clock } from 'lucide-react';

interface OfferProps {
  title: string;
  description: string;
  promoCode: string;
  discount: string;
  validUntil: string;
  imageUrl: string;
  color: string;
}

const Offer: React.FC<OfferProps> = ({
  title,
  description,
  promoCode,
  discount,
  validUntil,
  imageUrl,
  color
}) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute top-0 right-0 bg-gradient-to-bl from-opacity-100 to-opacity-0 p-3 rounded-bl-lg z-10"
          style={{ background: `linear-gradient(to bottom left, ${color}, transparent)` }}
        >
          <div className="font-bold text-white text-lg">{discount}</div>
          <div className="text-white text-xs">OFF</div>
        </div>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Tag size={14} className="text-muted-foreground" />
            <span>Code: <span className="font-mono font-medium">{promoCode}</span></span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-muted-foreground" />
            <span>Valid till: {validUntil}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/booking?promo=${promoCode}`}>Book This Offer</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const SpecialOffers: React.FC = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-block mb-4">Limited Time</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Special Offers & Discounts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take advantage of our exclusive deals and save on your next adventure in the Maasai Mara.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Offer 
            title="Migration Season Special"
            description="Experience the Great Migration with our premium safari package and exclusive viewing locations."
            promoCode="MIGRATION20"
            discount="20%"
            validUntil="Oct 31, 2026"
            imageUrl="/lovable-uploads/003350e1-bba1-4aed-9001-4acf317067fb.png"
            color="#3949ab"
          />
          
          <Offer 
            title="Early Bird Safari"
            description="Book at least 30 days in advance and get an exclusive discount on all safari packages."
            promoCode="EARLYBIRD10"
            discount="10%"
            validUntil="Dec 31, 2025"
            imageUrl="/lovable-uploads/dc56b3d5-8de2-40a9-b259-35829487f125.png"
            color="#43a047"
          />
          
          <Offer 
            title="Family Adventure"
            description="Bring your family on safari with special rates for children and custom family activities."
            promoCode="FAMILY25"
            discount="25%"
            validUntil="Jun 30, 2025"
            imageUrl="/lovable-uploads/eab0dff8-9904-4338-ae38-67e97ade71cf.png"
            color="#ef6c00"
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;

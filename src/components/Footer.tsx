import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 px-4">
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-display font-semibold">Safari Adventures</h3>
            <p className="text-accent-foreground/80 max-w-xs">
              Discover a world of adventure and tranquility nestled in the heart of nature's paradise.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in animation-delay-200">
            <h4 className="text-lg font-display font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Accommodation', 'Activities', 'Gallery', 'Contact'].map(item => <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-accent-foreground/80 hover:text-accent-foreground transition-colors duration-300 inline-block py-1">
                    {item}
                  </Link>
                </li>)}
            </ul>
          </div>
          
          <div className="space-y-4 animate-fade-in animation-delay-400">
            <h4 className="text-lg font-display font-semibold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span className="text-accent-foreground/80">
                  Dandeli Wildlife Sanctuary, Karnataka, India - 581325
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0" />
                <span className="text-accent-foreground/80">+91 8277385225  
+91 7795601255</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0" />
                <span className="text-accent-foreground/80 text-base">dandeliadventures.in@gmail.com
              </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4 animate-fade-in animation-delay-600">
            <h4 className="text-lg font-display font-semibold">Newsletter</h4>
            <p className="text-accent-foreground/80 mx-0 my-0 px-0 py-0 rounded-lg">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="mt-4 space-y-3">
              <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-accent-foreground focus:outline-none focus:ring-2 focus:ring-white/30" />
              <button type="submit" className="w-full px-4 py-2 rounded-md bg-white text-accent font-medium transition-all duration-300 hover:bg-white/90">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 py-6 px-4 text-center text-accent-foreground/70">
          <p>© {currentYear} Dandeli Adventures. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
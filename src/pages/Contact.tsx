
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible!",
      duration: 5000,
    });
    
    // Reset form after submission
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1974')",
              backgroundPosition: "center 30%" 
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="container relative h-full flex flex-col justify-center items-center text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">Contact Us</h1>
            <p className="text-lg md:text-xl max-w-2xl animate-slide-up animation-delay-200">
              Reach out to us for safari bookings, inquiries, or to plan your perfect Kenyan adventure
            </p>
          </div>
        </div>
        
        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-display font-semibold mb-6">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full text-green-700">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Main Office</h3>
                        <p className="text-muted-foreground">
                          Maasai Adventures, Ngong Road, Karen, Nairobi, Kenya - 00200
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full text-green-700">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <a href="tel:+254722123456" className="text-green-700 hover:underline">
                          +254 722 123 456
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full text-green-700">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <a href="mailto:info@maasaiadventures.co.ke" className="text-green-700 hover:underline">
                          info@maasaiadventures.co.ke
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full text-green-700">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Office Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 8:00 AM - 6:00 PM<br />
                          Saturday: 9:00 AM - 3:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Map */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-display font-semibold mb-4">Find Us</h3>
                  <div className="aspect-video bg-muted rounded-md overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7194524820314!2d36.74239997424696!3d-1.352499035953563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a6bf7554e81%3A0x940b62a3c8efde4c!2sKaren%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1682349053364!5m2!1sen!2ske" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-display font-semibold mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      >
                        <option value="">Select a subject</option>
                        <option value="safari-booking">Safari Booking Inquiry</option>
                        <option value="accommodation">Accommodation Inquiry</option>
                        <option value="custom-itinerary">Custom Safari Itinerary</option>
                        <option value="general">General Information</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      ></textarea>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-semibold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How do I book a safari?",
                  answer: "You can book a safari directly through our website's booking page or contact our team via phone or email for a custom itinerary."
                },
                {
                  question: "What's the best time to visit Kenya for safaris?",
                  answer: "The best time is during the dry seasons (January-February and June-October) when wildlife viewing is optimal and the Great Migration occurs."
                },
                {
                  question: "Do you offer airport transfers?",
                  answer: "Yes, we offer pickup and drop services from Jomo Kenyatta International Airport and Wilson Airport in Nairobi."
                },
                {
                  question: "What should I pack for a Kenyan safari?",
                  answer: "Lightweight, neutral-colored clothing, hat, sunscreen, insect repellent, binoculars, and a good camera are essential. We provide a detailed packing list after booking."
                },
                {
                  question: "Is Kenya safe for tourists?",
                  answer: "Yes, Kenya's national parks and tourist areas are safe. We prioritize guest safety with experienced guides and follow all recommended security protocols."
                },
                {
                  question: "Do I need vaccinations to visit Kenya?",
                  answer: "Yellow fever vaccination is required, and we recommend malaria prophylaxis. Consult your healthcare provider before traveling."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Kenya Tourism Board */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-display font-semibold mb-6">Official Tourism Partners</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 max-w-3xl mx-auto">
              <div className="p-4 opacity-80 hover:opacity-100 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1682687220305-ce8a9ab237b1?auto=format&fit=crop&w=200&q=80"
                  alt="Kenya Tourism Board" 
                  className="h-16 w-auto mx-auto"
                />
                <p className="text-sm mt-2">Kenya Tourism Board</p>
              </div>
              <div className="p-4 opacity-80 hover:opacity-100 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1682687220305-ce8a9ab237b1?auto=format&fit=crop&w=200&q=80" 
                  alt="Kenya Wildlife Service" 
                  className="h-16 w-auto mx-auto"
                />
                <p className="text-sm mt-2">Kenya Wildlife Service</p>
              </div>
              <div className="p-4 opacity-80 hover:opacity-100 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1682687220305-ce8a9ab237b1?auto=format&fit=crop&w=200&q=80" 
                  alt="Eco Tourism Kenya" 
                  className="h-16 w-auto mx-auto"
                />
                <p className="text-sm mt-2">Eco Tourism Kenya</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;

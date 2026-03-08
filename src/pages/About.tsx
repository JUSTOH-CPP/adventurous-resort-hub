
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Leaf, Shield, Award, Users, Heart, BookOpen, Map, Calendar, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';

const About: React.FC = () => {
  const teamMembers = [{
    name: "Otieno Odhiambo",
    role: "Founder & Managing Director",
    bio: "A Luo native from Kisumu, Otieno spent his youth along Lake Victoria before pursuing wildlife management. With 18 years in safari tourism, he built Maasai Adventures from the ground up.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  }, {
    name: "Njeri Kamau",
    role: "Head of Operations",
    bio: "Born in Nyeri at the foot of Mount Kenya, Njeri brings 10 years of hospitality expertise. She ensures every guest receives world-class service from booking to departure.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80"
  }, {
    name: "Kipchoge Langat",
    role: "Lead Safari Guide",
    bio: "A Kalenjin from Kericho, Kipchoge grew up tracking wildlife in the Rift Valley. His 14 years of guiding experience and deep knowledge of animal behaviour make every safari unforgettable.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  }, {
    name: "Akinyi Wafula",
    role: "Conservation & Community Lead",
    bio: "Raised in a farming community near Kakamega Forest, Akinyi holds a degree in Environmental Science from the University of Nairobi. She leads anti-poaching and community outreach programmes.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
  }];
  
  const timeline = [{
    year: "2005",
    title: "Our Beginning",
    description: "Maasai Adventures was founded with just two safari vehicles and a dream to share Kenya's wildlife wonders with the world."
  }, {
    year: "2010",
    title: "Conservation Focus",
    description: "Launched our anti-poaching unit and community conservation education program in partnership with Kenya Wildlife Service."
  }, {
    year: "2015",
    title: "Expansion",
    description: "Expanded our luxury tented camps and introduced hot air balloon safaris and cultural immersion experiences."
  }, {
    year: "2019",
    title: "Sustainability Award",
    description: "Received the Eco-Tourism Kenya Gold Award for sustainable tourism practices and community development."
  }, {
    year: "2023",
    title: "Today",
    description: "Now a leader in responsible safari tourism with over 20 unique experiences while protecting over 50,000 acres of wildlife habitat."
  }];
  
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative py-20 mb-8">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 bg-lime-600"></div>
          <div className="relative z-10 container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in hover:text-glow transition-all duration-300">
              Our Story
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 animate-fade-in animation-delay-200">
              Discover the journey of Maasai Adventures, from a small family business to becoming Kenya's premier safari and conservation company.
            </p>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="section-padding container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="relative">
                <img src="/lovable-uploads/fa6d6df3-ea4b-4f3f-9db1-81fbb2370f9f.png" alt="Kenya Wildlife" className="w-full h-[500px] object-cover rounded-xl shadow-lg" />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl hidden md:block">
                  <img src="/lovable-uploads/627761c4-60f7-43ef-864e-7bfaab1c1dc6.png" alt="Safari Experience" className="w-40 h-32 object-cover rounded-md" />
                </div>
              </div>
            </div>
            
            <div className="animate-slide-up animation-delay-200">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Our Mission & Vision
              </h2>
              <p className="text-foreground/70 mb-6">
                At Maasai Adventures, we're committed to creating transformative safari experiences that connect people with Kenya's magnificent wildlife while ensuring its conservation for future generations.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="bg-secondary p-6 rounded-xl transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-2">
                    <Heart size={22} className="text-accent mr-2" />
                    <h3 className="font-display text-xl font-semibold">Our Mission</h3>
                  </div>
                  <p className="text-foreground/70">
                    To provide unforgettable safari experiences that inspire conservation awareness while directly contributing to wildlife protection and community development.
                  </p>
                </div>
                
                <div className="bg-secondary p-6 rounded-xl transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-2">
                    <BookOpen size={22} className="text-accent mr-2" />
                    <h3 className="font-display text-xl font-semibold">Our Vision</h3>
                  </div>
                  <p className="text-foreground/70">
                    To be a global model for responsible safari tourism that demonstrates how wildlife conservation, community empowerment, and authentic tourism can thrive together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Conservation Efforts */}
        <section className="py-20 bg-white">
          <div className="container px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Our Conservation Efforts
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Maasai Adventures is committed to protecting Kenya's wildlife and supporting local communities through these key initiatives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
                <img 
                  src="https://images.unsplash.com/photo-1504173010664-32509aeebb62?auto=format&fit=crop&w=600&q=80" 
                  alt="Anti-poaching" 
                  className="w-full h-56 object-cover rounded-lg mb-5"
                />
                <h3 className="text-xl font-display font-semibold mb-3">Anti-Poaching Unit</h3>
                <p className="text-foreground/70 mb-4">
                  Our dedicated team of rangers patrol protected areas to prevent poaching, especially targeting rhino and elephant populations. We've helped reduce poaching by 70% in our areas of operation.
                </p>
                <div className="font-semibold text-accent">10% of all safari bookings directly fund our anti-poaching efforts</div>
              </div>
              
              <div className="bg-secondary p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in" style={{animationDelay: '100ms'}}>
                <img 
                  src="https://images.unsplash.com/photo-1541688669813-3b99f1e6adf6?auto=format&fit=crop&w=600&q=80" 
                  alt="Wildlife research" 
                  className="w-full h-56 object-cover rounded-lg mb-5"
                />
                <h3 className="text-xl font-display font-semibold mb-3">Wildlife Research</h3>
                <p className="text-foreground/70 mb-4">
                  In partnership with the Kenya Wildlife Service and international universities, we conduct vital research on endangered species including lions, cheetahs, and rhinoceros.
                </p>
                <div className="font-semibold text-accent">Our guests can participate in citizen science initiatives during their safaris</div>
              </div>
              
              <div className="bg-secondary p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in" style={{animationDelay: '200ms'}}>
                <img 
                  src="https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80" 
                  alt="Community education" 
                  className="w-full h-56 object-cover rounded-lg mb-5"
                />
                <h3 className="text-xl font-display font-semibold mb-3">Community Education</h3>
                <p className="text-foreground/70 mb-4">
                  We provide conservation education in local schools and create alternative livelihoods for communities traditionally dependent on activities that might harm wildlife.
                </p>
                <div className="font-semibold text-accent">Over 5,000 students participate in our programs annually</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Core Values */}
        <section className="py-20 bg-secondary">
          <div className="container px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Our Core Values
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                The guiding principles that define everything we do at Maasai Adventures.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
              icon: <Leaf size={30} />,
              title: "Conservation",
              description: "Wildlife protection and habitat preservation are integrated into every aspect of our operations.",
              delay: 0
            }, {
              icon: <Shield size={30} />,
              title: "Safety",
              description: "Rigorous safety protocols and certified guides ensure secure wildlife experiences.",
              delay: 100
            }, {
              icon: <Users size={30} />,
              title: "Community",
              description: "Supporting local Maasai communities through employment, education, and cultural preservation.",
              delay: 200
            }, {
              icon: <Award size={30} />,
              title: "Authenticity",
              description: "Providing genuine experiences that honor Kenya's wildlife, landscapes, and cultures.",
              delay: 300
            }].map((value, index) => <div key={index} className="bg-white p-8 rounded-xl text-center shadow-sm animate-slide-up card-hover" style={{
              animationDelay: `${value.delay}ms`
            }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-accent mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3">
                    {value.title}
                  </h3>
                  <p className="text-foreground/70">
                    {value.description}
                  </p>
                </div>)}
            </div>
          </div>
        </section>

        {/* Our History Timeline */}
        <section className="section-padding container">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              From humble beginnings to a leader in Kenyan safari and conservation.
            </p>
          </div>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-accent/30 transform md:translate-x-[-50%] hidden sm:block"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => <div key={index} className={cn("relative flex flex-col sm:flex-row items-start gap-8 animate-fade-in", index % 2 === 0 ? "md:flex-row-reverse text-left md:text-right" : "text-left")} style={{
              animationDelay: `${index * 200}ms`
            }}>
                  <div className="sm:w-1/2"></div>
                  
                  {/* Year marker */}
                  <div className="absolute left-[-20px] md:left-1/2 transform md:translate-x-[-50%] w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold z-10 hidden sm:flex">
                    <Calendar size={16} />
                  </div>
                  
                  <div className={cn("sm:w-1/2 bg-white p-6 rounded-xl shadow-sm card-hover", index % 2 === 0 ? "sm:pr-10" : "sm:pl-10")}>
                    <div className="flex sm:hidden items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center mr-3">
                        <Calendar size={14} />
                      </div>
                      <span className="font-display font-bold text-lg">{item.year}</span>
                    </div>
                    <div className="sm:block">
                      <span className="font-display font-bold text-xl hidden sm:block mb-2">{item.year}</span>
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-foreground/70">{item.description}</p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        
        {/* Team Members */}
        <section className="py-20 bg-secondary">
          <div className="container px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Meet Our Team
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                The passionate individuals who make your Kenyan safaris unforgettable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-slide-up card-hover" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-semibold">{member.name}</h3>
                    <p className="text-accent font-medium mb-3">{member.role}</p>
                    <p className="text-foreground/70 text-sm">{member.bio}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        
        {/* Location Map */}
        <section className="section-padding container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Visit Us in Kenya
              </h2>
              <p className="text-foreground/70 mb-6">
                Our headquarters are located in Nairobi, with safari operations throughout Kenya's premier wildlife reserves including Maasai Mara, Amboseli, and Tsavo.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-secondary rounded-full text-accent">
                    <Map size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Our Headquarters</h3>
                    <p className="text-sm text-foreground/70">
                      Maasai Adventures, Ngong Road, Karen, Nairobi, Kenya
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-secondary rounded-full text-accent">
                    <Mountain size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Safari Locations</h3>
                    <p className="text-sm text-foreground/70">
                      Maasai Mara, Amboseli, Tsavo, Lake Nakuru, and Samburu National Reserves
                    </p>
                  </div>
                </div>
              </div>
              
              <Link to="/contact" className="btn-primary">
                Contact Us for Directions
              </Link>
            </div>
            
            <div className="animate-slide-up animation-delay-200">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853841743!2d36.70731444941403!3d-1.304441599999922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%20National%20Park!5e0!3m2!1sen!2sus!4v1650120000000!5m2!1sen!2sus" width="100%" height="450" style={{
                border: 0
              }} allowFullScreen loading="lazy" title="Maasai Adventures Location" className="w-full"></iframe>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 bg-accent text-accent-foreground relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612455679639-8dbaf41db6a2?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="container relative z-10 px-4 text-center">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Ready to Experience Wild Kenya?
              </h2>
              <p className="text-xl mb-8 text-accent-foreground/90">
                Book your safari now and discover the magic of Kenya's wildlife with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/accommodation" className="inline-block px-8 py-4 bg-white text-accent font-medium text-lg rounded-md transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:translate-y-[-2px]">
                  View Our Camps
                </Link>
                <Link to="/booking" className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-medium text-lg rounded-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:translate-y-[-2px]">
                  Book Your Safari
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default About;

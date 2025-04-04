
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById } from '@/services/supabaseService';
import { dandeliActivities } from '@/data/activities';
import { Activity } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ActivityBookingForm } from '@/components/ActivityBookingForm';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, Star, Dumbbell, Calendar, ChevronLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const ActivityDetail: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const { data: activityData, isLoading, error } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => getActivityById(activityId as string),
  });

  // Fallback to local data if API call fails
  const getFallbackActivity = () => {
    const fallbackActivity = dandeliActivities.find(a => a.id === activityId);
    if (fallbackActivity) {
      return {
        id: fallbackActivity.id,
        name: fallbackActivity.title,
        description: fallbackActivity.description,
        price: fallbackActivity.price,
        duration: fallbackActivity.duration,
        max_participants: fallbackActivity.maxParticipants,
        category: fallbackActivity.category,
        difficulty: fallbackActivity.difficulty,
        rating: fallbackActivity.rating,
        image: fallbackActivity.image,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Activity;
    }
    return null;
  };

  const activity = activityData || getFallbackActivity();

  const handleBookingSubmit = (values: any, bookingId: string) => {
    setBookingDetails({ 
      ...values,
      bookingId,
      activityName: activity?.name,
      price: activity?.price,
      totalPrice: activity?.price ? activity.price * values.participants : 0
    });
    setShowBookingConfirmation(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading activity details...</p>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-red-500 mb-4">Activity not found or error loading details.</p>
        <Button onClick={() => navigate('/activities')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Activities
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{
              backgroundImage: `url('${activity.image || '/placeholder.svg'}')`,
              backgroundPosition: "center 30%"
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="container relative h-full flex flex-col justify-center items-start text-white z-10 px-4">
            <div className="breadcrumbs text-sm mb-2">
              <button onClick={() => navigate('/activities')} className="hover:underline flex items-center">
                <ChevronLeft className="h-3 w-3 mr-1" />
                All Activities
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">{activity.name}</h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{activity.duration} mins</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Max {activity.max_participants} people</span>
              </div>
              <div className="flex items-center">
                <Dumbbell className="h-4 w-4 mr-1" />
                <span className="capitalize">{activity.difficulty || 'Easy'}</span>
              </div>
              {activity.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{activity.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Details Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Activity</h2>
                <p className="text-muted-foreground mb-6">{activity.description}</p>
                
                <Separator className="my-6" />
                
                <h3 className="text-xl font-semibold mb-3">What to Expect</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Duration</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.duration} minutes ({Math.floor(activity.duration / 60)} hours {activity.duration % 60} minutes)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Group Size</h4>
                      <p className="text-sm text-muted-foreground">
                        Maximum {activity.max_participants} participants per session
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Physical Level</h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.difficulty === 'easy' ? 'Suitable for all fitness levels' :
                         activity.difficulty === 'medium' ? 'Moderate physical activity required' :
                         'Advanced physical fitness recommended'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="text-xl font-semibold mb-3">Important Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Please arrive 15 minutes before the scheduled time</li>
                  <li>Wear comfortable clothing and appropriate footwear</li>
                  <li>Bring water and sun protection</li>
                  <li>Activity may be rescheduled in case of severe weather conditions</li>
                  <li>Children under 12 must be accompanied by an adult</li>
                </ul>
              </div>
              
              {/* Similar Activities Section */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dandeliActivities
                    .filter(a => a.id !== activityId && a.category === activity.category)
                    .slice(0, 2)
                    .map(similarActivity => (
                      <div key={similarActivity.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${similarActivity.image || '/placeholder.svg'}')` }} />
                        <div className="p-4">
                          <h3 className="font-medium">{similarActivity.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">{similarActivity.duration} mins</span>
                            <span className="font-semibold">₹{similarActivity.price}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => navigate(`/activities/${similarActivity.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Booking Column */}
            <div>
              <ActivityBookingForm 
                activity={activity}
                onSubmit={handleBookingSubmit}
              />
              
              <div className="bg-muted/30 rounded-lg p-6 mt-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact our activities team for any questions or special requests.
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={showBookingConfirmation} onOpenChange={setShowBookingConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Thank you for booking your activity with us.
            </DialogDescription>
          </DialogHeader>
          
          {bookingDetails && (
            <div className="mt-4 space-y-3">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium text-lg">{bookingDetails.activityName}</p>
                <p className="text-sm text-muted-foreground">
                  <Calendar className="inline h-4 w-4 mr-1" /> 
                  {format(bookingDetails.bookingDate, "MMMM d, yyyy")}
                </p>
              </div>
              
              <div className="space-y-2">
                <p><strong>Booking ID:</strong> {bookingDetails.bookingId.slice(0, 8)}...</p>
                <p><strong>Participants:</strong> {bookingDetails.participants}</p>
                <p><strong>Name:</strong> {bookingDetails.name}</p>
                <p><strong>Total Price:</strong> ₹{bookingDetails.totalPrice}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-md border border-green-100 mt-4 text-center text-sm">
                A confirmation has been sent to your email at {bookingDetails.email}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/activities')}>
                  Browse More Activities
                </Button>
                <Button className="flex-1" onClick={() => navigate('/my-bookings')}>
                  View My Bookings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ActivityDetail;

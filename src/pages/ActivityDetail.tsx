
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, getActivities } from '@/services/supabaseService';
import { Activity } from '@/types/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ActivityBookingForm } from '@/components/ActivityBookingForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Star, Dumbbell, Calendar, ChevronLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const ActivityDetail: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => getActivityById(activityId as string),
  });

  const { data: allActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });

  const similarActivities = allActivities?.filter(a => a.id !== activityId && a.category === activity?.category).slice(0, 2) ?? [];

  const handleBookingSubmit = (values: any, bookingId: string) => {
    setBookingDetails({ 
      ...values, bookingId,
      activityName: activity?.name,
      price: activity?.price,
      totalPrice: activity?.price ? activity.price * values.participants : 0
    });
    setShowBookingConfirmation(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-destructive mb-4">Activity not found.</p>
        <Button onClick={() => navigate('/activities')}><ChevronLeft className="mr-2 h-4 w-4" />Back to Activities</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <div className="relative h-[40vh] md:h-[50vh] w-full">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${activity.image || '/placeholder.svg'}')`, backgroundPosition: "center 30%" }}>
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="container relative h-full flex flex-col justify-center items-start text-white z-10 px-4">
            <button onClick={() => navigate('/activities')} className="hover:underline flex items-center text-sm mb-2">
              <ChevronLeft className="h-3 w-3 mr-1" />All Activities
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{activity.name}</h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /><span>{activity.duration} mins</span></div>
              {activity.max_participants && <div className="flex items-center"><Users className="h-4 w-4 mr-1" /><span>Max {activity.max_participants}</span></div>}
              <div className="flex items-center"><Dumbbell className="h-4 w-4 mr-1" /><span className="capitalize">{activity.difficulty || 'Easy'}</span></div>
              {activity.rating && <div className="flex items-center"><Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" /><span>{activity.rating}/5</span></div>}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Activity</h2>
                <p className="text-muted-foreground mb-6">{activity.description}</p>
                <Separator className="my-6" />
                <h3 className="text-xl font-semibold mb-3">Important Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Please arrive 15 minutes before the scheduled time</li>
                  <li>Wear comfortable clothing and appropriate footwear</li>
                  <li>Bring water and sun protection</li>
                  <li>Activity may be rescheduled in case of severe weather</li>
                </ul>
              </div>
              
              {similarActivities.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">You Might Also Like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {similarActivities.map(sa => (
                      <div key={sa.id} className="bg-card rounded-lg shadow overflow-hidden">
                        {sa.image && <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${sa.image}')` }} />}
                        <div className="p-4">
                          <h3 className="font-medium">{sa.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">{sa.duration} mins</span>
                            <span className="font-semibold">₹{sa.price}</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate(`/activities/${sa.id}`)}>View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <ActivityBookingForm activity={activity} onSubmit={handleBookingSubmit} />
              <div className="bg-muted/30 rounded-lg p-6 mt-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">Contact our team for questions or special requests.</p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>Contact Us</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={showBookingConfirmation} onOpenChange={setShowBookingConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>Thank you for booking your activity with us.</DialogDescription>
          </DialogHeader>
          {bookingDetails && (
            <div className="mt-4 space-y-3">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium text-lg">{bookingDetails.activityName}</p>
                <p className="text-sm text-muted-foreground"><Calendar className="inline h-4 w-4 mr-1" />{format(bookingDetails.bookingDate, "MMMM d, yyyy")}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Booking ID:</strong> {bookingDetails.bookingId.slice(0, 8)}...</p>
                <p><strong>Participants:</strong> {bookingDetails.participants}</p>
                <p><strong>Total:</strong> ₹{bookingDetails.totalPrice}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/activities')}>Browse More</Button>
                <Button className="flex-1" onClick={() => navigate('/my-bookings')}>My Bookings<ArrowRight className="ml-2 h-4 w-4" /></Button>
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

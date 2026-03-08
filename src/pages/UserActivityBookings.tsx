
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserActivityBookings, cancelActivityBooking } from '@/utils/activity-booking-service';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  Clock, 
  Users, 
  Check, 
  X, 
  AlertCircle, 
  Calendar as CalendarIcon,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserActivityBookings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const { 
    data: bookings, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['userActivityBookings'],
    queryFn: getUserActivityBookings,
    enabled: !!user,
  });

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await cancelActivityBooking(selectedBooking);
      toast({
        title: "Booking Cancelled",
        description: "Your activity booking has been cancelled successfully.",
      });
      setCancelDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openCancelDialog = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setCancelDialogOpen(true);
  };

  // Group bookings by status
  const upcomingBookings = bookings?.filter(booking => 
    booking.status !== 'cancelled' && booking.status !== 'completed' &&
    new Date(booking.date) >= new Date()
  ) || [];
  
  const pastBookings = bookings?.filter(booking => 
    booking.status !== 'cancelled' && 
    (booking.status === 'completed' || new Date(booking.date) < new Date())
  ) || [];
  
  const cancelledBookings = bookings?.filter(booking => 
    booking.status === 'cancelled'
  ) || [];

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center flex-col p-8">
          <h2 className="text-2xl font-semibold mb-4">Please Log In</h2>
          <p className="mb-6 text-muted-foreground">You need to be logged in to view your bookings</p>
          <Button onClick={() => navigate('/auth')}>
            Log In / Sign Up
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg">Loading your bookings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center flex-col p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Bookings</h2>
          <p className="mb-6 text-muted-foreground">There was a problem loading your bookings. Please try again later.</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Activity Bookings</h1>
          <p className="text-muted-foreground">
            Manage your adventure bookings and experiences at Safari Adventures
          </p>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Upcoming Activities</h3>
                <p className="text-muted-foreground mb-6">You don't have any upcoming activity bookings</p>
                <Button onClick={() => navigate('/activities')}>
                  Browse Activities
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map(booking => (
                  <Card key={booking.id} className="overflow-hidden">
                    {booking.activity?.image && (
                      <div 
                        className="h-40 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${booking.activity.image}')` }} 
                      />
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.activity?.name || 'Activity'}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
                            </div>
                          </CardDescription>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status || 'pending'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{booking.participants}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">
                            {booking.activity?.duration} mins
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">
                            ₹{booking.total_price || 
                              (booking.activity?.price 
                                ? booking.activity.price * booking.participants
                                : 'N/A')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/activities/${booking.activity_id}`)}
                      >
                        View Activity
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => openCancelDialog(booking.id)}
                      >
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Past Activities</h3>
                <p className="text-muted-foreground mb-6">You don't have any past activity bookings</p>
                <Button onClick={() => navigate('/activities')}>
                  Browse Activities
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map(booking => (
                  <Card key={booking.id} className="overflow-hidden">
                    {booking.activity?.image && (
                      <div 
                        className="h-40 bg-cover bg-center opacity-70" 
                        style={{ backgroundImage: `url('${booking.activity.image}')` }} 
                      />
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.activity?.name || 'Activity'}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
                            </div>
                          </CardDescription>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Completed
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{booking.participants}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">₹{booking.total_price || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/activities/${booking.activity_id}`)}
                      >
                        Book Again
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {cancelledBookings.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <X className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Cancelled Activities</h3>
                <p className="text-muted-foreground mb-6">You don't have any cancelled activity bookings</p>
                <Button onClick={() => navigate('/activities')}>
                  Browse Activities
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledBookings.map(booking => (
                  <Card key={booking.id} className="overflow-hidden opacity-75">
                    {booking.activity?.image && (
                      <div 
                        className="h-40 bg-cover bg-center grayscale" 
                        style={{ backgroundImage: `url('${booking.activity.image}')` }} 
                      />
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.activity?.name || 'Activity'}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
                            </div>
                          </CardDescription>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Cancelled
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{booking.participants}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-medium">₹{booking.total_price || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/activities/${booking.activity_id}`)}
                      >
                        Book Again
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Need Help with Your Booking?</h3>
          <p className="text-muted-foreground mb-4">
            Contact our customer support team for any questions or modifications regarding your activity bookings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
            <Button onClick={() => navigate('/activities')}>
              Browse More Activities
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this activity booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default UserActivityBookings;

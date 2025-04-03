
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserBookings, cancelBooking } from '@/utils/booking-service';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserBookings = () => {
  const { toast } = useToast();
  
  const { data: bookings, isLoading, isError, refetch } = useQuery({
    queryKey: ['userBookings'],
    queryFn: getUserBookings,
  });

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      refetch();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Cancellation Failed",
        description: "There was an error cancelling your booking.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading your bookings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Error loading bookings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {bookings && bookings.length > 0 ? (
            <Table>
              <TableCaption>A list of your bookings</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{format(new Date(booking.check_in), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(booking.check_out), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>₹{booking.total_price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Cancel</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No, keep it</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelBooking(booking.id)}>
                                Yes, cancel booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-xl font-medium mb-2">No Bookings Found</h2>
              <p className="text-muted-foreground mb-6">You haven't made any bookings yet.</p>
              <Button asChild>
                <a href="/booking">Make a Booking</a>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserBookings;


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserBookings, cancelBooking } from '@/utils/booking-service';
import { getReceiptByBookingId, PaymentReceipt } from '@/utils/mpesa-service';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Receipt, Loader2 } from 'lucide-react';

const UserBookings = () => {
  const { toast } = useToast();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [loadingReceiptId, setLoadingReceiptId] = useState<string | null>(null);
  
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

  const handleViewReceipt = async (bookingId: string) => {
    setLoadingReceiptId(bookingId);
    try {
      const receipt = await getReceiptByBookingId(bookingId);
      if (receipt) {
        setSelectedReceipt(receipt);
        setReceiptDialogOpen(true);
      } else {
        toast({
          title: "No Receipt Found",
          description: "No payment receipt is available for this booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
      toast({
        title: "Error",
        description: "Failed to load payment receipt.",
        variant: "destructive",
      });
    } finally {
      setLoadingReceiptId(null);
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
        <p className="text-lg text-destructive">Error loading bookings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        <div className="bg-card rounded-lg shadow-lg p-6">
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
                    <TableCell>KSh {booking.total_price.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {(booking.status === 'confirmed' || booking.status === 'completed') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReceipt(booking.id)}
                            disabled={loadingReceiptId === booking.id}
                          >
                            {loadingReceiptId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Receipt className="h-4 w-4 mr-1" />
                                Receipt
                              </>
                            )}
                          </Button>
                        )}
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
                      </div>
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
      
      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment Receipt
            </DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-center">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Payment Successful</p>
                <p className="text-2xl font-bold mt-1">KSh {selectedReceipt.amount.toLocaleString()}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{selectedReceipt.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium uppercase">{selectedReceipt.payment_method}</span>
                </div>
                {selectedReceipt.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone Number</span>
                    <span className="font-medium">{selectedReceipt.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium">{selectedReceipt.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {format(new Date(selectedReceipt.created_at), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                    {selectedReceipt.status}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <p className="text-xs text-center text-muted-foreground">
                Maasai Adventures Ltd • Karen, Nairobi, Kenya
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default UserBookings;


import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBookings, updateBookingStatus } from '@/services/supabaseService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getActivities, getRooms } from '@/services/supabaseService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const AdminPage = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  React.useEffect(() => {
    if (isAdmin === false) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  const { data: bookings, isLoading: bookingsLoading, isError: bookingsError, refetch } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
  
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
  });
  
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`,
      });
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the booking status.",
        variant: "destructive",
      });
    }
  };

  if (bookingsLoading && roomsLoading && activitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (bookingsError) {
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
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
              
              <Table>
                <TableCaption>List of all bookings</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id.slice(0, 8)}...</TableCell>
                        <TableCell>{booking.user_id?.slice(0, 8)}...</TableCell>
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
                          <Select 
                            defaultValue={booking.status || 'pending'}
                            onValueChange={(value) => handleStatusChange(booking.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">No bookings found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="rooms">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Room Management</h2>
                <Button>Add New Room</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms && rooms.map(room => (
                  <Card key={room.id}>
                    <CardHeader>
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>
                        Capacity: {room.capacity} guests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold mb-2">₹{room.price} / night</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {room.description || 'No description available'}
                      </p>
                      <div className="text-sm">
                        <strong>Amenities:</strong>
                        <p>{room.amenities ? JSON.stringify(room.amenities) : 'None listed'}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Edit</Button>
                      <Button variant="destructive">Delete</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Activity Management</h2>
                <Button>Add New Activity</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities && activities.map(activity => (
                  <Card key={activity.id}>
                    <CardHeader>
                      <CardTitle>{activity.name}</CardTitle>
                      <CardDescription>
                        Duration: {activity.duration} hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold mb-2">₹{activity.price}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description || 'No description available'}
                      </p>
                      {activity.max_participants && (
                        <p className="text-sm">Max participants: {activity.max_participants}</p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Edit</Button>
                      <Button variant="destructive">Delete</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;


import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getBookings, updateBookingStatus, 
  getRooms, createRoom, updateRoom, deleteRoom,
  getActivities, createActivity, updateActivity, deleteActivity 
} from '@/services/supabaseService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, BarChart3 } from 'lucide-react';
import RoomForm from '@/components/admin/RoomForm';
import ActivityForm from '@/components/admin/ActivityForm';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import type { Room, Activity } from '@/types/supabase';

const AdminPage = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  React.useEffect(() => {
    if (isAdmin === false) navigate('/');
  }, [isAdmin, navigate]);

  const { data: bookings, isLoading: bookingsLoading, isError: bookingsError } = useQuery({
    queryKey: ['bookings'], queryFn: getBookings,
  });
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'], queryFn: getRooms,
  });
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'], queryFn: getActivities,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bookings'] }); toast({ title: "Status updated" }); },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  // Room mutations
  const createRoomMut = useMutation({
    mutationFn: createRoom,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rooms'] }); setRoomFormOpen(false); toast({ title: "Room created" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
  const updateRoomMut = useMutation({
    mutationFn: ({ id, ...data }: Partial<Room> & { id: string }) => updateRoom(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rooms'] }); setRoomFormOpen(false); setEditingRoom(null); toast({ title: "Room updated" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
  const deleteRoomMut = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rooms'] }); toast({ title: "Room deleted" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Activity mutations
  const createActivityMut = useMutation({
    mutationFn: createActivity,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['activities'] }); setActivityFormOpen(false); toast({ title: "Activity created" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
  const updateActivityMut = useMutation({
    mutationFn: ({ id, ...data }: Partial<Activity> & { id: string }) => updateActivity(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['activities'] }); setActivityFormOpen(false); setEditingActivity(null); toast({ title: "Activity updated" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
  const deleteActivityMut = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['activities'] }); toast({ title: "Activity deleted" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (bookingsLoading && roomsLoading && activitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
              {bookingsError ? (
                <p className="text-destructive">Error loading bookings.</p>
              ) : (
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
                    {bookings && bookings.length > 0 ? bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium font-mono text-xs">{booking.id.slice(0, 8)}…</TableCell>
                        <TableCell className="font-mono text-xs">{booking.user_id?.slice(0, 8)}…</TableCell>
                        <TableCell>{format(new Date(booking.check_in), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(new Date(booking.check_out), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>KSh {booking.total_price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-muted text-muted-foreground'
                          }`}>{booking.status || 'pending'}</span>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={booking.status || 'pending'} onValueChange={(v) => statusMutation.mutate({ id: booking.id, status: v })}>
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={7} className="text-center py-4">No bookings found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
          
          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Room Management</h2>
                <Button onClick={() => { setEditingRoom(null); setRoomFormOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Room</Button>
              </div>
              
              {rooms && rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <Card key={room.id}>
                      {room.images?.[0] && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{room.name}</CardTitle>
                        <CardDescription>Capacity: {room.capacity} guests</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold mb-2">KSh {room.price?.toLocaleString()} / night</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{room.description || 'No description'}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => { setEditingRoom(room); setRoomFormOpen(true); }}>
                          <Pencil className="mr-1 h-3 w-3" />Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-3 w-3" />Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete room?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteRoomMut.mutate(room.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No rooms yet. Add your first room above.</p>
              )}
            </div>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Activity Management</h2>
                <Button onClick={() => { setEditingActivity(null); setActivityFormOpen(true); }}><Plus className="mr-2 h-4 w-4" />Add Activity</Button>
              </div>
              
              {activities && activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map(activity => (
                    <Card key={activity.id}>
                      {activity.image && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{activity.name}</CardTitle>
                        <CardDescription>Duration: {activity.duration} min • {activity.difficulty || 'Any level'}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold mb-2">KSh {activity.price?.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{activity.description || 'No description'}</p>
                        {activity.max_participants && <p className="text-sm mt-1">Max: {activity.max_participants} participants</p>}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => { setEditingActivity(activity); setActivityFormOpen(true); }}>
                          <Pencil className="mr-1 h-3 w-3" />Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-3 w-3" />Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete activity?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteActivityMut.mutate(activity.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No activities yet. Add your first activity above.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />

      <RoomForm
        open={roomFormOpen}
        onOpenChange={setRoomFormOpen}
        initialData={editingRoom}
        loading={createRoomMut.isPending || updateRoomMut.isPending}
        onSubmit={(data) => {
          if (editingRoom) {
            updateRoomMut.mutate({ id: editingRoom.id, ...data });
          } else {
            createRoomMut.mutate(data);
          }
        }}
      />

      <ActivityForm
        open={activityFormOpen}
        onOpenChange={setActivityFormOpen}
        initialData={editingActivity}
        loading={createActivityMut.isPending || updateActivityMut.isPending}
        onSubmit={(data) => {
          if (editingActivity) {
            updateActivityMut.mutate({ id: editingActivity.id, ...data });
          } else {
            createActivityMut.mutate(data);
          }
        }}
      />
    </div>
  );
};

export default AdminPage;

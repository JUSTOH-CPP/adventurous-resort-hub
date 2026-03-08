
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { CalendarIcon, Check, Loader2, Users } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { createActivityBooking, getActivityAvailability } from "@/utils/activity-booking-service";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^(\+?\d{1,4}[\s-])?(?!0+\s)(?!0+$)\d{8,12}$/, {
    message: "Please enter a valid phone number.",
  }),
  participants: z.coerce.number().min(1, {
    message: "At least 1 participant is required.",
  }),
  bookingDate: z.date({
    required_error: "Please select a date for the activity.",
  }),
  specialRequests: z.string().optional(),
});

interface ActivityBookingFormProps {
  activity: Activity;
  onSubmit: (values: any, bookingId: string) => void;
}

export function ActivityBookingForm({ activity, onSubmit }: ActivityBookingFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [availableSpots, setAvailableSpots] = React.useState<number | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(addDays(new Date(), 1));
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      phone: "",
      participants: 1,
      bookingDate: addDays(new Date(), 1),
      specialRequests: "",
    },
  });

  // Check availability when date changes
  React.useEffect(() => {
    const checkAvailability = async () => {
      if (selectedDate) {
        const dateString = selectedDate.toISOString().split('T')[0];
        const spots = await getActivityAvailability(activity.id, dateString);
        setAvailableSpots(spots);
      }
    };
    
    checkAvailability();
  }, [selectedDate, activity.id]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue('bookingDate', date);
    }
  };

  async function handleFormSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);
      
      // Check if participants exceed available spots
      if (availableSpots !== null && values.participants > availableSpots) {
        toast({
          title: "Not enough spots available",
          description: `Only ${availableSpots} spots available for this date.`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create booking
      const bookingId = await createActivityBooking({
        activityId: activity.id,
        date: values.bookingDate,
        participants: values.participants,
        name: values.name,
        email: values.email,
        phone: values.phone,
        specialRequests: values.specialRequests,
      });
      
      toast({
        title: "Booking Successful!",
        description: "Your activity has been booked.",
      });
      
      // Call parent onSubmit
      onSubmit(values, bookingId);
    } catch (error) {
      console.error('Activity booking error:', error);
      toast({
        title: "Booking Error",
        description: "There was a problem processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const maxParticipants = activity.max_participants || 10;
  const actualMaxParticipants = availableSpots !== null ? Math.min(maxParticipants, availableSpots) : maxParticipants;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{activity.name}</h2>
        <Badge className="bg-accent">{activity.category}</Badge>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold">KSh {activity.price} <span className="text-sm font-normal text-muted-foreground">per person</span></div>
          <div className="text-sm flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>Max: {activity.max_participants} participants</span>
          </div>
        </div>
        
        {availableSpots !== null && (
          <div className={cn(
            "text-sm mt-1 p-2 rounded-md", 
            availableSpots > 5 ? "bg-green-50 text-green-700" : 
            availableSpots > 0 ? "bg-amber-50 text-amber-700" : 
            "bg-red-50 text-red-700"
          )}>
            {availableSpots > 0 
              ? `${availableSpots} spots available on ${format(selectedDate, "MMMM d, yyyy")}` 
              : "No spots available on this date. Please select another date."}
          </div>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bookingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        handleDateChange(date);
                      }}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Participants</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={actualMaxParticipants}
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requests or requirements" 
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || (availableSpots !== null && availableSpots <= 0)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Book Activity"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

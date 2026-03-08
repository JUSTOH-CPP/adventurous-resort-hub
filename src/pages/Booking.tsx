import React, { useState } from 'react';
import { BookingForm } from '@/components/BookingForm';
import { PaymentForm } from '@/components/PaymentForm';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBookingInSupabase, BookingFormData } from '@/utils/booking-service';
import { supabase } from '@/integrations/supabase/client';
const BookingPage = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStep, setBookingStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const handleBookingSubmit = async (values: any) => {
    setIsSubmitting(true);
    setCurrentBooking(values);
    try {
      // Create booking in database first
      const bookingData: BookingFormData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        adults: values.adults,
        children: values.children,
        checkInDate: values.checkInDate,
        checkOutDate: values.checkOutDate,
        roomType: values.roomType,
        specialRequests: values.specialRequests,
      };
      const id = await createBookingInSupabase(bookingData);
      setBookingId(id);
      // Move to payment step
      setBookingStep('payment');
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive"
      });
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePaymentSuccess = async (paymentTransactionId: string) => {
    setTransactionId(paymentTransactionId);
    setBookingStep('confirmation');

    // Send real booking confirmation email via edge function
    try {
      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          to: currentBooking.email,
          guestName: currentBooking.name,
          bookingId: bookingId || 'N/A',
          checkIn: currentBooking.checkInDate instanceof Date 
            ? currentBooking.checkInDate.toLocaleDateString() 
            : String(currentBooking.checkInDate),
          checkOut: currentBooking.checkOutDate instanceof Date 
            ? currentBooking.checkOutDate.toLocaleDateString() 
            : String(currentBooking.checkOutDate),
          roomType: currentBooking.roomType || 'Safari Lodge',
          totalPrice: currentBooking.totalPrice || 15000,
          transactionId: paymentTransactionId,
        },
      });

      if (error) {
        console.error('Email send error:', error);
        toast({
          title: "Booking Confirmed!",
          description: "However, we couldn't send the confirmation email. Your booking is still valid.",
        });
      } else {
        toast({
          title: "Booking Confirmed! 🎉",
          description: "A confirmation email has been sent to your inbox.",
        });
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      toast({
        title: "Booking Confirmed!",
        description: "Your booking is confirmed. Check your email for details.",
      });
    }
  };
  const handlePaymentCancel = () => {
    setBookingStep('form');
  };
  const resetBooking = () => {
    setBookingStep('form');
    setCurrentBooking(null);
    setTransactionId(null);
  };
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] w-full">
          <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: "url('/lovable-uploads/7fb9e3c6-353a-410e-8478-5741bfe3ab03.png')",
          backgroundPosition: "center 30%"
        }}>
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="container relative h-full flex flex-col justify-center items-center text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">Book Your Gateway</h1>
            <p className="text-lg md:text-xl max-w-2xl animate-slide-up animation-delay-200">
              Reserve your perfect stay in the heart of nature's paradise
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form or Payment Form Column */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 animate-fade-in">
              {bookingStep === 'form' && <>
                  <h2 className="text-2xl font-display font-semibold mb-6">Reservation Details</h2>
                  <BookingForm onSubmit={handleBookingSubmit} />
                </>}
              
              {bookingStep === 'payment' && currentBooking && <>
                  <h2 className="text-2xl font-display font-semibold mb-6">Payment Details</h2>
                  <PaymentForm bookingDetails={{ ...currentBooking, bookingId }} onPaymentSuccess={handlePaymentSuccess} onCancel={handlePaymentCancel} />
                </>}
              
              {bookingStep === 'confirmation' && <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-display font-semibold mb-4">Booking Confirmed!</h2>
                  <p className="mb-4 text-muted-foreground">
                    Asante sana for booking with Maasai Adventures! We've sent a confirmation to {currentBooking?.email} and an SMS to your phone.
                  </p>
                  {transactionId && <p className="text-sm bg-muted p-3 rounded-md inline-block mb-6">
                      Transaction ID: {transactionId}
                    </p>}
                  <button onClick={resetBooking} className="btn-primary mx-auto mt-4">
                    Make Another Booking
                  </button>
                </div>}
            </div>
            
            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Booking Information */}
              <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in animation-delay-200">
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <Info size={20} className="text-accent" />
                  Booking Information
                </h3>
                <Separator className="mb-4" />
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Check-in time: 12:00 PM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Check-out time: 11:00 AM (Max 24hrs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Free cancellation up to 48 hours before check-in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Pet-friendly accommodations available (additional charges may apply)</span>
                  </li>
                </ul>
              </div>
              
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in animation-delay-400">
                <h3 className="text-xl font-display font-semibold mb-4">Need Assistance?</h3>
                <Separator className="mb-4" />
                <p className="mb-4 text-sm">Our reservation team is available to help you plan your perfect stay.</p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Call us:</p>
                  <p className="text-accent">+254 722 123 456</p>
                  <p className="font-medium mt-3">Email:</p>
                  <p className="text-accent">info@maasaiadventures.co.ke</p>
                </div>
              </div>
              
              {/* Testimonial */}
              <div className="bg-accent/10 rounded-lg p-6 animate-fade-in animation-delay-600">
                <p className="italic text-sm mb-4">
                  "Our safari at Maasai Adventures was absolutely magical. The Maasai guides went above and beyond to make our trip unforgettable!"
                </p>
                <p className="font-medium text-sm">- Amara & David, Nairobi</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Policies Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-semibold mb-8 text-center">Booking Policies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-display font-semibold mb-4">Reservation Policy</h3>
                <ul className="space-y-2 text-sm">
                  <li>• A 50% advance payment is required to confirm your booking</li>
                  <li>• Full payment is due upon check-in</li>
                  <li>• We accept M-Pesa, credit cards, and bank transfers</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-display font-semibold mb-4">Cancellation Policy</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Free cancellation up to 48 hours before check-in</li>
                  <li>• 50% refund for cancellations made 24-48 hours before check-in</li>
                  <li>• No refund for cancellations made less than 24 hours before check-in</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-display font-semibold mb-4">Additional Information</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Extra person charges may apply beyond double occupancy</li>
                  <li>• Special requests are subject to availability</li>
                  <li>• Government-issued ID is required at check-in</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-semibold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>)}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};

// FAQ data
const faqs = [{
  question: "How do I make a reservation?",
  answer: "You can make a reservation by filling out the booking form on our website, calling our team at +254 722 123 456, or emailing info@maasaiadventures.co.ke."
}, {
  question: "Is there a minimum stay requirement?",
  answer: "During peak migration season (July-October), there is a 2-night minimum stay. Off-peak single-night stays may be available."
}, {
  question: "Do you offer airport transfers?",
  answer: "Yes, we offer transfers from Jomo Kenyatta International Airport and Wilson Airport in Nairobi. Please mention your requirement in special requests."
}, {
  question: "Are meals included in the room rate?",
  answer: "Our standard packages include breakfast. You can upgrade to half-board (breakfast and dinner) or full-board (all meals) during booking."
}, {
  question: "Can I book activities in advance?",
  answer: "Yes, we recommend booking safaris and activities in advance, especially during the Great Migration season. Contact our team for assistance."
}];
export default BookingPage;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthMiddleware from "./middleware/AuthMiddleware";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Accommodation from "./pages/Accommodation";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Booking from "./pages/Booking";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import UserBookings from "./pages/UserBookings";
import Profile from "./pages/Profile";
import ChatBot from "./components/ChatBot";
import WhatsAppButton from "./components/WhatsAppButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/accommodation" element={<Accommodation />} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/booking" element={<AuthMiddleware><Booking /></AuthMiddleware>} />
            <Route path="/my-bookings" element={<AuthMiddleware><UserBookings /></AuthMiddleware>} />
            <Route path="/profile" element={<AuthMiddleware><Profile /></AuthMiddleware>} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AuthMiddleware requireAdmin><Admin /></AuthMiddleware>} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
          <WhatsAppButton />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

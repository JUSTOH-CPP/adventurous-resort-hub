
# Kenyan Safari Resort - System Documentation

## System Overview

This web application is a complete resort booking and management system for a Kenyan safari experience. The system allows users to browse accommodations, explore safari activities, make bookings, and manage their profiles.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Backend/Database**: Supabase
- **Routing**: React Router
- **UI Components**: Shadcn UI, Lucide Icons
- **Build Tools**: Vite, TypeScript

## Key Features

- User authentication and profile management
- Accommodation browsing and booking
- Safari activities exploration and reservation
- Booking management
- Admin dashboard for resort management
- Responsive design for all devices
- WhatsApp integration for customer support
- AI-powered chatbot assistance

## Core Components Structure

### Pages
- **Index (Home)**: Landing page featuring resort highlights
- **Accommodation**: Browse and select rooms
- **Activities**: Explore safari experiences
- **Booking**: Make reservations
- **About**: Information about the resort
- **Contact**: Contact details and form
- **Gallery**: Photo gallery of the resort and activities
- **User Dashboard**: View and manage bookings
- **Admin Dashboard**: Manage the resort operations

### Components
- **Navbar**: Main navigation component
- **Footer**: Site footer with links and information
- **ActivityCard**: Display activity information
- **RoomCard**: Display room information
- **BookingForm**: Form for making reservations
- **PaymentForm**: Process payments
- **AuthButtons**: Login/Register controls
- **ChatBot**: AI assistant for users
- **WhatsAppButton**: Direct contact via WhatsApp

## Data Flow

1. **Authentication Flow**:
   - User registers/logs in
   - JWT token is stored and managed by Supabase client
   - Protected routes require authentication

2. **Booking Flow**:
   - User browses rooms/activities
   - User selects dates and options
   - User completes payment
   - Booking is stored in database
   - Confirmation is sent to user

3. **Data Fetching**:
   - React Query hooks (useRooms, useActivities, etc.) handle data fetching
   - Supabase service functions make API calls
   - React components consume and display data

## Database Schema

### Main Tables
- **rooms**: Accommodation options
- **activities**: Safari experiences
- **bookings**: User reservations
- **activity_bookings**: Activity reservations
- **reviews**: User feedback
- **users**: User profiles
- **resort_areas**: Physical locations in the resort

## API Services

The application uses Supabase client for all API operations:

```javascript
import { supabase } from '@/integrations/supabase/client';
```

Key service functions include:

- **Authentication**: Login, register, password recovery
- **Data Management**: CRUD operations for bookings, reviews, etc.
- **File Storage**: Image upload and management

## Custom Hooks

- **useRooms**: Fetch and manage room data
- **useActivities**: Fetch and manage activity data
- **useAuth**: Handle authentication state
- **useToast**: Display notification messages

## Deployment Information

The application is built with Vite and can be deployed to any static hosting service. Supabase handles the backend functionality.

## Troubleshooting

Common issues:

1. **Authentication errors**: Check Supabase configuration and URL redirects
2. **Data not loading**: Verify React Query configuration and Supabase RLS policies
3. **Booking failures**: Check form validation and payment integration
4. **Image loading issues**: Verify image paths and Supabase storage bucket permissions

## Development Guidelines

1. **Component Structure**: Create small, focused components
2. **State Management**: Use React Query for server state, React useState/useContext for UI state
3. **Styling**: Use Tailwind CSS utility classes and Shadcn UI components
4. **Error Handling**: Implement proper error boundaries and user feedback
5. **Performance**: Optimize React Query with proper caching strategies
6. **TypeScript**: Maintain strict type definitions

## Future Enhancements

Potential areas for improvement:

1. Implement offline mode for partial functionality without internet
2. Add multi-language support for international visitors
3. Enhance activity booking with real-time availability
4. Implement analytics dashboard for business insights
5. Add weather integration for safari planning

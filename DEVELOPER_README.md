
# Kenyan Safari Resort - Developer Guide

## Project Overview

This project is a full-featured booking platform for a luxury safari resort in Kenya's Maasai Mara region. It allows users to browse accommodations, book safari activities, manage reservations, and learn about Kenyan wildlife and conservation efforts.

## Project Setup

```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd kenyan-safari-resort

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
/src
  /components        # Reusable UI components
    /ui              # Shadcn UI components
  /context           # React context providers
  /hooks             # Custom React hooks
  /integrations      # External service integrations
    /supabase        # Supabase client and types
  /lib               # Utility functions
  /middleware        # Route protection and middleware
  /pages             # Main application pages
  /services          # API service functions
  /types             # TypeScript type definitions
  /utils             # Helper functions
```

## Core Technologies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Navigation
- **TanStack Query**: Data fetching
- **Tailwind CSS**: Styling
- **Shadcn UI**: Component library
- **Supabase**: Backend services

## Development Guidelines

### Component Creation

- Create small, single-responsibility components
- Use TypeScript interfaces for props
- Follow the Shadcn UI patterns for new components
- Use Lucide icons for consistency

### State Management

- Use React Query for server state
- Keep UI state close to components with useState
- Use Context for shared state across components
- Implement proper loading and error states

### Data Fetching

- Create custom hooks for data access (see `/hooks` directory)
- Configure proper caching with staleTime and refetchOnWindowFocus
- Implement error handling and loading states

### Styling

- Use Tailwind CSS for all styling
- Leverage the Shadcn UI theme for consistency
- Use responsive design patterns for all components
- Use colors that reflect the Kenyan landscape (earthy tones, greens, blues)

### Authentication

- All protected routes should use AuthMiddleware
- Admin routes require the requireAdmin prop on AuthMiddleware

## Working with Supabase

- All Supabase operations are in `/services/supabaseService.ts`
- Use the provided hooks for data access
- Row-Level Security (RLS) policies control data access
- Tables include: rooms, activities, bookings, users, reviews, etc.

## Safari Content Guidelines

When developing new features or content, keep in mind:

1. **Wildlife Accuracy**: Ensure all wildlife information is factually accurate
2. **Cultural Sensitivity**: Represent Maasai and other Kenyan cultures respectfully
3. **Conservation Focus**: Highlight conservation efforts when relevant
4. **Seasonal Awareness**: Make note of seasonal differences (migration times, weather)
5. **Location Accuracy**: Use correct Kenyan location names and geographical features

## Testing

```sh
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Deployment

```sh
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## API References

- Safari activity data: `/services/activityService.ts`
- Lodge accommodation data: `/services/roomService.ts`
- Booking processing: `/services/bookingService.ts`
- Conservation information: `/services/conservationService.ts`

## Common Issues

- **Authentication Redirects**: Check Supabase URL configuration
- **API Errors**: Verify environment variables for Supabase connection
- **Image Loading**: Check Supabase storage bucket permissions
- **Type Errors**: Ensure types match the Supabase schema

## Useful Resources

- [Kenya Wildlife Service](https://www.kws.go.ke/)
- [Maasai Mara National Reserve](https://www.maasaimara.com/)
- [Safari Planning Best Practices](https://www.magicalkenya.com/plan-your-trip/)
- [Kenya Tourism Board](https://www.magicalkenya.com/)

## Contribution Guidelines

- Create feature branches from `develop`
- Follow the established code style
- Write unit tests for new features
- Document new components and APIs
- Request reviews from at least one team member

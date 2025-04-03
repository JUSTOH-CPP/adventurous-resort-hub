
# Kenyan Safari Resort - Developer Guide

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

### Authentication

- All protected routes should use AuthMiddleware
- Admin routes require the requireAdmin prop on AuthMiddleware

## Working with Supabase

- All Supabase operations are in `/services/supabaseService.ts`
- Use the provided hooks for data access
- Row-Level Security (RLS) policies control data access
- Tables include: rooms, activities, bookings, users, reviews, etc.

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

## Common Issues

- **Authentication Redirects**: Check Supabase URL configuration
- **API Errors**: Verify environment variables for Supabase connection
- **Image Loading**: Check Supabase storage bucket permissions
- **Type Errors**: Ensure types match the Supabase schema

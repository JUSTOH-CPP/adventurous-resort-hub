
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';

const AuthButtons = () => {
  const { user, signOut, isAdmin } = useAuth();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User size={16} />
            {user.user_metadata?.name || user.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <Link to="/booking">
            <DropdownMenuItem>My Bookings</DropdownMenuItem>
          </Link>
          
          {isAdmin && (
            <Link to="/admin">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Admin Dashboard
              </DropdownMenuItem>
            </Link>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/auth">
        <Button variant="ghost" size="sm">Sign in</Button>
      </Link>
      <Link to="/auth?tab=signup">
        <Button size="sm">Sign up</Button>
      </Link>
    </div>
  );
};

export default AuthButtons;

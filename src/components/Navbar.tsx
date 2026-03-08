
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Logo from './Logo';  // Default import from Logo component
import AuthButtons from './AuthButtons';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  {
    label: "Accommodation",
    href: "/accommodation",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Activities",
    href: "/activities",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAtTop, setIsAtTop] = React.useState(true);
  const location = useLocation();
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (href: string) => {
    return location.pathname === href;
  };
  
  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      !isAtTop ? "bg-background shadow-md" : "bg-transparent text-white shadow-none"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={40} />
            <span className={cn(
              "font-display font-bold text-xl",
              !isAtTop && "text-foreground"
            )}>Safari Adventures</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium hover:text-accent transition-colors",
                  isActive(link.href) && "text-accent underline decoration-2 underline-offset-4"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <AuthButtons />
            
            {/* Mobile menu button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <Menu className={cn(
                    "h-6 w-6",
                    !isAtTop && "text-foreground"
                  )} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "text-foreground hover:text-accent px-4 py-2 rounded-md transition-colors",
                        isActive(link.href) && "bg-accent/10 text-accent font-medium"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

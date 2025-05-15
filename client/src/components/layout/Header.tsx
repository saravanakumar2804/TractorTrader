import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@shared/schema';

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Fetch current user
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    retry: false,
    gcTime: 0, // Don't cache failed auth requests
    staleTime: 30000, // Cache successful auth for 30 seconds
    meta: {
      on401: "returnNull" // Silently handle auth failures
    }
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen || mobileMenuOpen) {
        const target = event.target as HTMLElement;
        const isSearchBtn = target.closest('#searchToggle');
        const isSearchBar = target.closest('#searchBar');
        const isMobileBtn = target.closest('#mobileMenuBtn');
        const isMobileMenu = target.closest('#mobileMenu');

        if (!isSearchBtn && !isSearchBar && searchOpen) {
          setSearchOpen(false);
        }

        if (!isMobileBtn && !isMobileMenu && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [searchOpen, mobileMenuOpen]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Force a reload to clear all query caches
        window.location.href = '/';
      } else {
        toast({
          title: 'Error logging out',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error logging out',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-tractor text-3xl text-primary"></i>
            <Link href="/">
              <span className="font-heading font-bold text-2xl text-primary cursor-pointer">
                TractorTrade
              </span>
            </Link>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium hover:text-primary transition-custom ${location === '/' ? 'text-primary' : ''}`}>
              Home
            </Link>
            <Link href="/tractors" className={`font-medium hover:text-primary transition-custom ${location === '/tractors' ? 'text-primary' : ''}`}>
              Browse Tractors
            </Link>
            <Link href="/sell" className={`font-medium hover:text-primary transition-custom ${location === '/sell' ? 'text-primary' : ''}`}>
              Sell Your Tractor
            </Link>
            <a href="#how-it-works" className="font-medium hover:text-primary transition-custom">
              How It Works
            </a>
            <a href="#contact" className="font-medium hover:text-primary transition-custom">
              Contact
            </a>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="hidden md:block hover:text-primary transition-custom">
                  <i className="far fa-user text-xl"></i>
                </Link>
                {user && user.isAdmin && (
                  <Link href="/admin" className="hidden md:block hover:text-primary transition-custom">
                    <i className="fas fa-cog text-xl"></i>
                  </Link>
                )}
              </>
            ) : (
              <Link href="/login" className="hidden md:flex items-center hover:text-primary transition-custom">
                <i className="far fa-user text-xl mr-1"></i>
                <span>Login</span>
              </Link>
            )}
            <button
              id="searchToggle"
              className="hover:text-primary transition-custom"
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen(!searchOpen);
              }}
            >
              <i className="fas fa-search text-xl"></i>
            </button>
            <button
              id="mobileMenuBtn"
              className="md:hidden hover:text-primary transition-custom"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              id="searchBar"
              className="py-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tractors, brands, or models..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
                <button className="absolute right-3 top-2 text-neutral-500 hover:text-primary">
                  <i className="fas fa-search text-lg"></i>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobileMenu"
              className="md:hidden py-4 animate-fade-in"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="font-medium py-2 px-4 hover:bg-neutral-100 rounded-lg transition-custom">
                  Home
                </Link>
                <Link href="/tractors" className="font-medium py-2 px-4 hover:bg-neutral-100 rounded-lg transition-custom">
                  Browse Tractors
                </Link>
                <Link href="/sell" className="font-medium py-2 px-4 hover:bg-neutral-100 rounded-lg transition-custom">
                  Sell Your Tractor
                </Link>
                <a href="#how-it-works" className="font-medium py-2 px-4 hover:bg-neutral-100 rounded-lg transition-custom">
                  How It Works
                </a>
                <a href="#contact" className="font-medium py-2 px-4 hover:bg-neutral-100 rounded-lg transition-custom">
                  Contact
                </a>
                
                <div className="border-t border-neutral-200 pt-2 flex flex-col space-y-2 px-4">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="py-2 hover:text-primary transition-custom">
                        <i className="far fa-user text-lg mr-2"></i> Dashboard
                      </Link>
                      {user && user.isAdmin && (
                        <Link href="/admin" className="py-2 hover:text-primary transition-custom">
                          <i className="fas fa-cog text-lg mr-2"></i> Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="py-2 text-left hover:text-primary transition-custom"
                      >
                        <i className="fas fa-sign-out-alt text-lg mr-2"></i> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="py-2 hover:text-primary transition-custom">
                        <i className="far fa-user text-lg mr-2"></i> Login
                      </Link>
                      <Link href="/register" className="py-2 hover:text-primary transition-custom">
                        <i className="fas fa-user-plus text-lg mr-2"></i> Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

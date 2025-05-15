import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Tractor } from '@shared/schema';

interface TractorCardProps {
  tractor: Tractor;
  featured?: boolean;
}

export default function TractorCard({ tractor, featured = false }: TractorCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [favoriteStatus, setFavoriteStatus] = useState<boolean>(false);
  
  // Check if this tractor is in user's favorites
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });
  
  useQuery({
    queryKey: ['/api/favorites'],
    enabled: !!user,
    onSuccess: (data) => {
      // Check if this tractor is in favorites
      const isFavorite = data?.some((fav: any) => fav.id === tractor.id);
      setFavoriteStatus(isFavorite);
    },
  });
  
  // Mutation to add/remove favorites
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteStatus) {
        // Remove from favorites
        return apiRequest('DELETE', `/api/tractors/${tractor.id}/favorite`);
      } else {
        // Add to favorites
        return apiRequest('POST', `/api/tractors/${tractor.id}/favorite`);
      }
    },
    onSuccess: () => {
      // Toggle state
      setFavoriteStatus(!favoriteStatus);
      
      // Show toast
      toast({
        title: favoriteStatus ? 'Removed from favorites' : 'Added to favorites',
        description: favoriteStatus 
          ? 'This tractor has been removed from your favorites' 
          : 'This tractor has been added to your favorites',
      });
      
      // Invalidate favorites query
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Please log in to save favorites',
        variant: 'destructive',
      });
    }
  });
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate();
  };

  // Get the first image for display
  const coverImage = tractor.images && tractor.images.length > 0 
    ? tractor.images[0] 
    : 'https://pixabay.com/get/g0cb9ffdd660e2da3f385b2bcc61151061019fd8b0dd6235539cd27176f4d2f891ba1213e95cd92a43edf23423c45140629fb03775c5e0b0783aaf801de724514_1280.jpg';
  
  // Format price to INR
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(tractor.price);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-custom animate-fade-in h-full flex flex-col">
      <div className="relative overflow-hidden group h-60">
        <img 
          src={coverImage} 
          alt={tractor.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {featured && (
          <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
        
        {tractor.status === 'pending' && (
          <div className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
            Reserved
          </div>
        )}
        
        <motion.div 
          className="absolute bottom-4 right-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button 
            className={`${favoriteStatus 
              ? 'bg-primary text-white' 
              : 'bg-white/90 hover:bg-white text-neutral-700 hover:text-primary'} 
              w-10 h-10 rounded-full flex items-center justify-center transition-custom`}
            onClick={handleFavoriteClick}
            aria-label={favoriteStatus ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={favoriteStatus ? 'fas fa-heart' : 'far fa-heart'}></i>
          </button>
        </motion.div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold text-xl">{tractor.title}</h3>
          <span className="text-primary font-bold text-lg">{formattedPrice}</span>
        </div>
        
        <p className="text-neutral-500 mb-4 line-clamp-2">{tractor.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <i className="fas fa-tachometer-alt text-neutral-400 mr-2"></i>
            <span className="text-sm">{tractor.horsepower} HP</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-calendar-alt text-neutral-400 mr-2"></i>
            <span className="text-sm">{tractor.year}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-clock text-neutral-400 mr-2"></i>
            <span className="text-sm">{tractor.hours || 'N/A'} hours</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt text-neutral-400 mr-2"></i>
            <span className="text-sm">{tractor.location}</span>
          </div>
        </div>
        
        <div className="flex gap-3 mt-auto">
          <Link href={`/tractors/${tractor.id}`}>
            <a className="flex-1 bg-primary hover:bg-primary-dark text-white text-center font-medium py-3 rounded-lg transition-custom">
              View Details
            </a>
          </Link>
          <Link href={`/tractors/${tractor.id}#contact`}>
            <a className="bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded-lg transition-custom">
              <i className="fas fa-phone-alt"></i>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import TractorCard from '@/components/tractors/TractorCard';
import { motion } from 'framer-motion';
import type { Tractor } from '@shared/schema';

export default function FeaturedTractors() {
  const [featuredTractors, setFeaturedTractors] = useState<Tractor[]>([]);
  
  // Fetch all tractors
  const { data: tractors, isLoading, error } = useQuery({
    queryKey: ['/api/tractors'],
  });
  
  // Filter to get only featured tractors (limit to 3)
  useEffect(() => {
    if (tractors) {
      // In a real app, we would have a featured field or endpoint
      // Here we just take the first 3 tractors
      setFeaturedTractors(tractors.slice(0, 3));
    }
  }, [tractors]);
  
  // Animation variants for staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-3xl mb-8">Featured Tractors</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-custom">
                <Skeleton className="h-60 w-full" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">Error loading tractors. Please try again later.</p>
          </div>
        ) : featuredTractors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">No featured tractors available right now. Check back soon!</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {featuredTractors.map((tractor) => (
              <motion.div key={tractor.id} variants={item}>
                <TractorCard tractor={tractor} featured={true} />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/tractors">
              View All Featured Tractors
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

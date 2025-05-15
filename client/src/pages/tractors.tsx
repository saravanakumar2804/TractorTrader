import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet';

import TractorCard from '@/components/tractors/TractorCard';
import TractorFilters from '@/components/tractors/TractorFilters';
import { Pagination } from '@/components/ui/pagination';
import type { Tractor } from '@shared/schema';

export default function Tractors() {
  const [location] = useLocation();
  const [filteredTractors, setFilteredTractors] = useState<Tractor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Extract query parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const category = params.get('category');
  const search = params.get('search');
  const sort = params.get('sort');
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  const minYear = params.get('minYear');
  const maxYear = params.get('maxYear');
  const minHP = params.get('minHP');
  const maxHP = params.get('maxHP');
  const brand = params.get('brand');

  // Fetch all tractors
  const { data: tractors, isLoading, error } = useQuery({
    queryKey: ['/api/tractors'],
  });

  // Filter tractors based on URL parameters
  useEffect(() => {
    if (!tractors) return;
    
    let filtered = [...tractors];

    // Apply filters
    if (category) {
      filtered = filtered.filter(tractor => tractor.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(tractor => 
        tractor.title.toLowerCase().includes(searchLower) ||
        tractor.brand.toLowerCase().includes(searchLower) ||
        tractor.model.toLowerCase().includes(searchLower) ||
        tractor.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (brand) {
      filtered = filtered.filter(tractor => tractor.brand.toLowerCase() === brand.toLowerCase());
    }
    
    if (minPrice && maxPrice) {
      filtered = filtered.filter(tractor => 
        tractor.price >= parseInt(minPrice) && tractor.price <= parseInt(maxPrice)
      );
    } else if (minPrice) {
      filtered = filtered.filter(tractor => tractor.price >= parseInt(minPrice));
    } else if (maxPrice) {
      filtered = filtered.filter(tractor => tractor.price <= parseInt(maxPrice));
    }
    
    if (minYear && maxYear) {
      filtered = filtered.filter(tractor => 
        tractor.year >= parseInt(minYear) && tractor.year <= parseInt(maxYear)
      );
    } else if (minYear) {
      filtered = filtered.filter(tractor => tractor.year >= parseInt(minYear));
    } else if (maxYear) {
      filtered = filtered.filter(tractor => tractor.year <= parseInt(maxYear));
    }
    
    if (minHP && maxHP) {
      filtered = filtered.filter(tractor => 
        tractor.horsepower >= parseInt(minHP) && tractor.horsepower <= parseInt(maxHP)
      );
    } else if (minHP) {
      filtered = filtered.filter(tractor => tractor.horsepower >= parseInt(minHP));
    } else if (maxHP) {
      filtered = filtered.filter(tractor => tractor.horsepower <= parseInt(maxHP));
    }
    
    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'hp-desc':
          filtered.sort((a, b) => b.horsepower - a.horsepower);
          break;
        default:
          break;
      }
    }
    
    // Calculate pagination
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    
    // Apply pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedResults = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    setFilteredTractors(paginatedResults);
  }, [tractors, category, search, sort, brand, minPrice, maxPrice, minYear, maxYear, minHP, maxHP, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, search, sort, brand, minPrice, maxPrice, minYear, maxYear, minHP, maxHP]);

  // Generate page title
  let pageTitle = 'Browse Tractors';
  if (category) {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    pageTitle = `${categoryName} Tractors`;
  }
  
  if (search) {
    pageTitle = `Search Results for "${search}"`;
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle} | TractorTrade</title>
        <meta 
          name="description" 
          content="Browse our selection of quality tractors with detailed specifications, images, and secure payment options." 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading font-bold text-3xl mb-8">{pageTitle}</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-32">
              <TractorFilters />
            </div>
          </div>
          
          {/* Tractors grid */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Skeleton className="w-full h-60" />
                    <div className="p-6">
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full mt-2 mb-4" />
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[1, 2, 3, 4].map(j => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Skeleton className="h-10 flex-grow" />
                        <Skeleton className="h-10 w-10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <h3 className="text-red-600 font-bold text-lg mb-2">Error Loading Tractors</h3>
                <p>There was a problem fetching the tractors. Please try again later.</p>
              </div>
            ) : filteredTractors.length === 0 ? (
              <div className="bg-neutral-50 p-8 rounded-lg text-center">
                <h3 className="font-bold text-xl mb-3">No tractors found</h3>
                <p className="text-neutral-600 mb-4">
                  We couldn't find any tractors matching your criteria. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {filteredTractors.map(tractor => (
                    <motion.div 
                      key={tractor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <TractorCard tractor={tractor} />
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

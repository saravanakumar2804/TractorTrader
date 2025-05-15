import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { TRACTOR_CATEGORIES } from '@/lib/constants';

export default function FilterBar() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="sticky top-[72px] z-40 bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Pills */}
          <div className="flex overflow-x-auto scroll-hidden pb-2 w-full md:w-auto gap-2">
            <Link href="/tractors">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`whitespace-nowrap ${activeCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'} 
                  px-4 py-2 rounded-full text-sm font-medium transition-custom`}
                onClick={() => setActiveCategory('all')}
              >
                All Tractors
              </motion.button>
            </Link>
            
            {TRACTOR_CATEGORIES.map(category => (
              <Link key={category.value} href={`/tractors?category=${category.value}`}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`whitespace-nowrap ${activeCategory === category.value 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-100 hover:bg-neutral-200'} 
                    px-4 py-2 rounded-full text-sm font-medium transition-custom`}
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </motion.button>
              </Link>
            ))}
          </div>
          
          {/* Filters and Sort */}
          <div className="flex w-full md:w-auto gap-2">
            {/* Filters */}
            <div ref={filterRef} className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-custom flex items-center"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <i className="fas fa-sliders-h mr-2"></i> Filters
              </motion.button>
              
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link href="/tractors?filter=price-low">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Price: Low to High
                      </a>
                    </Link>
                    <Link href="/tractors?filter=price-high">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Price: High to Low
                      </a>
                    </Link>
                    <Link href="/tractors?filter=newest">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Newest First
                      </a>
                    </Link>
                    <Link href="/tractors?filter=featured">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Featured
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sort */}
            <div ref={sortRef} className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-custom flex items-center"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <i className="fas fa-sort mr-2"></i> Sort By <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </motion.button>
              
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link href="/tractors?sort=price-asc">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Price: Low to High
                      </a>
                    </Link>
                    <Link href="/tractors?sort=price-desc">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Price: High to Low
                      </a>
                    </Link>
                    <Link href="/tractors?sort=newest">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Newest First
                      </a>
                    </Link>
                    <Link href="/tractors?sort=hp-desc">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        Horsepower: High to Low
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative bg-neutral-800 overflow-hidden h-[500px] md:h-[600px]">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://pixabay.com/get/gf585140d7301bf13eeaf1446ef8c3a5b92a15669b917feb9cfeffe01b4a88cdeb2534dd932c67c40ccb41ce8fe6b674451d021376847c6962275ba0286aa9d55_1280.jpg')", 
          filter: "brightness(0.7)" 
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight text-shadow mb-4">
            Find Your Perfect Tractor Today
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            The largest marketplace for quality agricultural machinery with secure payments and verified sellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white"
            >
              <Link href="/tractors">
                Browse Tractors
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="bg-white/90 hover:bg-white text-primary"
            >
              <Link href="/sell">
                Sell Your Tractor
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

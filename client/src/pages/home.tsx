import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

import Hero from '@/components/home/Hero';
import FilterBar from '@/components/home/FilterBar';
import FeaturedTractors from '@/components/home/FeaturedTractors';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowItWorks from '@/components/home/HowItWorks';
import BrowseCategories from '@/components/home/BrowseCategories';
import AppPromotion from '@/components/home/AppPromotion';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>TractorTrade - Premium Tractor Marketplace</title>
        <meta name="description" content="Buy and sell tractors with secure payments, verified sellers, and detailed specifications. Find the perfect tractor for your agricultural needs." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Hero />
        <FilterBar />
        <FeaturedTractors />
        <WhyChooseUs />
        <HowItWorks />
        <BrowseCategories />
        <AppPromotion />
        <Testimonials />
        <CallToAction />
      </motion.div>
    </>
  );
}

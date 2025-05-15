import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  
  // Set default page title based on current route
  let pageTitle = 'TractorTrade';
  let pageDescription = 'The premier marketplace for buying and selling tractors and agricultural machinery.';
  
  if (location.startsWith('/tractors/')) {
    pageTitle = 'Tractor Details | TractorTrade';
    pageDescription = 'View detailed specifications and photos of this tractor. Contact the seller or make an advance payment securely.';
  } else if (location === '/tractors') {
    pageTitle = 'Browse Tractors | TractorTrade';
    pageDescription = 'Browse our selection of tractors by category, brand, price, and more. Find the perfect tractor for your needs.';
  } else if (location === '/sell') {
    pageTitle = 'Sell Your Tractor | TractorTrade';
    pageDescription = 'List your tractor for sale on TractorTrade. Upload photos, videos, and detailed specifications to attract buyers.';
  } else if (location === '/login') {
    pageTitle = 'Login | TractorTrade';
    pageDescription = 'Log in to your TractorTrade account to manage your tractors, view inquiries, and track payments.';
  } else if (location === '/register') {
    pageTitle = 'Register | TractorTrade';
    pageDescription = 'Create a TractorTrade account to buy and sell tractors. It\'s free and only takes a minute.';
  } else if (location === '/dashboard') {
    pageTitle = 'Dashboard | TractorTrade';
    pageDescription = 'Manage your tractor listings, view your inquiries, and track your payments all in one place.';
  } else if (location === '/admin') {
    pageTitle = 'Admin Panel | TractorTrade';
    pageDescription = 'Manage users, tractors, and payments on TractorTrade.';
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph tags for better social sharing */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tractortrade.com${location}`} />
        <meta property="og:image" content="https://tractortrade.com/og-image.jpg" />
        
        {/* Load external fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap" 
          rel="stylesheet"
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}

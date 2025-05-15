import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import useRazorpay from '@/hooks/use-razorpay';

import TractorGallery, { TractorGallerySkeleton } from '@/components/tractors/TractorGallery';
import type { Tractor } from '@shared/schema';

export default function TractorDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const razorpay = useRazorpay();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch tractor details
  const { data: tractor, isLoading, error } = useQuery({
    queryKey: [`/api/tractors/${id}`],
  });
  
  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });
  
  // Check if tractor is in favorites
  useQuery({
    queryKey: ['/api/favorites'],
    enabled: !!user,
    onSuccess: (favorites) => {
      if (favorites) {
        const found = favorites.some((fav: any) => fav.id === parseInt(id));
        setIsFavorite(found);
      }
    },
  });
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        return apiRequest('DELETE', `/api/tractors/${id}/favorite`);
      } else {
        return apiRequest('POST', `/api/tractors/${id}/favorite`);
      }
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: isFavorite 
          ? 'This tractor has been removed from your favorites' 
          : 'This tractor has been added to your favorites',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'You must be logged in to save favorites',
        variant: 'destructive',
      });
      if (!user) {
        navigate('/login');
      }
    },
  });
  
  // Create Razorpay payment order
  const createPaymentOrderMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/tractors/${id}/payment`, {
        advancePercentage: 10, // 10% advance payment
      });
    },
    onSuccess: (data) => {
      initiatePayment(data);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create payment order. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Verify Razorpay payment
  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      return apiRequest('POST', '/api/payments/verify', paymentData);
    },
    onSuccess: () => {
      toast({
        title: 'Payment Successful',
        description: 'Your advance payment has been received. The seller will contact you soon.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tractors/${id}`] });
    },
    onError: () => {
      toast({
        title: 'Payment Verification Failed',
        description: 'There was an issue verifying your payment. Please contact support.',
        variant: 'destructive',
      });
    },
  });
  
  // Initiate Razorpay payment
  const initiatePayment = (orderData: any) => {
    if (!razorpay.isReady) {
      toast({
        title: 'Payment Gateway Not Ready',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }
    
    razorpay.open({
      amount: orderData.amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'TractorTrade',
      description: `Advance payment for ${tractor.title}`,
      order_id: orderData.order.id,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#2C5F2D',
      },
      handler: function(response: any) {
        verifyPaymentMutation.mutate({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          tractorId: id,
          amount: orderData.amount,
        });
      },
    });
  };
  
  // Handle payment button click
  const handleMakePayment = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to make a payment',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    createPaymentOrderMutation.mutate();
  };
  
  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TractorGallerySkeleton />
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If error, show error message
  if (error || !tractor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tractor</h2>
          <p className="text-lg mb-6">
            We couldn't load the details for this tractor. It may not exist or has been removed.
          </p>
          <Button onClick={() => navigate('/tractors')}>
            Browse Other Tractors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tractor.title} | TractorTrade</title>
        <meta name="description" content={tractor.description.substring(0, 160)} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumbs */}
          <div className="flex text-sm text-neutral-500 mb-4">
            <a href="/" className="hover:text-primary">Home</a>
            <span className="mx-2">/</span>
            <a href="/tractors" className="hover:text-primary">Tractors</a>
            <span className="mx-2">/</span>
            <span className="text-neutral-700">{tractor.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Gallery */}
            <div className="lg:col-span-2">
              <TractorGallery
                images={tractor.images || []}
                videoUrl={tractor.videoUrl}
                title={tractor.title}
              />
              
              {/* Tabs for description, specifications, etc. */}
              <div className="mt-8">
                <Tabs defaultValue="description">
                  <TabsList className="w-full">
                    <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                    <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
                    <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="bg-white rounded-lg shadow-md p-6 mt-2">
                    <h3 className="font-heading font-bold text-xl mb-4">About This Tractor</h3>
                    <p className="text-neutral-700 whitespace-pre-line">{tractor.description}</p>
                  </TabsContent>
                  
                  <TabsContent value="specifications" className="bg-white rounded-lg shadow-md p-6 mt-2">
                    <h3 className="font-heading font-bold text-xl mb-4">Technical Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-b pb-2">
                        <span className="font-medium">Brand:</span> {tractor.brand}
                      </div>
                      <div className="border-b pb-2">
                        <span className="font-medium">Model:</span> {tractor.model}
                      </div>
                      <div className="border-b pb-2">
                        <span className="font-medium">Year:</span> {tractor.year}
                      </div>
                      <div className="border-b pb-2">
                        <span className="font-medium">Horsepower:</span> {tractor.horsepower} HP
                      </div>
                      <div className="border-b pb-2">
                        <span className="font-medium">Hours:</span> {tractor.hours || 'N/A'}
                      </div>
                      <div className="border-b pb-2">
                        <span className="font-medium">Category:</span> {tractor.category}
                      </div>
                      <div className="border-b pb-2">
                        <span className="font-medium">Location:</span> {tractor.location}
                      </div>
                      {tractor.specifications && Object.entries(tractor.specifications).map(([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="bg-white rounded-lg shadow-md p-6 mt-2">
                    <h3 className="font-heading font-bold text-xl mb-4">Key Features</h3>
                    {tractor.features ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {Object.entries(tractor.features).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-neutral-500">No specific features listed for this tractor.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Right side - Price and contact */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="font-heading font-bold text-2xl mb-1">{tractor.title}</h1>
                    <p className="text-neutral-500">{tractor.brand} {tractor.model}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavoriteMutation.mutate()}
                    className={isFavorite ? 'text-primary' : ''}
                  >
                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xl`}></i>
                  </Button>
                </div>
                
                <div className="my-4">
                  <span className="text-3xl font-bold text-primary">{formatPrice(tractor.price)}</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <i className="fas fa-tachometer-alt text-neutral-500 w-6"></i>
                    <span className="ml-2">{tractor.horsepower} HP</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-neutral-500 w-6"></i>
                    <span className="ml-2">{tractor.year}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-neutral-500 w-6"></i>
                    <span className="ml-2">{tractor.hours || 'N/A'} hours</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-neutral-500 w-6"></i>
                    <span className="ml-2">{tractor.location}</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                {tractor.status === 'pending' ? (
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-circle text-amber-500 mr-2"></i>
                      <p className="text-amber-700">This tractor has a pending payment and may not be available.</p>
                    </div>
                  </div>
                ) : tractor.status === 'sold' ? (
                  <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <i className="fas fa-times-circle text-red-500 mr-2"></i>
                      <p className="text-red-700">This tractor has been sold and is no longer available.</p>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full py-6 text-lg"
                    onClick={handleMakePayment}
                    disabled={createPaymentOrderMutation.isPending}
                  >
                    {createPaymentOrderMutation.isPending ? (
                      <>Processing...</>
                    ) : (
                      <>Make Advance Payment <i className="fas fa-arrow-right ml-2"></i></>
                    )}
                  </Button>
                )}
                
                <p className="text-sm text-neutral-500 mt-2 text-center">
                  Secure payment via <i className="fas fa-lock mr-1"></i> Razorpay
                </p>
                
                <div className="mt-4" id="contact">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:seller@tractortrade.com?subject=Inquiry about ${tractor.title}`}>
                      <i className="fas fa-envelope mr-2"></i> Contact Seller
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

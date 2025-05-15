import { useState, useEffect, useCallback } from 'react';
import { RAZORPAY_KEY_ID } from '@/lib/constants';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

type RazorpayInstance = {
  open: () => void;
  on: (event: string, callback: Function) => void;
  close: () => void;
};

declare global {
  interface Window {
    Razorpay?: (options: RazorpayOptions) => RazorpayInstance;
  }
}

export function useRazorpay() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load Razorpay script
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        setIsReady(true);
        setIsLoading(false);
      };
      
      script.onerror = (err) => {
        setError(new Error('Failed to load Razorpay. Please try again later.'));
        setIsLoading(false);
      };
      
      document.body.appendChild(script);
    };

    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsReady(true);
      setIsLoading(false);
    } else {
      loadRazorpay();
    }
    
    return () => {
      // Cleanup function if needed
    };
  }, []);

  // Function to create and open Razorpay payment
  const open = useCallback((options: Omit<RazorpayOptions, 'key'>, onSuccess?: (response: RazorpayResponse) => void) => {
    if (!isReady) {
      console.error('Razorpay is not loaded yet');
      return;
    }

    if (!window.Razorpay) {
      setError(new Error('Razorpay not available'));
      return;
    }

    try {
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        ...options,
        handler: (response: RazorpayResponse) => {
          if (options.handler) {
            options.handler(response);
          }
          if (onSuccess) {
            onSuccess(response);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error('Error opening Razorpay:', err);
      setError(err instanceof Error ? err : new Error('Failed to open Razorpay payment'));
    }
  }, [isReady]);

  return {
    isReady,
    isLoading,
    error,
    open,
  };
}

export default useRazorpay;

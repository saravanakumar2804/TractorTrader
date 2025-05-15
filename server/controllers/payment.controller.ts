import { Request, Response } from 'express';
import { storage } from '../storage';
import { createOrder, verifyPaymentSignature } from '../utils/razorpay';

// Create a Razorpay order for a tractor advance payment
export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const tractorId = parseInt(req.params.id);
    
    if (isNaN(tractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    // Get tractor details
    const tractor = await storage.getTractor(tractorId);
    
    if (!tractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }
    
    // Calculate advance amount (10% of tractor price by default)
    const { advancePercentage = 10 } = req.body;
    const advanceAmount = Math.floor((tractor.price * advancePercentage) / 100);
    
    // Create a Razorpay order
    const order = await createOrder({
      amount: advanceAmount,
      currency: 'INR',
      receipt: `tractor-${tractorId}-${Date.now()}`,
      notes: {
        tractorId,
        buyerId: req.session.userId,
        tractorTitle: tractor.title,
      },
    });
    
    res.status(200).json({
      message: 'Payment order created',
      order,
      amount: advanceAmount,
      tractor,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify payment after successful Razorpay payment
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tractorId,
      amount,
    } = req.body;
    
    // Verify signature
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    // Parse tractorId
    const parsedTractorId = parseInt(tractorId);
    
    if (isNaN(parsedTractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    // Create payment record
    const payment = await storage.createPayment({
      tractorId: parsedTractorId,
      buyerId: req.session.userId,
      amount: parseInt(amount),
      transactionId: razorpay_payment_id,
      paymentStatus: 'completed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature,
    });
    
    // Update tractor status to 'pending' (advance paid)
    await storage.updateTractor(parsedTractorId, { status: 'pending' });
    
    res.status(200).json({
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all payments for a specific tractor
export const getTractorPayments = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const tractorId = parseInt(req.params.id);
    
    if (isNaN(tractorId)) {
      return res.status(400).json({ message: 'Invalid tractor ID' });
    }
    
    // Get tractor to check if user is authorized
    const tractor = await storage.getTractor(tractorId);
    
    if (!tractor) {
      return res.status(404).json({ message: 'Tractor not found' });
    }
    
    // Check if user is the seller or an admin
    const user = await storage.getUser(req.session.userId);
    if (tractor.sellerId !== req.session.userId && !user?.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view these payments' });
    }
    
    // Get payments for this tractor
    const payments = await storage.getPaymentsByTractorId(tractorId);
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching tractor payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all payments for the current user
export const getUserPayments = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get payments made by this user
    const payments = await storage.getPaymentsByBuyerId(req.session.userId);
    
    // Get tractor details for each payment
    const paymentsWithTractors = await Promise.all(
      payments.map(async (payment) => {
        const tractor = await storage.getTractor(payment.tractorId);
        return {
          ...payment,
          tractor,
        };
      })
    );
    
    res.status(200).json(paymentsWithTractors);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

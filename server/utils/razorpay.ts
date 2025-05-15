import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with your key id and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
});

// Create a new order
export const createOrder = async (options: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: any;
}) => {
  try {
    const order = await razorpay.orders.create({
      amount: options.amount * 100, // Convert to paise (Razorpay takes amount in smallest currency unit)
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes || {},
    });
    
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify Razorpay signature
export const verifyPaymentSignature = (options: {
  orderId: string;
  paymentId: string;
  signature: string;
}) => {
  try {
    const { orderId, paymentId, signature } = options;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    throw error;
  }
};

// Fetch payment details by ID
export const fetchPayment = async (paymentId: string) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching Razorpay payment:', error);
    throw error;
  }
};

// Capture payment
export const capturePayment = async (paymentId: string, amount: number) => {
  try {
    const payment = await razorpay.payments.capture(paymentId, amount * 100, 'INR');
    return payment;
  } catch (error) {
    console.error('Error capturing Razorpay payment:', error);
    throw error;
  }
};

// Refund payment
export const refundPayment = async (paymentId: string, amount?: number) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined,
    });
    return refund;
  } catch (error) {
    console.error('Error refunding Razorpay payment:', error);
    throw error;
  }
};

export default razorpay;

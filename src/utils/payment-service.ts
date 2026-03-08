
/**
 * Payment Service Utility
 * Handles payment processing functionality
 */

interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: string;
  description: string;
  metadata?: Record<string, any>;
  cardDetails?: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
  };
  mpesaPhone?: string;
}

/**
 * Validate credit card details (basic client-side validation only)
 * NOTE: Real card processing requires a payment gateway like Stripe.
 * This validates format only — no real charge is made.
 */
const validateCardDetails = (cardDetails: { cardNumber: string; expiryDate: string; cvv: string }) => {
  const { cardNumber, expiryDate, cvv } = cardDetails;
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!cleanNumber || cleanNumber.length !== 16 || !/^\d{16}$/.test(cleanNumber)) {
    throw new Error('Invalid card number. Please enter a valid 16-digit card number.');
  }
  
  if (!cvv || cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
    throw new Error('Invalid CVV. Please enter a valid 3-digit CVV.');
  }
  
  if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
    throw new Error('Invalid expiry date. Use MM/YY format.');
  }
  
  const [month, year] = expiryDate.split('/').map(Number);
  const now = new Date();
  const expiry = new Date(2000 + year, month);
  if (expiry <= now) {
    throw new Error('Card has expired. Please use a valid card.');
  }
};

/**
 * Process a payment
 * - M-Pesa: Handled separately via mpesa-service.ts (real STK push)
 * - Credit Card: Validates card details. NOTE: No real charge — requires Stripe integration for production.
 */
export const processPayment = async (details: PaymentDetails): Promise<{success: boolean; transactionId?: string; error?: string}> => {
  try {
    if (details.paymentMethod === 'creditCard' && details.cardDetails) {
      validateCardDetails(details.cardDetails);
      
      // IMPORTANT: This is a DEMO card payment. 
      // In production, integrate Stripe or another payment gateway.
      // The booking will be marked as 'pending_verification' not 'confirmed'.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const transactionId = 'CARD' + Date.now().toString(36).toUpperCase();
      return { 
        success: true, 
        transactionId,
      };
    }
    
    if (details.paymentMethod === 'mpesa') {
      // M-Pesa is handled via mpesa-service.ts with real STK push
      throw new Error('M-Pesa payments should use the dedicated M-Pesa flow');
    }
    
    throw new Error('Unsupported payment method');
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed. Please try again.'
    };
  }
};

/**
 * Calculate booking price based on room type and guests (in KSh)
 */
export const calculateBookingPrice = (roomType: string, adults: number, children: number): number => {
  const basePrices = {
    standard: 15000,
    deluxe: 25000,
    suite: 40000
  };
  
  const basePrice = roomType in basePrices 
    ? basePrices[roomType as keyof typeof basePrices] 
    : 15000;
  
  const adultCost = adults * 3000;
  const childrenCost = children * 1500;
  
  return basePrice + adultCost + childrenCost;
};

/**
 * Apply promotional discount to booking
 */
export const applyPromoCode = (amount: number, promoCode: string): { discountedAmount: number; discount: number; valid: boolean } => {
  const validPromoCodes: Record<string, number> = {
    'SAFARI25': 25,
    'KARIBU15': 15,
    'MIGRATION20': 20,
    'EARLYBIRD10': 10,
    'FAMILY25': 25,
  };
  
  if (promoCode && promoCode in validPromoCodes) {
    const discountPercentage = validPromoCodes[promoCode];
    const discount = (amount * discountPercentage) / 100;
    return { discountedAmount: amount - discount, discount, valid: true };
  }
  
  return { discountedAmount: amount, discount: 0, valid: false };
};

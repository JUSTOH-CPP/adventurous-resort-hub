
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
 * Process a payment through payment gateway
 */
export const processPayment = async (details: PaymentDetails): Promise<{success: boolean; transactionId?: string; error?: string}> => {
  try {
    console.log('Processing payment:', details);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (details.paymentMethod === 'creditCard' && details.cardDetails) {
      const { cardNumber, expiryDate, cvv } = details.cardDetails;
      if (!cardNumber || !expiryDate || !cvv) throw new Error('Invalid card details');
      if (cardNumber.replace(/\s/g, '').length !== 16) throw new Error('Invalid card number');
      if (cvv.length !== 3) throw new Error('Invalid CVV');
    }
    
    if (details.paymentMethod === 'mpesa') {
      if (!details.mpesaPhone) throw new Error('M-Pesa phone number is required');
      const phone = details.mpesaPhone.replace(/\s/g, '');
      if (!/^(0\d{9}|254\d{9})$/.test(phone)) throw new Error('Invalid M-Pesa phone number. Use 07XXXXXXXX or 254XXXXXXXXX');
      console.log('Processing M-Pesa STK push to:', phone);
    }
    
    const transactionId = 'SAFARI' + Date.now().toString(36).toUpperCase();
    
    return { success: true, transactionId };
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
  
  const adultCost = adults * 3000;   // KSh 3,000 per additional adult
  const childrenCost = children * 1500;  // KSh 1,500 per child
  
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

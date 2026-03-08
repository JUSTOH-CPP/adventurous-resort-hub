
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Loader2, Phone, Tag, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { processPayment, calculateBookingPrice, applyPromoCode } from "@/utils/payment-service";
import { initiateStkPush, pollPaymentStatus } from "@/utils/mpesa-service";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'react-router-dom';

interface PaymentFormProps {
  bookingDetails: any;
  onPaymentSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

type MpesaStatus = 'idle' | 'sending' | 'waiting' | 'completed' | 'failed' | 'expired';

export function PaymentForm({ bookingDetails, onPaymentSuccess, onCancel }: PaymentFormProps) {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [mpesaPhone, setMpesaPhone] = useState(bookingDetails.phone || '');
  const [mpesaStatus, setMpesaStatus] = useState<MpesaStatus>('idle');
  const [mpesaProgress, setMpesaProgress] = useState(0);
  const [mpesaMessage, setMpesaMessage] = useState('');
  const cancelPollingRef = useRef<(() => void) | null>(null);

  const [promoCode, setPromoCode] = useState(searchParams.get('promo') || '');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{
    discountedAmount: number;
    discount: number;
    valid: boolean;
  }>({ discountedAmount: 0, discount: 0, valid: false });
  
  const baseAmount = calculateBookingPrice(
    bookingDetails.roomType, 
    parseInt(bookingDetails.adults),
    parseInt(bookingDetails.children)
  );
  
  useEffect(() => {
    if (promoCode && !promoApplied) {
      const result = applyPromoCode(baseAmount, promoCode);
      setDiscountInfo(result);
      if (result.valid) {
        setPromoApplied(true);
        toast({
          title: "Promo code applied!",
          description: `You saved KSh ${result.discount.toLocaleString()} with code ${promoCode}`,
          variant: "default",
        });
      }
    }
  }, [promoCode, baseAmount, promoApplied, toast]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      cancelPollingRef.current?.();
    };
  }, []);
  
  const finalAmount = promoApplied && discountInfo.valid 
    ? discountInfo.discountedAmount 
    : baseAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setCardDetails({ ...cardDetails, [name]: formatted });
    } else if (name === 'mpesaPhone') {
      setMpesaPhone(value);
    } else if (name === 'promoCode') {
      setPromoCode(value);
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };
  
  const handleApplyPromo = () => {
    if (!promoCode) {
      toast({
        title: "No promo code entered",
        description: "Please enter a promo code to apply a discount",
        variant: "destructive",
      });
      return;
    }
    
    const result = applyPromoCode(baseAmount, promoCode);
    setDiscountInfo(result);
    
    if (result.valid) {
      setPromoApplied(true);
      toast({
        title: "Promo code applied!",
        description: `You saved KSh ${result.discount.toLocaleString()} with code ${promoCode}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is not valid",
        variant: "destructive",
      });
    }
  };

  const handleMpesaPayment = async () => {
    if (!mpesaPhone) {
      toast({ title: "Phone number required", description: "Enter your M-Pesa phone number", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setMpesaStatus('sending');
    setMpesaProgress(5);
    setMpesaMessage('Sending STK push to your phone...');

    try {
      const stkResult = await initiateStkPush(mpesaPhone, finalAmount);
      
      if (!stkResult.success || !stkResult.checkoutRequestId) {
        throw new Error(stkResult.error || 'Failed to initiate M-Pesa payment');
      }

      setMpesaStatus('waiting');
      setMpesaProgress(15);
      setMpesaMessage('STK push sent! Please check your phone and enter your M-Pesa PIN.');

      toast({
        title: "Check your phone!",
        description: "Enter your M-Pesa PIN to authorize the payment.",
      });

      // Start polling
      let pollCount = 0;
      const { promise, cancel } = pollPaymentStatus(stkResult.checkoutRequestId, {
        intervalMs: 3000,
        maxAttempts: 40,
        onStatusChange: (status) => {
          pollCount++;
          const progress = Math.min(15 + (pollCount * 2), 90);
          setMpesaProgress(progress);

          if (status.status === 'pending') {
            setMpesaMessage(
              pollCount < 5
                ? 'Waiting for you to enter your M-Pesa PIN...'
                : pollCount < 15
                ? 'Still waiting for payment confirmation...'
                : 'Taking a bit longer than usual. Please check your phone.'
            );
          }
        },
      });

      cancelPollingRef.current = cancel;
      const result = await promise;
      cancelPollingRef.current = null;

      if (result.status === 'completed' && result.transactionId) {
        setMpesaStatus('completed');
        setMpesaProgress(100);
        setMpesaMessage('Payment confirmed!');
        setPaymentSuccess(true);
        
        setTimeout(() => {
          onPaymentSuccess(result.transactionId!);
        }, 1500);
      } else if (result.status === 'failed') {
        setMpesaStatus('failed');
        setMpesaMessage('Payment was not completed. Please try again.');
        toast({
          title: "Payment not completed",
          description: "The M-Pesa payment was declined or cancelled. Please try again.",
          variant: "destructive",
        });
      } else {
        setMpesaStatus('expired');
        setMpesaMessage('Payment request timed out. Please try again.');
        toast({
          title: "Payment timed out",
          description: "The payment request expired. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      setMpesaStatus('failed');
      setMpesaMessage('Something went wrong. Please try again.');
      toast({
        title: "Payment error",
        description: error instanceof Error ? error.message : "Failed to process M-Pesa payment",
        variant: "destructive",
      });
    } finally {
      if (mpesaStatus !== 'completed') {
        setIsProcessing(false);
      }
    }
  };

  const handleCancelMpesa = () => {
    cancelPollingRef.current?.();
    cancelPollingRef.current = null;
    setMpesaStatus('idle');
    setMpesaProgress(0);
    setMpesaMessage('');
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // M-Pesa uses its own flow
    if (bookingDetails.paymentMethod === 'mpesa') {
      await handleMpesaPayment();
      return;
    }

    setIsProcessing(true);
    
    try {
      const paymentDetails: any = {
        amount: finalAmount,
        currency: 'KES',
        paymentMethod: bookingDetails.paymentMethod,
        description: `Booking for ${bookingDetails.roomType} room`,
        metadata: {
          guestName: bookingDetails.name,
          checkInDate: bookingDetails.checkInDate?.toISOString(),
          checkOutDate: bookingDetails.checkOutDate?.toISOString(),
          roomType: bookingDetails.roomType,
          promoApplied: promoApplied ? promoCode : null
        }
      };
      
      if (bookingDetails.paymentMethod === 'creditCard') {
        paymentDetails.cardDetails = cardDetails;
      }
      
      const paymentResult = await processPayment(paymentDetails);
      
      if (paymentResult.success && paymentResult.transactionId) {
        setPaymentSuccess(true);
        setTimeout(() => {
          onPaymentSuccess(paymentResult.transactionId as string);
        }, 1500);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Please try again or use a different payment method",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 dark:bg-green-950/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Your booking has been confirmed</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mt-2 text-muted-foreground">
            A confirmation email will be sent to {bookingDetails.email}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Secure payment for your booking at Maasai Adventures
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Booking Amount:</span>
            <span className="font-medium">KSh {baseAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Room Type:</span>
            <span className="font-medium capitalize">{bookingDetails.roomType} Room</span>
          </div>
          <div className="flex justify-between">
            <span>Check-in Date:</span>
            <span className="font-medium">
              {bookingDetails.checkInDate 
                ? new Date(bookingDetails.checkInDate).toLocaleDateString() 
                : "Not specified"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Check-out Date:</span>
            <span className="font-medium">
              {bookingDetails.checkOutDate 
                ? new Date(bookingDetails.checkOutDate).toLocaleDateString() 
                : "Not specified"}
            </span>
          </div>
          
          {/* Promo code section */}
          <div className="pt-2 pb-2">
            <div className="flex gap-2">
              <div className="flex-grow">
                <Input
                  name="promoCode"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={handleInputChange}
                  disabled={promoApplied}
                />
              </div>
              <Button 
                type="button"
                variant={promoApplied ? "outline" : "default"}
                onClick={handleApplyPromo}
                disabled={promoApplied || isProcessing}
              >
                {promoApplied ? "Applied" : "Apply"}
              </Button>
            </div>
            {promoApplied && discountInfo.valid && (
              <div className="flex items-center mt-2 text-sm text-green-600">
                <Tag size={14} className="mr-1" />
                <span>
                  {promoCode} applied: KSh {discountInfo.discount.toLocaleString()} off
                </span>
              </div>
            )}
          </div>
          
          <Separator />
          
          {promoApplied && discountInfo.valid ? (
            <div className="space-y-1">
              <div className="flex justify-between text-muted-foreground line-through">
                <span>Original Total:</span>
                <span>KSh {baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Discounted Total:</span>
                <span className="text-green-600">KSh {finalAmount.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between font-medium text-lg">
              <span>Total Amount:</span>
              <span>KSh {finalAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {bookingDetails.paymentMethod === 'creditCard' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={19}
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  name="cardholderName"
                  placeholder="John Doe"
                  value={cardDetails.cardholderName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>
            </>
          )}
          
          {bookingDetails.paymentMethod === 'mpesa' && (
            <div className="border rounded-md p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">M-Pesa Payment</h3>
              </div>

              {/* M-Pesa Status Display */}
              {mpesaStatus !== 'idle' && (
                <div className="mb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    {mpesaStatus === 'sending' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {mpesaStatus === 'waiting' && <Clock className="h-4 w-4 animate-pulse text-amber-500" />}
                    {mpesaStatus === 'completed' && <Check className="h-4 w-4 text-green-600" />}
                    {(mpesaStatus === 'failed' || mpesaStatus === 'expired') && <AlertCircle className="h-4 w-4 text-destructive" />}
                    <span className="text-sm font-medium">{mpesaMessage}</span>
                  </div>
                  <Progress value={mpesaProgress} className="h-2" />
                  {mpesaStatus === 'waiting' && (
                    <p className="text-xs text-muted-foreground">
                      Please enter your M-Pesa PIN on your phone to authorize KSh {finalAmount.toLocaleString()}
                    </p>
                  )}
                  {(mpesaStatus === 'failed' || mpesaStatus === 'expired') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMpesaStatus('idle');
                        setMpesaProgress(0);
                        setMpesaMessage('');
                      }}
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              )}

              {mpesaStatus === 'idle' && (
                <>
                  <p className="text-sm mb-4">
                    Enter your M-Pesa registered phone number. You will receive an STK push prompt on your phone to authorize the payment of <span className="font-semibold">KSh {finalAmount.toLocaleString()}</span>.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                    <Input
                      id="mpesaPhone"
                      name="mpesaPhone"
                      placeholder="e.g. 0712345678 or 254712345678"
                      value={mpesaPhone}
                      onChange={handleInputChange}
                      required
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-muted-foreground">Use format: 07XXXXXXXX or 254XXXXXXXXX</p>
                  </div>
                  <div className="mt-4 space-y-2 text-sm bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Paybill Number:</span>
                      <span>174379</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Account Name:</span>
                      <span>Maasai Adventures Ltd</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {bookingDetails.paymentMethod === 'bankTransfer' && (
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Bank Transfer Details</h3>
              <p className="text-sm mb-4">
                Please transfer the total amount to the following bank account:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Account Name:</span>
                  <span>Maasai Adventures Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Account Number:</span>
                  <span>0123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Bank:</span>
                  <span>Kenya Commercial Bank (KCB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Branch:</span>
                  <span>Karen Branch, Nairobi</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Swift Code:</span>
                  <span>KCBLKENX</span>
                </div>
              </div>
              <p className="text-sm mt-4">
                After making the transfer, click "Complete Payment" to finish your booking.
              </p>
            </div>
          )}
          
          <div className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={mpesaStatus === 'waiting' || mpesaStatus === 'sending' ? handleCancelMpesa : onCancel}
              disabled={mpesaStatus === 'completed'}
            >
              {mpesaStatus === 'waiting' || mpesaStatus === 'sending' ? 'Cancel Payment' : 'Back'}
            </Button>
            
            <Button 
              type="submit" 
              disabled={isProcessing || mpesaStatus === 'completed'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {bookingDetails.paymentMethod === 'mpesa' ? 'Processing M-Pesa...' : 'Processing...'}
                </>
              ) : bookingDetails.paymentMethod === 'mpesa' ? (
                "Send M-Pesa Request"
              ) : (
                "Complete Payment"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

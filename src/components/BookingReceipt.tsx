import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';

interface BookingReceiptProps {
  booking: {
    name?: string;
    email?: string;
    phone?: string;
    adults?: number;
    children?: number;
    checkInDate?: Date | string;
    checkOutDate?: Date | string;
    roomType?: string;
    specialRequests?: string;
    totalPrice?: number;
  };
  bookingId: string | null;
  transactionId: string | null;
}

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'N/A';
  if (date instanceof Date) return date.toLocaleDateString();
  return String(date);
};

const roomTypeLabels: Record<string, string> = {
  standard: 'Standard Room',
  deluxe: 'Deluxe Room',
  suite: 'Luxury Suite',
};

const BookingReceipt: React.FC<BookingReceiptProps> = ({ booking, bookingId, transactionId }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const receiptContent = `
════════════════════════════════════════
       MAASAI ADVENTURES
       Booking Receipt
════════════════════════════════════════

Booking ID:      ${bookingId || 'N/A'}
Transaction ID:  ${transactionId || 'N/A'}
Date Issued:     ${new Date().toLocaleDateString()}

────────────────────────────────────────
  GUEST DETAILS
────────────────────────────────────────
Name:            ${booking.name || 'N/A'}
Email:           ${booking.email || 'N/A'}
Phone:           ${booking.phone || 'N/A'}

────────────────────────────────────────
  RESERVATION DETAILS
────────────────────────────────────────
Room Type:       ${roomTypeLabels[booking.roomType || ''] || booking.roomType || 'N/A'}
Check-in:        ${formatDate(booking.checkInDate)}
Check-out:       ${formatDate(booking.checkOutDate)}
Adults:          ${booking.adults || 0}
Children:        ${booking.children || 0}
${booking.specialRequests ? `Special Requests: ${booking.specialRequests}` : ''}

────────────────────────────────────────
  PAYMENT SUMMARY
────────────────────────────────────────
Total Paid:      KES ${(booking.totalPrice || 15000).toLocaleString()}
Status:          CONFIRMED ✓

════════════════════════════════════════
  Thank you for choosing safari Adventures!
  
  Contact: +254 722 123 456
  Email:   info@safariadventures.co.ke
════════════════════════════════════════
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Maasai-Adventures-Receipt-${bookingId || 'booking'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <div
        ref={receiptRef}
        className="bg-card border border-border rounded-lg p-6 text-sm space-y-4"
      >
        <div className="text-center">
          <h3 className="text-lg font-display font-semibold text-foreground">Booking Receipt</h3>
          <p className="text-xs text-muted-foreground">Safari Adventures</p>
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Guest</p>
          <p className="font-medium text-foreground">{booking.name}</p>
          <p className="text-muted-foreground">{booking.email}</p>
          {booking.phone && <p className="text-muted-foreground">{booking.phone}</p>}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Reservation</p>
          <div className="grid grid-cols-2 gap-y-1">
            <span className="text-muted-foreground">Room</span>
            <span className="text-foreground font-medium text-right">
              {roomTypeLabels[booking.roomType || ''] || booking.roomType || 'N/A'}
            </span>
            <span className="text-muted-foreground">Check-in</span>
            <span className="text-foreground text-right">{formatDate(booking.checkInDate)}</span>
            <span className="text-muted-foreground">Check-out</span>
            <span className="text-foreground text-right">{formatDate(booking.checkOutDate)}</span>
            <span className="text-muted-foreground">Guests</span>
            <span className="text-foreground text-right">
              {booking.adults || 0} Adults, {booking.children || 0} Children
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Total Paid</span>
            <span className="text-lg font-bold text-primary">
              KES {(booking.totalPrice || 15000).toLocaleString()}
            </span>
          </div>
          {transactionId && (
            <p className="text-xs text-muted-foreground">Transaction: {transactionId}</p>
          )}
          {bookingId && (
            <p className="text-xs text-muted-foreground">Booking ID: {bookingId}</p>
          )}
        </div>
      </div>

      <Button
        onClick={handleDownload}
        className="w-full mt-4 gap-2"
        variant="outline"
      >
        <Download size={16} />
        Download Receipt
      </Button>
    </div>
  );
};

export default BookingReceipt;

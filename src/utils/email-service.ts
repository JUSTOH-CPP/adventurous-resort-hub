
/**
 * Email Service Utility
 */

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

interface SMSData {
  to: string;
  message: string;
}

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log('Sending email to:', data.to);
    console.log('Subject:', data.subject);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendSMS = async (data: SMSData): Promise<boolean> => {
  try {
    console.log('Sending SMS to:', data.to);
    console.log('Message:', data.message);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

export const formatBookingEmail = (bookingData: any): string => {
  const roomTypeDisplay = {
    standard: 'Standard Room',
    deluxe: 'Deluxe Room',
    suite: 'Luxury Suite'
  };
  
  const roomDisplay = bookingData.roomType in roomTypeDisplay 
    ? roomTypeDisplay[bookingData.roomType as keyof typeof roomTypeDisplay]
    : bookingData.roomType;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; }
        .header { background-color: #1b5e20; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td { padding: 8px; border-bottom: 1px solid #ddd; }
        .highlight { font-weight: bold; color: #1b5e20; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Maasai Adventures - Booking Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear ${bookingData.name},</p>
          <p>Asante sana for booking with Maasai Adventures! We're excited to host you in the heart of Kenya.</p>
          
          <h3>Booking Details:</h3>
          <table class="info-table">
            <tr><td><strong>Booking Reference:</strong></td><td>${bookingData.paymentTransactionId || 'Processing'}</td></tr>
            <tr><td><strong>Check-in Date:</strong></td><td>${bookingData.date ? bookingData.date.toLocaleDateString() : 'N/A'}</td></tr>
            <tr><td><strong>Room Type:</strong></td><td>${roomDisplay}</td></tr>
            <tr><td><strong>Guests:</strong></td><td>${bookingData.adults} Adult(s), ${bookingData.children} Child(ren)</td></tr>
          </table>
          
          <h3>Guest Information:</h3>
          <table class="info-table">
            <tr><td><strong>Name:</strong></td><td>${bookingData.name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${bookingData.email}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${bookingData.phone}</td></tr>
          </table>
          
          <p class="highlight" style="margin-top: 30px;">Important Information:</p>
          <ul>
            <li>Check-in time: 2:00 PM</li>
            <li>Check-out time: 11:00 AM</li>
            <li>Please bring a valid ID/passport for check-in</li>
            <li>Our staff will be available 24/7 to assist you</li>
          </ul>
          
          <p>If you have any questions, please contact us at:</p>
          <p>📞 +254 722 123 456<br>📧 info@maasaiadventures.co.ke</p>
          
          <p>Karibu sana! We look forward to your visit!</p>
          
          <p>Warm regards,<br>The Maasai Adventures Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Maasai Adventures. All rights reserved.</p>
          <p>Ngong Road, Karen, Nairobi, Kenya 00200</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const formatBookingSMS = (bookingData: any): string => {
  return `Asante! Your booking at Maasai Adventures for ${bookingData.date ? bookingData.date.toLocaleDateString() : 'your selected date'} is confirmed (Ref: ${bookingData.paymentTransactionId || 'Processing'}). For assistance, call +254 722 123 456. Karibu!`;
};

export const sendBookingConfirmations = async (bookingData: any, transactionId: string): Promise<boolean> => {
  try {
    const bookingWithTransaction = { ...bookingData, paymentTransactionId: transactionId };
    const emailContent = formatBookingEmail(bookingWithTransaction);
    
    await sendEmail({
      to: "info@maasaiadventures.co.ke",
      subject: `New Booking: ${bookingData.name} - ${transactionId}`,
      body: emailContent
    });
    
    await sendEmail({
      to: bookingData.email,
      subject: "Your Booking Confirmation - Maasai Adventures",
      body: emailContent
    });
    
    if (bookingData.phone) {
      const smsContent = formatBookingSMS(bookingWithTransaction);
      await sendSMS({ to: bookingData.phone, message: smsContent });
    }
    
    return true;
  } catch (error) {
    console.error('Error sending confirmation:', error);
    return false;
  }
};

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingEmailData {
  to: string;
  guestName: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  totalPrice: number;
  transactionId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const data: BookingEmailData = await req.json();
    const { to, guestName, bookingId, checkIn, checkOut, roomType, totalPrice, transactionId } = data;

    if (!to || !guestName || !bookingId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, guestName, bookingId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;padding:30px 0;background-color:#2d5016;border-radius:12px 12px 0 0;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;">🦁 Savanna Lodge & Safari</h1>
      <p style="color:#d4e8c2;margin:8px 0 0;font-size:14px;">Your Safari Adventure Awaits</p>
    </div>

    <!-- Body -->
    <div style="background-color:#f9faf7;padding:30px;border:1px solid #e8ede3;border-top:none;">
      <h2 style="color:#2d5016;margin:0 0 20px;font-size:22px;">Booking Confirmed! ✅</h2>
      
      <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 20px;">
        Jambo <strong>${guestName}</strong>! Your safari lodge booking has been confirmed. 
        We're thrilled to welcome you to the heart of Kenya's wilderness.
      </p>

      <!-- Booking Details Card -->
      <div style="background-color:#ffffff;border-radius:8px;padding:20px;border:1px solid #e0e7d8;margin:0 0 24px;">
        <h3 style="color:#2d5016;margin:0 0 16px;font-size:16px;border-bottom:2px solid #e8ede3;padding-bottom:8px;">
          📋 Booking Details
        </h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Booking ID</td>
            <td style="padding:8px 0;color:#333;font-size:14px;text-align:right;font-weight:600;">${bookingId.slice(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Room Type</td>
            <td style="padding:8px 0;color:#333;font-size:14px;text-align:right;font-weight:600;">${roomType || 'Safari Lodge'}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Check-in</td>
            <td style="padding:8px 0;color:#333;font-size:14px;text-align:right;font-weight:600;">${checkIn}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:14px;">Check-out</td>
            <td style="padding:8px 0;color:#333;font-size:14px;text-align:right;font-weight:600;">${checkOut}</td>
          </tr>
          <tr style="border-top:1px solid #e8ede3;">
            <td style="padding:12px 0 8px;color:#2d5016;font-size:16px;font-weight:700;">Total</td>
            <td style="padding:12px 0 8px;color:#2d5016;font-size:16px;text-align:right;font-weight:700;">KSh ${totalPrice.toLocaleString()}</td>
          </tr>
          ${transactionId ? `
          <tr>
            <td style="padding:4px 0;color:#666;font-size:13px;">M-Pesa Ref</td>
            <td style="padding:4px 0;color:#333;font-size:13px;text-align:right;">${transactionId}</td>
          </tr>` : ''}
        </table>
      </div>

      <!-- What to Expect -->
      <div style="background-color:#edf5e3;border-radius:8px;padding:16px;margin:0 0 24px;">
        <h3 style="color:#2d5016;margin:0 0 8px;font-size:14px;">🌿 What to Expect</h3>
        <ul style="color:#333;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Game drives through the Maasai Mara</li>
          <li>Stunning savanna sunrise & sunset views</li>
          <li>Authentic Kenyan hospitality & cuisine</li>
          <li>Expert Maasai guide accompaniment</li>
        </ul>
      </div>

      <!-- Contact -->
      <p style="color:#666;font-size:14px;line-height:1.6;margin:0;">
        Questions? Reach us on WhatsApp or call 
        <a href="tel:+254722123456" style="color:#2d5016;font-weight:600;">+254 722 123 456</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px;background-color:#2d5016;border-radius:0 0 12px 12px;">
      <p style="color:#d4e8c2;margin:0;font-size:12px;">
        Savanna Lodge & Safari · Maasai Mara, Kenya<br>
        © ${new Date().getFullYear()} All rights reserved
      </p>
    </div>
  </div>
</body>
</html>`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Savanna Lodge & Safari <onboarding@resend.dev>",
        to: [to],
        subject: `🦁 Booking Confirmed — ${checkIn} to ${checkOut}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendResponse.status, resendData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resendData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Booking confirmation email sent:", resendData);

    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("send-booking-email error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

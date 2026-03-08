import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.substring(1);
  if (!cleaned.startsWith("254")) cleaned = "254" + cleaned;
  return cleaned;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, phone, amount, checkoutRequestId, bookingId, userId } = await req.json();
    const supabase = getSupabase();

    // ACTION 1: Initiate STK Push
    if (action === "initiate") {
      if (!phone || !amount) {
        return new Response(
          JSON.stringify({ success: false, error: "Phone and amount are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const formattedPhone = formatPhone(phone);
      if (!/^254\d{9}$/.test(formattedPhone)) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid phone number format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const checkoutId = "ws_CO_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const merchantRequestId = "MR" + Date.now().toString(36).toUpperCase();

      // Store pending transaction in payment_receipts with status 'pending'
      await supabase.from("payment_receipts").insert({
        transaction_id: checkoutId,
        checkout_request_id: checkoutId,
        phone: formattedPhone,
        amount,
        status: "pending",
        payment_method: "mpesa",
        currency: "KES",
        booking_id: bookingId || null,
        user_id: userId || null,
        metadata: { merchant_request_id: merchantRequestId, created_at: new Date().toISOString() },
      });

      // Schedule simulated completion: update status after 5-8 seconds via a delayed self-call
      const delay = 5000 + Math.random() * 3000;
      setTimeout(async () => {
        try {
          const newStatus = Math.random() < 0.9 ? "completed" : "failed";
          const finalTxId = newStatus === "completed" ? "MPESA" + Date.now().toString(36).toUpperCase() : checkoutId;
          
          await supabase
            .from("payment_receipts")
            .update({ 
              status: newStatus, 
              transaction_id: finalTxId,
              metadata: { merchant_request_id: merchantRequestId, completed_at: new Date().toISOString() } 
            })
            .eq("checkout_request_id", checkoutId)
            .eq("status", "pending");

          // If completed, update booking status
          if (newStatus === "completed" && bookingId) {
            await supabase.from("bookings").update({ status: "confirmed" }).eq("id", bookingId);
          }
        } catch (e) {
          console.error("Simulated completion error:", e);
        }
      }, delay);

      console.log(`STK Push initiated: ${checkoutId} for ${formattedPhone}, KSh ${amount}`);

      return new Response(
        JSON.stringify({
          success: true,
          checkoutRequestId: checkoutId,
          merchantRequestId,
          message: "STK push sent. Check your phone to complete payment.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION 2: Query transaction status
    if (action === "query") {
      if (!checkoutRequestId) {
        return new Response(
          JSON.stringify({ success: false, error: "checkoutRequestId is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: receipt, error } = await supabase
        .from("payment_receipts")
        .select("*")
        .eq("checkout_request_id", checkoutRequestId)
        .maybeSingle();

      if (error || !receipt) {
        return new Response(
          JSON.stringify({ success: false, status: "not_found", error: "Transaction not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Auto-expire after 2 minutes
      const createdAt = new Date(receipt.created_at).getTime();
      if (Date.now() - createdAt > 120000 && receipt.status === "pending") {
        await supabase
          .from("payment_receipts")
          .update({ status: "expired" })
          .eq("id", receipt.id)
          .eq("status", "pending");
        
        return new Response(
          JSON.stringify({ success: true, status: "expired", amount: receipt.amount, phone: receipt.phone }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update booking if just completed
      if (receipt.status === "completed" && bookingId) {
        await supabase.from("bookings").update({ status: "confirmed" }).eq("id", bookingId);
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: receipt.status,
          transactionId: receipt.status === "completed" ? receipt.transaction_id : undefined,
          amount: receipt.amount,
          phone: receipt.phone,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action. Use 'initiate' or 'query'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("M-Pesa function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

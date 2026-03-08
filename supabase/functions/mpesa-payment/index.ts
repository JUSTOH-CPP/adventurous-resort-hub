import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory store for demo (in production, use a database table)
const pendingTransactions = new Map<
  string,
  { status: string; phone: string; amount: number; createdAt: number }
>();

// Simulate STK push lifecycle: pending -> completed after ~5-8 seconds
function simulatePaymentCompletion(checkoutRequestId: string) {
  const delay = 5000 + Math.random() * 3000; // 5-8 seconds
  setTimeout(() => {
    const tx = pendingTransactions.get(checkoutRequestId);
    if (tx && tx.status === "pending") {
      // 90% success rate for simulation
      tx.status = Math.random() < 0.9 ? "completed" : "failed";
    }
  }, delay);
}

function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  }
  if (!cleaned.startsWith("254")) {
    cleaned = "254" + cleaned;
  }
  return cleaned;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, phone, amount, checkoutRequestId, bookingId, userId } =
      await req.json();

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

      // Generate a checkout request ID (simulating Daraja API response)
      const checkoutId = "ws_CO_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const merchantRequestId = "MR" + Date.now().toString(36).toUpperCase();

      // Store the pending transaction
      pendingTransactions.set(checkoutId, {
        status: "pending",
        phone: formattedPhone,
        amount,
        createdAt: Date.now(),
      });

      // Simulate async payment completion
      simulatePaymentCompletion(checkoutId);

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

      const tx = pendingTransactions.get(checkoutRequestId);

      if (!tx) {
        return new Response(
          JSON.stringify({
            success: false,
            status: "not_found",
            error: "Transaction not found",
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Auto-expire after 2 minutes
      if (Date.now() - tx.createdAt > 120000 && tx.status === "pending") {
        tx.status = "expired";
      }

      const transactionId =
        tx.status === "completed"
          ? "MPESA" + Date.now().toString(36).toUpperCase()
          : undefined;

      // On completion: update booking + store receipt
      if (tx.status === "completed" && transactionId) {
        try {
          const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
          );

          // Update booking status
          if (bookingId) {
            await supabase
              .from("bookings")
              .update({ status: "confirmed" })
              .eq("id", bookingId);
          }

          // Store payment receipt
          const { error: receiptError } = await supabase
            .from("payment_receipts")
            .insert({
              booking_id: bookingId || null,
              user_id: userId || null,
              transaction_id: transactionId,
              checkout_request_id: checkoutRequestId,
              payment_method: "mpesa",
              phone: tx.phone,
              amount: tx.amount,
              currency: "KES",
              status: "completed",
              metadata: {
                checkout_request_id: checkoutRequestId,
                completed_at: new Date().toISOString(),
              },
            });

          if (receiptError) {
            console.error("Failed to store receipt:", receiptError);
          } else {
            console.log("Payment receipt stored for transaction:", transactionId);
          }
        } catch (e) {
          console.error("Failed to update booking/store receipt:", e);
        }
      }

      // Clean up completed/failed/expired transactions after returning
      if (tx.status !== "pending") {
        setTimeout(() => pendingTransactions.delete(checkoutRequestId), 60000);
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: tx.status,
          transactionId,
          amount: tx.amount,
          phone: tx.phone,
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

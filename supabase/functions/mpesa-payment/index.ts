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
  if (cleaned.startsWith("+")) cleaned = cleaned.substring(1);
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.substring(1);
  if (!cleaned.startsWith("254")) cleaned = "254" + cleaned;
  return cleaned;
}

function getDarajaBase(): string {
  const env = (Deno.env.get("MPESA_ENV") || "sandbox").toLowerCase();
  return env === "production" || env === "live"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function getAccessToken(): Promise<string> {
  const key = Deno.env.get("MPESA_CONSUMER_KEY");
  const secret = Deno.env.get("MPESA_CONSUMER_SECRET");
  if (!key || !secret) throw new Error("Missing MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET");
  const creds = btoa(`${key}:${secret}`);
  const res = await fetch(
    `${getDarajaBase()}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${creds}` } }
  );
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Daraja auth failed: ${JSON.stringify(data)}`);
  }
  return data.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, phone, amount, checkoutRequestId, bookingId, userId, accountReference, description } =
      await req.json();
    const supabase = getSupabase();

    const shortcode = Deno.env.get("MPESA_SHORTCODE")!;
    const passkey = Deno.env.get("MPESA_PASSKEY")!;
    const projectRef = (Deno.env.get("SUPABASE_URL") || "").match(/https:\/\/([^.]+)/)?.[1];
    const callbackUrl = `https://${projectRef}.supabase.co/functions/v1/mpesa-callback`;

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

      const token = await getAccessToken();
      const ts = timestamp();
      const password = btoa(`${shortcode}${passkey}${ts}`);
      const amountInt = Math.max(1, Math.round(Number(amount)));

      const stkBody = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: ts,
        TransactionType: "CustomerPayBillOnline",
        Amount: amountInt,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: (accountReference || bookingId || "Booking").toString().slice(0, 12),
        TransactionDesc: (description || "Savanna Lodge Booking").toString().slice(0, 13),
      };

      const stkRes = await fetch(`${getDarajaBase()}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(stkBody),
      });
      const stkData = await stkRes.json();
      console.log("STK Push response:", JSON.stringify(stkData));

      if (!stkRes.ok || stkData.ResponseCode !== "0") {
        return new Response(
          JSON.stringify({
            success: false,
            error: stkData.errorMessage || stkData.ResponseDescription || "STK push failed",
            details: stkData,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const checkoutId: string = stkData.CheckoutRequestID;
      const merchantRequestId: string = stkData.MerchantRequestID;

      await supabase.from("payment_receipts").insert({
        transaction_id: checkoutId,
        checkout_request_id: checkoutId,
        phone: formattedPhone,
        amount: amountInt,
        status: "pending",
        payment_method: "mpesa",
        currency: "KES",
        booking_id: bookingId || null,
        user_id: userId || null,
        metadata: {
          merchant_request_id: merchantRequestId,
          timestamp: ts,
          created_at: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          checkoutRequestId: checkoutId,
          merchantRequestId,
          message: stkData.CustomerMessage || "STK push sent. Check your phone to complete payment.",
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

      const { data: receipt } = await supabase
        .from("payment_receipts")
        .select("*")
        .eq("checkout_request_id", checkoutRequestId)
        .maybeSingle();

      if (!receipt) {
        return new Response(
          JSON.stringify({ success: false, status: "not_found", error: "Transaction not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If callback already updated, return current state
      if (receipt.status !== "pending") {
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

      // Otherwise, actively query Daraja
      try {
        const token = await getAccessToken();
        const ts = timestamp();
        const password = btoa(`${shortcode}${passkey}${ts}`);
        const qRes = await fetch(`${getDarajaBase()}/mpesa/stkpushquery/v1/query`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: ts,
            CheckoutRequestID: checkoutRequestId,
          }),
        });
        const qData = await qRes.json();
        console.log("STK Query response:", JSON.stringify(qData));

        // ResultCode "0" = success; "1032" = cancelled; "1037" = no response; others = failed
        if (qData.ResultCode === "0") {
          await supabase
            .from("payment_receipts")
            .update({
              status: "completed",
              metadata: { ...((receipt.metadata as any) || {}), query_result: qData },
            })
            .eq("id", receipt.id)
            .eq("status", "pending");

          if (receipt.booking_id) {
            await supabase.from("bookings").update({ status: "confirmed" }).eq("id", receipt.booking_id);
          }

          return new Response(
            JSON.stringify({
              success: true,
              status: "completed",
              transactionId: receipt.transaction_id,
              amount: receipt.amount,
              phone: receipt.phone,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Treat explicit failures as failed; "still processing" stays pending
        const stillProcessing = qData.errorCode === "500.001.1001"; // request being processed
        if (!stillProcessing && qData.ResultCode && qData.ResultCode !== "0") {
          await supabase
            .from("payment_receipts")
            .update({
              status: "failed",
              metadata: { ...((receipt.metadata as any) || {}), query_result: qData },
            })
            .eq("id", receipt.id)
            .eq("status", "pending");

          return new Response(
            JSON.stringify({
              success: true,
              status: "failed",
              amount: receipt.amount,
              phone: receipt.phone,
              error: qData.ResultDesc,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (e) {
        console.error("STK query error:", e);
      }

      // Auto-expire after 2 minutes
      const createdAt = new Date(receipt.created_at).getTime();
      if (Date.now() - createdAt > 120000) {
        await supabase.from("payment_receipts").update({ status: "expired" }).eq("id", receipt.id).eq("status", "pending");
        return new Response(
          JSON.stringify({ success: true, status: "expired", amount: receipt.amount, phone: receipt.phone }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, status: "pending", amount: receipt.amount, phone: receipt.phone }),
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

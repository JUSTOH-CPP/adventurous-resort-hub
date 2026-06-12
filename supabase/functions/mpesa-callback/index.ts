import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const payload = await req.json();
    console.log("M-Pesa callback received:", JSON.stringify(payload));

    const stk = payload?.Body?.stkCallback;
    if (!stk) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const checkoutRequestId = stk.CheckoutRequestID;
    const resultCode = stk.ResultCode;
    const resultDesc = stk.ResultDesc;

    const { data: receipt } = await supabase
      .from("payment_receipts")
      .select("*")
      .eq("checkout_request_id", checkoutRequestId)
      .maybeSingle();

    if (!receipt) {
      console.warn("No receipt for CheckoutRequestID:", checkoutRequestId);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (resultCode === 0) {
      const items: Array<{ Name: string; Value: any }> =
        stk.CallbackMetadata?.Item || [];
      const get = (n: string) => items.find((i) => i.Name === n)?.Value;
      const mpesaReceipt = get("MpesaReceiptNumber");
      const amount = get("Amount");
      const phone = get("PhoneNumber");

      await supabase
        .from("payment_receipts")
        .update({
          status: "completed",
          transaction_id: mpesaReceipt || receipt.transaction_id,
          metadata: {
            ...((receipt.metadata as any) || {}),
            callback: stk,
            mpesa_receipt: mpesaReceipt,
            confirmed_amount: amount,
            confirmed_phone: phone,
          },
        })
        .eq("id", receipt.id);

      if (receipt.booking_id) {
        await supabase.from("bookings").update({ status: "confirmed" }).eq("id", receipt.booking_id);
      }
    } else {
      await supabase
        .from("payment_receipts")
        .update({
          status: "failed",
          metadata: { ...((receipt.metadata as any) || {}), callback: stk, result_desc: resultDesc },
        })
        .eq("id", receipt.id);
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Callback error:", e);
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

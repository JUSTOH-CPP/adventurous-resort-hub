import { supabase } from "@/integrations/supabase/client";

interface StkPushResponse {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  message?: string;
  error?: string;
}

interface PaymentStatusResponse {
  success: boolean;
  status: "pending" | "completed" | "failed" | "expired" | "not_found";
  transactionId?: string;
  amount?: number;
  phone?: string;
  error?: string;
}

/**
 * Initiate M-Pesa STK Push
 */
export const initiateStkPush = async (
  phone: string,
  amount: number
): Promise<StkPushResponse> => {
  const { data, error } = await supabase.functions.invoke("mpesa-payment", {
    body: { action: "initiate", phone, amount },
  });

  if (error) {
    console.error("STK Push error:", error);
    return { success: false, error: error.message || "Failed to initiate M-Pesa payment" };
  }

  return data as StkPushResponse;
};

/**
 * Query M-Pesa payment status
 */
export const queryPaymentStatus = async (
  checkoutRequestId: string,
  bookingId?: string
): Promise<PaymentStatusResponse> => {
  const { data, error } = await supabase.functions.invoke("mpesa-payment", {
    body: { action: "query", checkoutRequestId, bookingId },
  });

  if (error) {
    console.error("Payment status query error:", error);
    return { success: false, status: "not_found", error: error.message };
  }

  return data as PaymentStatusResponse;
};

/**
 * Poll for M-Pesa payment completion
 * Calls onStatusChange on each poll, resolves when terminal state reached
 */
export const pollPaymentStatus = (
  checkoutRequestId: string,
  options: {
    intervalMs?: number;
    maxAttempts?: number;
    bookingId?: string;
    onStatusChange?: (status: PaymentStatusResponse) => void;
  } = {}
): { promise: Promise<PaymentStatusResponse>; cancel: () => void } => {
  const { intervalMs = 3000, maxAttempts = 40, bookingId, onStatusChange } = options;
  let cancelled = false;
  let attempt = 0;

  const cancel = () => {
    cancelled = true;
  };

  const promise = new Promise<PaymentStatusResponse>((resolve) => {
    const poll = async () => {
      if (cancelled) {
        resolve({ success: false, status: "expired", error: "Polling cancelled" });
        return;
      }

      attempt++;
      const result = await queryPaymentStatus(checkoutRequestId, bookingId);
      onStatusChange?.(result);

      if (result.status === "completed" || result.status === "failed" || result.status === "expired") {
        resolve(result);
        return;
      }

      if (attempt >= maxAttempts) {
        resolve({ success: false, status: "expired", error: "Payment timed out. Please check your M-Pesa messages." });
        return;
      }

      setTimeout(poll, intervalMs);
    };

    poll();
  });

  return { promise, cancel };
};

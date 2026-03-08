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

export interface PaymentReceipt {
  id: string;
  booking_id: string | null;
  user_id: string | null;
  transaction_id: string;
  checkout_request_id: string | null;
  payment_method: string;
  phone: string | null;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
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
  bookingId?: string,
  userId?: string
): Promise<PaymentStatusResponse> => {
  const { data, error } = await supabase.functions.invoke("mpesa-payment", {
    body: { action: "query", checkoutRequestId, bookingId, userId },
  });

  if (error) {
    console.error("Payment status query error:", error);
    return { success: false, status: "not_found", error: error.message };
  }

  return data as PaymentStatusResponse;
};

/**
 * Poll for M-Pesa payment completion
 */
export const pollPaymentStatus = (
  checkoutRequestId: string,
  options: {
    intervalMs?: number;
    maxAttempts?: number;
    bookingId?: string;
    userId?: string;
    onStatusChange?: (status: PaymentStatusResponse) => void;
  } = {}
): { promise: Promise<PaymentStatusResponse>; cancel: () => void } => {
  const { intervalMs = 3000, maxAttempts = 40, bookingId, userId, onStatusChange } = options;
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
      const result = await queryPaymentStatus(checkoutRequestId, bookingId, userId);
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

/**
 * Get payment receipts for the current user
 */
export const getUserPaymentReceipts = async (): Promise<PaymentReceipt[]> => {
  const { data, error } = await supabase
    .from("payment_receipts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payment receipts:", error);
    return [];
  }

  return (data || []) as unknown as PaymentReceipt[];
};

/**
 * Get payment receipt by booking ID
 */
export const getReceiptByBookingId = async (bookingId: string): Promise<PaymentReceipt | null> => {
  const { data, error } = await supabase
    .from("payment_receipts")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching receipt:", error);
    return null;
  }

  return data as unknown as PaymentReceipt | null;
};

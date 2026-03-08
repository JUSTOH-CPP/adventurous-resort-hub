
CREATE TABLE public.payment_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id uuid,
  transaction_id text NOT NULL,
  checkout_request_id text,
  payment_method text NOT NULL DEFAULT 'mpesa',
  phone text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  status text NOT NULL DEFAULT 'completed',
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;

-- Users can view their own receipts
CREATE POLICY "Users can view their own receipts"
  ON public.payment_receipts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all receipts
CREATE POLICY "Admins can view all receipts"
  ON public.payment_receipts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow insert from edge functions (service role) and authenticated users for their own
CREATE POLICY "Users can insert their own receipts"
  ON public.payment_receipts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow anon/service inserts (edge function uses service role key)
CREATE POLICY "Service role can insert receipts"
  ON public.payment_receipts FOR INSERT
  TO anon
  WITH CHECK (true);

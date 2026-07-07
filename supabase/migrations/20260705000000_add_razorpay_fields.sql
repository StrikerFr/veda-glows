-- Add Razorpay integration fields to orders table
ALTER TABLE public.orders 
ADD COLUMN razorpay_order_id TEXT,
ADD COLUMN razorpay_payment_id TEXT,
ADD COLUMN razorpay_signature TEXT,
ADD COLUMN payment_timestamp TIMESTAMPTZ;

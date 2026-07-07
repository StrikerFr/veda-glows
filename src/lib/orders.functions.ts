import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { requireSupabaseAuth, optionalSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const addressSchema = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().min(7).max(20),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional().nullable(),
  city: z.string().min(1).max(80),
  state: z.string().min(1).max(80),
  pincode: z.string().min(4).max(12),
  country: z.string().min(1).max(80).default("India"),
});

const itemSchema = z.object({
  product_sku: z.string().min(1).max(64),
  product_name: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(20),
  unit_price: z.number().min(0),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([optionalSupabaseAuth])
  .inputValidator(
    (input: {
      items: Array<{ product_sku: string; product_name: string; quantity: number; unit_price: number }>;
      address: z.infer<typeof addressSchema>;
      coupon_code?: string | null;
      payment_method: "cod" | "online";
      email: string;
    }) =>
      z
        .object({
          items: z.array(itemSchema).min(1),
          address: addressSchema,
          coupon_code: z.string().max(64).optional().nullable(),
          payment_method: z.enum(["cod", "online"]),
          email: z.string().email(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Recompute totals server-side (NEVER trust client)
    // Apply linear pricing for starter kits
    const qty = data.items.reduce((s, i) => s + i.quantity, 0);
    let subtotal = qty * 499;

    let discount = 0;
    let couponId: string | null = null;
    let couponCode: string | null = null;

    if (data.coupon_code) {
      const code = data.coupon_code.toUpperCase();
      if (code === "ROHIT5") {
        if (qty >= 2) {
          discount = Math.max(0, subtotal - 499);
          couponId = "rohit5";
          couponCode = "ROHIT5";
        }
      } else if (code === "VDG10") {
        discount = Math.round((subtotal * 10) / 100);
        couponId = "vdg10";
        couponCode = "VDG10";
      } else {
        const { data: c } = await supabaseAdmin
          .from("coupons")
          .select("*")
          .eq("code", code)
          .maybeSingle();
        if (c && c.active && (!c.expires_at || new Date(c.expires_at) > new Date()) &&
            (c.max_uses == null || c.used_count < c.max_uses)) {
          discount =
            c.discount_type === "percentage"
              ? Math.round((subtotal * Number(c.discount_value)) / 100)
              : Math.min(Number(c.discount_value), subtotal);
          couponId = c.id;
          couponCode = c.code;
        }
      }
    }

    const shipping = 0;
    const codFee = 0;
    const total = Math.max(0, subtotal - discount + shipping + codFee);

    let razorpayOrderId: string | null = null;
    let razorpayAmount = data.payment_method === "cod" ? Math.min(total, 40) * 100 : total * 100;

    if (razorpayAmount > 0) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });
      const rpOrder = await razorpay.orders.create({
        amount: razorpayAmount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      razorpayOrderId = rpOrder.id;
    }

    const initialPaymentStatus = (total === 0) ? "paid" : "pending";

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: (userId ?? null) as any,
        subtotal,
        discount,
        shipping,
        total,
        coupon_id: couponId,
        coupon_code: couponCode,
        shipping_address: data.address,
        customer_name: data.address.full_name,
        customer_email: data.email,
        customer_phone: data.address.phone,
        payment_method: data.payment_method,
        payment_status: initialPaymentStatus,
        status: "pending",
        razorpay_order_id: razorpayOrderId,
      })
      .select()
      .single();

    if (orderErr || !order) throw new Error(orderErr?.message ?? "Order failed");

    // Insert items (recompute line totals server-side)
    const itemsToInsert = data.items.map((i) => ({
      order_id: order.id,
      product_sku: i.product_sku,
      product_name: i.product_name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      line_total: i.unit_price * i.quantity,
    }));
    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(itemsToInsert);
    if (itemsErr) throw new Error(itemsErr.message);

    // Track coupon usage and bump used_count
    if (couponId) {
      await supabaseAdmin.from("coupon_usage").insert({
        coupon_id: couponId,
        user_id: (userId ?? null) as any,
        order_id: order.id,
        discount_amount: discount,
      });
      await supabaseAdmin
        .from("coupons")
        .update({ used_count: (await supabaseAdmin.from("coupons").select("used_count").eq("id", couponId).single()).data!.used_count + 1 })
        .eq("id", couponId);
    }


    return { ok: true as const, orderId: order.id, orderNumber: order.order_number, razorpayOrderId, amount: razorpayAmount, currency: "INR", keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID };
  });

export const verifyPayment = createServerFn({ method: "POST" })
  .middleware([optionalSupabaseAuth])
  .inputValidator(
    (input: {
      orderId: string;
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) =>
      z
        .object({
          orderId: z.string().uuid(),
          razorpay_payment_id: z.string(),
          razorpay_order_id: z.string(),
          razorpay_signature: z.string(),
        })
        .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Verify signature
    const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      await supabaseAdmin
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", data.orderId);
      throw new Error("Invalid signature");
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        payment_status: "paid",
        status: "processing",
        payment_timestamp: new Date().toISOString(),
      })
      .eq("id", data.orderId);

    if (error) throw new Error(error.message);

    return { ok: true };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { orders: data ?? [] };
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { order, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID };
  });

export const markPaymentFailed = createServerFn({ method: "POST" })
  .middleware([optionalSupabaseAuth])
  .inputValidator((input: { orderId: string }) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("orders").update({ payment_status: "failed" }).eq("id", data.orderId);
    return { ok: true };
  });

export const getCompletedOrderCount = createServerFn({ method: "GET" })
  .middleware([optionalSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    if (!userId) return { count: 0 };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("status", "cancelled");
    if (error) return { count: 0 };
    return { count: count ?? 0 };
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function daysAgo(n: number) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - n); return d; }
function pct(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 1000) / 10;
}

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: orders }, { count: usersCount }, { data: coupons }, { data: usage }, { data: items }] = await Promise.all([
      supabaseAdmin.from("orders").select("id, total, status, created_at, order_number, customer_name, customer_email, payment_method, payment_status, customer_phone, coupon_code").order("created_at", { ascending: false }),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("coupons").select("id, code, active, used_count"),
      supabaseAdmin.from("coupon_usage").select("coupon_id, discount_amount, coupons(code)"),
      supabaseAdmin.from("order_items").select("product_sku, product_name, quantity, line_total, order_id"),
    ]);
    const allOrders = orders ?? [];
    const nonCancelled = allOrders.filter((o) => o.status !== "cancelled");
    const revenue = nonCancelled.reduce((s, o) => s + Number(o.total), 0);
    const today = startOfDay(new Date());
    const todayOrders = nonCancelled.filter((o) => new Date(o.created_at) >= today);
    const todayRevenue = todayOrders.reduce((s, o) => s + Number(o.total), 0);

    // 30 day series
    const series: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const start = daysAgo(i);
      const end = daysAgo(i - 1);
      const dayOrders = nonCancelled.filter((o) => {
        const t = new Date(o.created_at);
        return t >= start && t < end;
      });
      series.push({
        date: start.toISOString().slice(5, 10),
        revenue: Math.round(dayOrders.reduce((s, o) => s + Number(o.total), 0)),
        orders: dayOrders.length,
      });
    }

    // 7d vs prev 7d deltas
    const last7 = nonCancelled.filter((o) => new Date(o.created_at) >= daysAgo(7));
    const prev7 = nonCancelled.filter((o) => {
      const t = new Date(o.created_at);
      return t >= daysAgo(14) && t < daysAgo(7);
    });
    const revLast7 = last7.reduce((s, o) => s + Number(o.total), 0);
    const revPrev7 = prev7.reduce((s, o) => s + Number(o.total), 0);

    const aov = nonCancelled.length ? revenue / nonCancelled.length : 0;
    const aovLast7 = last7.length ? revLast7 / last7.length : 0;
    const aovPrev7 = prev7.length ? revPrev7 / prev7.length : 0;

    // Top products
    const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
    (items ?? []).forEach((i) => {
      const cur = productMap.get(i.product_sku) ?? { name: i.product_name, qty: 0, revenue: 0 };
      cur.qty += i.quantity;
      cur.revenue += Number(i.line_total);
      productMap.set(i.product_sku, cur);
    });
    const topProducts = [...productMap.entries()]
      .map(([sku, v]) => ({ sku, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Starter kit bundle breakdown
    const kit1 = productMap.get("VG-STARTER-1")?.qty ?? 0;
    const kit2 = productMap.get("VG-STARTER-2")?.qty ?? 0;
    const kit3 = productMap.get("VG-STARTER-3")?.qty ?? 0;
    const totalKits = kit1 + kit2 + kit3;
    const bundleUpgradeRate = totalKits ? Math.round(((kit2 + kit3) / totalKits) * 1000) / 10 : 0;

    // Coupon performance
    const couponStats = new Map<string, { code: string; uses: number; revenue: number }>();
    (usage ?? []).forEach((u: any) => {
      const code = u.coupons?.code ?? "?";
      const cur = couponStats.get(code) ?? { code, uses: 0, revenue: 0 };
      cur.uses += 1;
      cur.revenue += Number(u.discount_amount);
      couponStats.set(code, cur);
    });
    const couponPerf = [...couponStats.values()].sort((a, b) => b.uses - a.uses).slice(0, 6);
    const mostUsedCoupon = couponPerf[0]?.code ?? "—";
    const couponUsageCount = (usage ?? []).length;
    const ordersWithCoupon = nonCancelled.filter((o) => o.coupon_code).length;
    const couponUseRate = nonCancelled.length ? Math.round((ordersWithCoupon / nonCancelled.length) * 1000) / 10 : 0;

    // Conversion / checkout completion (proxy: paid+delivered+shipped over all non-cancelled)
    const completed = nonCancelled.filter((o) => ["shipped", "delivered"].includes(o.status as string)).length;
    const checkoutCompletion = nonCancelled.length ? Math.round((completed / nonCancelled.length) * 1000) / 10 : 0;

    return {
      totalOrders: allOrders.length,
      totalRevenue: revenue,
      totalUsers: usersCount ?? 0,
      pendingOrders: allOrders.filter((o) => o.status === "pending").length,
      deliveredOrders: allOrders.filter((o) => o.status === "delivered").length,
      shippedOrders: allOrders.filter((o) => o.status === "shipped").length,
      cancelledOrders: allOrders.filter((o) => o.status === "cancelled").length,
      activeCoupons: (coupons ?? []).filter((c) => c.active).length,
      recentOrders: allOrders.slice(0, 6),
      todayRevenue,
      todayOrders: todayOrders.length,
      aov,
      deltas: {
        revenue: pct(revLast7, revPrev7),
        orders: pct(last7.length, prev7.length),
        aov: pct(Math.round(aovLast7), Math.round(aovPrev7)),
      },
      series,
      topProducts,
      couponPerf,
      couponUsageCount,
      couponUseRate,
      mostUsedCoupon,
      starterKits: { kit1, kit2, kit3, totalKits },
      bundleUpgradeRate,
      checkoutCompletion,
    };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { orders: data ?? [] };
  });

export const adminGetOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    return { order };
  });

export const adminUpdateOrderNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; notes: string }) =>
    z.object({ id: z.string().uuid(), notes: z.string().max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").update({ notes: data.notes }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdatePaymentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; payment_status: string }) =>
    z.object({
      id: z.string().uuid(),
      payment_status: z.enum(["pending", "paid", "failed", "refunded"]),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").update({ payment_status: data.payment_status as any }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status as any }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles } = await supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: orders } = await supabaseAdmin.from("orders").select("user_id, total, status");
    const map = new Map<string, { count: number; spent: number }>();
    (orders ?? []).forEach((o) => {
      const cur = map.get(o.user_id) ?? { count: 0, spent: 0 };
      cur.count += 1;
      if (o.status !== "cancelled") cur.spent += Number(o.total);
      map.set(o.user_id, cur);
    });
    return {
      users: (profiles ?? []).map((p) => ({
        ...p,
        total_orders: map.get(p.id)?.count ?? 0,
        total_spent: map.get(p.id)?.spent ?? 0,
      })),
    };
  });

export const adminGetUserDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: profile }, { data: orders }, { data: coupons }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", data.id).maybeSingle(),
      supabaseAdmin.from("orders").select("*").eq("user_id", data.id).order("created_at", { ascending: false }),
      supabaseAdmin.from("coupon_usage").select("*, coupons(code)").eq("user_id", data.id),
    ]);
    const lifetime = (orders ?? []).filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
    return { profile, orders: orders ?? [], coupons: coupons ?? [], lifetime };
  });

export const adminListCoupons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: coupons } = await supabaseAdmin.from("coupons").select("*").order("created_at", { ascending: false });
    const { data: usage } = await supabaseAdmin.from("coupon_usage").select("coupon_id, discount_amount, order_id, orders(total, status)");
    const stats = new Map<string, { revenue: number; uses: number }>();
    (usage ?? []).forEach((u: any) => {
      const cur = stats.get(u.coupon_id) ?? { revenue: 0, uses: 0 };
      cur.uses += 1;
      if (u.orders && u.orders.status !== "cancelled") cur.revenue += Number(u.orders.total);
      stats.set(u.coupon_id, cur);
    });
    return {
      coupons: (coupons ?? []).map((c) => ({
        ...c,
        analytics_revenue: stats.get(c.id)?.revenue ?? 0,
        analytics_uses: stats.get(c.id)?.uses ?? 0,
      })),
    };
  });

export const adminUpsertCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: any) =>
    z.object({
      id: z.string().uuid().optional().nullable(),
      code: z.string().min(2).max(40).regex(/^[A-Z0-9_-]+$/i),
      discount_type: z.enum(["percentage", "flat"]),
      discount_value: z.number().positive(),
      max_uses: z.number().int().positive().nullable().optional(),
      expires_at: z.string().nullable().optional(),
      active: z.boolean(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload: any = {
      code: data.code.toUpperCase(),
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      max_uses: data.max_uses ?? null,
      expires_at: data.expires_at || null,
      active: data.active,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("coupons").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("coupons").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("coupons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

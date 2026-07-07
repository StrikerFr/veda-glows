import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PRODUCTS } from "@/lib/products";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: overrides } = await (supabaseAdmin as any).from("product_overrides").select("*");
    const map = new Map<string, any>();
    (overrides ?? []).forEach((o: any) => map.set(o.sku, o));
    const products = Object.values(PRODUCTS).map((p) => {
      const o = map.get(p.sku) ?? {};
      return {
        sku: p.sku,
        name: o.name ?? p.name,
        description: o.description ?? p.description,
        price: o.price != null ? Number(o.price) : p.price,
        mrp: o.mrp != null ? Number(o.mrp) : p.compareAt,
        stock: o.stock ?? 0,
        visible: o.visible ?? true,
        enabled: o.enabled ?? true,
        image_url: o.image_url ?? null,
        default: { name: p.name, price: p.price, mrp: p.compareAt, description: p.description },
      };
    });
    return { products };
  });

const productSchema = z.object({
  sku: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  description: z.string().max(2000),
  price: z.number().min(0).max(1_000_000),
  mrp: z.number().min(0).max(1_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  visible: z.boolean(),
  enabled: z.boolean(),
  image_url: z.string().url().max(500).optional().nullable().or(z.literal("")),
});

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...data, image_url: data.image_url || null, updated_at: new Date().toISOString() };
    const { error } = await (supabaseAdmin as any).from("product_overrides").upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

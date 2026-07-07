import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any).from("store_settings").select("*").eq("id", "singleton").maybeSingle();
    if (error) throw new Error(error.message);
    return { settings: data };
  });

const settingsSchema = z.object({
  store_name: z.string().min(1).max(120),
  logo_url: z.string().url().max(500).optional().nullable().or(z.literal("")),
  support_email: z.string().email().max(200),
  shipping_charge: z.number().min(0).max(100000),
  cod_enabled: z.boolean(),
  razorpay_key_id: z.string().max(200).optional().nullable().or(z.literal("")),
  social_instagram: z.string().max(200).optional().nullable().or(z.literal("")),
  social_facebook: z.string().max(200).optional().nullable().or(z.literal("")),
  social_youtube: z.string().max(200).optional().nullable().or(z.literal("")),
  social_twitter: z.string().max(200).optional().nullable().or(z.literal("")),
});

export const adminUpdateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => settingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("store_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", "singleton");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

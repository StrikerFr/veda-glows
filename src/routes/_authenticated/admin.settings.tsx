import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetSettings, adminUpdateSettings } from "@/lib/settings.functions";
import { toast } from "sonner";
import { Store, Mail, Truck, CreditCard, Instagram, Facebook, Youtube, Twitter, Save } from "lucide-react";
import { ImmersiveLoader } from "@/components/ImmersiveLoader";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

type Form = {
  store_name: string;
  logo_url: string;
  support_email: string;
  shipping_charge: number;
  cod_enabled: boolean;
  razorpay_key_id: string;
  social_instagram: string;
  social_facebook: string;
  social_youtube: string;
  social_twitter: string;
};

const EMPTY: Form = {
  store_name: "VedaGlows",
  logo_url: "",
  support_email: "hello@vedaglow.in",
  shipping_charge: 0,
  cod_enabled: true,
  razorpay_key_id: "",
  social_instagram: "",
  social_facebook: "",
  social_youtube: "",
  social_twitter: "",
};

function AdminSettings() {
  const get = useServerFn(adminGetSettings);
  const update = useServerFn(adminUpdateSettings);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => get() });
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      setForm({
        store_name: data.settings.store_name ?? "VedaGlows",
        logo_url: data.settings.logo_url ?? "",
        support_email: data.settings.support_email ?? "",
        shipping_charge: Number(data.settings.shipping_charge ?? 0),
        cod_enabled: !!data.settings.cod_enabled,
        razorpay_key_id: data.settings.razorpay_key_id ?? "",
        social_instagram: data.settings.social_instagram ?? "",
        social_facebook: data.settings.social_facebook ?? "",
        social_youtube: data.settings.social_youtube ?? "",
        social_twitter: data.settings.social_twitter ?? "",
      });
    }
  }, [data]);

  async function save() {
    setSaving(true);
    try {
      await update({ data: form });
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <ImmersiveLoader message="Loading settings…" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <Card icon={<Store className="h-4 w-4" />} title="Store Profile" desc="Name and logo customers see across the storefront.">
          <Field label="Store name">
            <input className={inputCls} value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} />
          </Field>
          <Field label="Logo URL">
            <input className={inputCls} placeholder="https://…" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
          </Field>
        </Card>

        <Card icon={<Mail className="h-4 w-4" />} title="Support & Contact" desc="Where order confirmations and customer replies come from.">
          <Field label="Support email">
            <input className={inputCls} type="email" value={form.support_email} onChange={(e) => setForm({ ...form, support_email: e.target.value })} />
          </Field>
        </Card>

        <Card icon={<Truck className="h-4 w-4" />} title="Shipping & Fulfillment" desc="Default shipping charge and payment methods at checkout.">
          <Field label="Shipping charge (₹)">
            <input className={inputCls} type="number" min={0} value={form.shipping_charge} onChange={(e) => setForm({ ...form, shipping_charge: Number(e.target.value) })} />
          </Field>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-foreground/8 bg-[#FAF7F0]/60 px-4 py-3 mt-2">
            <div>
              <div className="text-sm font-medium">Cash on Delivery</div>
              <div className="text-xs text-foreground/55">Allow customers to pay on delivery.</div>
            </div>
            <Toggle checked={form.cod_enabled} onChange={(v) => setForm({ ...form, cod_enabled: v })} />
          </label>
        </Card>

        <Card icon={<CreditCard className="h-4 w-4" />} title="Payments" desc="Razorpay credentials for online payments.">
          <Field label="Razorpay Key ID">
            <input className={inputCls} value={form.razorpay_key_id} onChange={(e) => setForm({ ...form, razorpay_key_id: e.target.value })} placeholder="rzp_live_…" />
          </Field>
          <p className="text-[11px] text-foreground/50 mt-1">
            Razorpay secret key is stored as a server secret and never exposed in the dashboard.
          </p>
        </Card>
      </div>

      <div className="space-y-5">
        <Card icon={<Instagram className="h-4 w-4" />} title="Social Links" desc="Shown in footer and contact pages.">
          <Field label={<span className="inline-flex items-center gap-1.5"><Instagram className="h-3 w-3" /> Instagram</span>}>
            <input className={inputCls} value={form.social_instagram} onChange={(e) => setForm({ ...form, social_instagram: e.target.value })} />
          </Field>
          <Field label={<span className="inline-flex items-center gap-1.5"><Facebook className="h-3 w-3" /> Facebook</span>}>
            <input className={inputCls} value={form.social_facebook} onChange={(e) => setForm({ ...form, social_facebook: e.target.value })} />
          </Field>
          <Field label={<span className="inline-flex items-center gap-1.5"><Youtube className="h-3 w-3" /> YouTube</span>}>
            <input className={inputCls} value={form.social_youtube} onChange={(e) => setForm({ ...form, social_youtube: e.target.value })} />
          </Field>
          <Field label={<span className="inline-flex items-center gap-1.5"><Twitter className="h-3 w-3" /> Twitter / X</span>}>
            <input className={inputCls} value={form.social_twitter} onChange={(e) => setForm({ ...form, social_twitter: e.target.value })} />
          </Field>
        </Card>

        <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-[#143A2A] to-[#1f4a36] p-5 text-[#F4ECDC] shadow-lg">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#D4B978] mb-1">Ready to ship</div>
          <div className="font-serif text-xl mb-1">Apply changes</div>
          <p className="text-xs text-[#F4ECDC]/70 mb-4">Updates take effect across the storefront immediately.</p>
          <button
            onClick={save}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#D4B978] text-[#143A2A] py-2.5 text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#e0c688] disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-foreground/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#143A2A]/40 focus:ring-2 focus:ring-[#143A2A]/10 transition";

function Card({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-foreground/8 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-xl bg-[#143A2A]/8 text-[#143A2A] grid place-items-center">{icon}</div>
        <div>
          <h3 className="font-serif text-lg leading-tight">{title}</h3>
          <p className="text-xs text-foreground/55">{desc}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-1.5 font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#143A2A]" : "bg-foreground/15"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

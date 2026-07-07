import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPopupSettings, updatePopupSettings, DEFAULT_POPUP_CONFIG, type PopupConfig } from "@/lib/popup-settings.functions";
import { ImmersiveLoader } from "@/components/ImmersiveLoader";

export const Route = createFileRoute("/_authenticated/admin/popups")({
  component: AdminPopups,
});

function AdminPopups() {
  const fetchCfg = useServerFn(getPopupSettings);
  const save = useServerFn(updatePopupSettings);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["popup-settings"], queryFn: () => fetchCfg() });
  const [cfg, setCfg] = useState<PopupConfig>(DEFAULT_POPUP_CONFIG);
  useEffect(() => { if (data?.config) setCfg(data.config); }, [data]);

  const update = <K extends keyof PopupConfig>(k: K, patch: Partial<PopupConfig[K]>) =>
    setCfg((c) => ({ ...c, [k]: { ...c[k], ...patch } }));

  async function onSave() {
    try {
      await save({ data: { config: cfg } });
      toast.success("Popup settings saved");
      qc.invalidateQueries({ queryKey: ["popup-settings"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  if (isLoading) return <ImmersiveLoader message="Loading popups…" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif italic text-2xl">Popups</h2>
        <button onClick={onSave} className="rounded-full px-5 py-2.5 text-xs uppercase tracking-widest font-semibold" style={{ background: "#143A2A", color: "#F4ECDC" }}>
          Save Changes
        </button>
      </div>

      <Panel label="Bundle Upgrade" enabled={cfg.bundleUpgrade.enabled} onToggle={(v) => update("bundleUpgrade", { enabled: v })}>
        <Field label="Title" value={cfg.bundleUpgrade.title} onChange={(v) => update("bundleUpgrade", { title: v })} />
        <Field label="Subtitle" value={cfg.bundleUpgrade.subtitle} onChange={(v) => update("bundleUpgrade", { subtitle: v })} />
        <Field label="Primary CTA" value={cfg.bundleUpgrade.primaryCta} onChange={(v) => update("bundleUpgrade", { primaryCta: v })} />
        <Field label="Secondary CTA" value={cfg.bundleUpgrade.secondaryCta} onChange={(v) => update("bundleUpgrade", { secondaryCta: v })} />
      </Panel>

      <Panel label="Exit Intent" enabled={cfg.exitIntent.enabled} onToggle={(v) => update("exitIntent", { enabled: v })}>
        <Field label="Title" value={cfg.exitIntent.title} onChange={(v) => update("exitIntent", { title: v })} />
        <Field label="Subtitle" value={cfg.exitIntent.subtitle} onChange={(v) => update("exitIntent", { subtitle: v })} />
        <Field label="Coupon code" value={cfg.exitIntent.coupon} onChange={(v) => update("exitIntent", { coupon: v.toUpperCase() })} />
        <Field label="Timer (seconds)" type="number" value={String(cfg.exitIntent.timerSeconds)} onChange={(v) => update("exitIntent", { timerSeconds: Number(v) || 0 })} />
        <Field label="Inactivity trigger (seconds)" type="number" value={String(cfg.exitIntent.inactivitySeconds)} onChange={(v) => update("exitIntent", { inactivitySeconds: Number(v) || 0 })} />
        <Field label="CTA label" value={cfg.exitIntent.cta} onChange={(v) => update("exitIntent", { cta: v })} />
      </Panel>

      <Panel label="Social Proof" enabled={cfg.socialProof.enabled} onToggle={(v) => update("socialProof", { enabled: v })}>
        <Field label="Min interval (s)" type="number" value={String(cfg.socialProof.minIntervalSeconds)} onChange={(v) => update("socialProof", { minIntervalSeconds: Number(v) || 0 })} />
        <Field label="Max interval (s)" type="number" value={String(cfg.socialProof.maxIntervalSeconds)} onChange={(v) => update("socialProof", { maxIntervalSeconds: Number(v) || 0 })} />
        <Textarea label="Messages (one per line)" value={cfg.socialProof.messages.join("\n")} onChange={(v) => update("socialProof", { messages: v.split("\n").map((s) => s.trim()).filter(Boolean) })} />
      </Panel>

      <Panel label="Low Stock" enabled={cfg.lowStock.enabled} onToggle={(v) => update("lowStock", { enabled: v })}>
        <Field label="Delay (seconds)" type="number" value={String(cfg.lowStock.delaySeconds)} onChange={(v) => update("lowStock", { delaySeconds: Number(v) || 0 })} />
        <Field label="Stock count" type="number" value={String(cfg.lowStock.stockCount)} onChange={(v) => update("lowStock", { stockCount: Number(v) || 0 })} />
        <Field label="Message (use {count})" value={cfg.lowStock.message} onChange={(v) => update("lowStock", { message: v })} />
      </Panel>

      <Panel label="Coupon Reward" enabled={cfg.couponReward.enabled} onToggle={(v) => update("couponReward", { enabled: v })}>
        <Field label="Title" value={cfg.couponReward.title} onChange={(v) => update("couponReward", { title: v })} />
        <Field label="Subtitle" value={cfg.couponReward.subtitle} onChange={(v) => update("couponReward", { subtitle: v })} />
        <Field label="Scroll trigger (%)" type="number" value={String(cfg.couponReward.scrollPercent)} onChange={(v) => update("couponReward", { scrollPercent: Number(v) || 0 })} />
        <Textarea
          label="Coupons (one per line: CODE | label)"
          value={cfg.couponReward.coupons.map((c) => `${c.code} | ${c.label}`).join("\n")}
          onChange={(v) =>
            update("couponReward", {
              coupons: v
                .split("\n")
                .map((line) => {
                  const [code, ...rest] = line.split("|");
                  return { code: (code ?? "").trim().toUpperCase(), label: rest.join("|").trim() };
                })
                .filter((c) => c.code && c.label),
            })
          }
        />
      </Panel>
    </div>
  );
}

function Panel({ label, enabled, onToggle, children }: { label: string; enabled: boolean; onToggle: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-foreground/10 p-5">
      <header className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl">{label}</h3>
        <label className="inline-flex items-center gap-2 text-xs uppercase tracking-widest">
          <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
          {enabled ? "Enabled" : "Disabled"}
        </label>
      </header>
      <div className="grid sm:grid-cols-2 gap-3">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-[10px] uppercase tracking-widest text-foreground/55">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-foreground/15 bg-white px-3 py-2 text-sm" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm sm:col-span-2">
      <span className="text-[10px] uppercase tracking-widest text-foreground/55">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={6} className="mt-1 w-full rounded-lg border border-foreground/15 bg-white px-3 py-2 text-sm font-mono" />
    </label>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListCoupons, adminUpsertCoupon, adminDeleteCoupon } from "@/lib/admin.functions";
import { inr, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  component: AdminCoupons,
});

interface CouponForm {
  id?: string | null;
  code: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  max_uses: number | null;
  expires_at: string | null;
  active: boolean;
}

const empty: CouponForm = { code: "", discount_type: "percentage", discount_value: 10, max_uses: null, expires_at: null, active: true };

function AdminCoupons() {
  const list = useServerFn(adminListCoupons);
  const upsert = useServerFn(adminUpsertCoupon);
  const del = useServerFn(adminDeleteCoupon);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-coupons"], queryFn: () => list() });
  const [editing, setEditing] = useState<CouponForm | null>(null);

  async function save() {
    if (!editing) return;
    try {
      await upsert({ data: editing });
      toast.success("Coupon saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    if (!confirm("Delete this coupon?")) return;
    try {
      await del({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 border border-foreground/5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl">Coupons</h2>
          <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground" style={{ background: "#143A2A" }}>
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="text-left text-[10px] uppercase tracking-widest text-foreground/50 border-b border-foreground/10">
              <tr>
                <th className="py-3 pr-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Value</th>
                <th className="py-3 px-4 font-semibold">Used / Max</th>
                <th className="py-3 px-4 font-semibold">Expires</th>
                <th className="py-3 px-4 font-semibold">Revenue</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 pl-4"></th>
              </tr>
            </thead>
            <tbody>
              {(data?.coupons ?? []).map((c: any) => (
                <tr key={c.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-mono font-medium">{c.code}</td>
                  <td className="py-3 px-4">{c.discount_type}</td>
                  <td className="py-3 px-4">{c.discount_type === "percentage" ? `${c.discount_value}%` : inr(Number(c.discount_value))}</td>
                  <td className="py-3 px-4">{c.used_count} / {c.max_uses ?? "∞"}</td>
                  <td className="py-3 px-4 text-foreground/60">{c.expires_at ? formatDate(c.expires_at) : "—"}</td>
                  <td className="py-3 px-4">{inr(c.analytics_revenue)}</td>
                  <td className="py-3 px-4"><span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${c.active ? "bg-green-100 text-green-800" : "bg-foreground/5"}`}>{c.active ? "Active" : "Inactive"}</span></td>
                  <td className="py-3 pl-4 text-right">
                    <button onClick={() => setEditing({ id: c.id, code: c.code, discount_type: c.discount_type, discount_value: Number(c.discount_value), max_uses: c.max_uses, expires_at: c.expires_at ? c.expires_at.slice(0,10) : null, active: c.active })} className="p-2 hover:text-foreground text-foreground/60 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(c.id)} className="p-2 hover:text-red-600 text-foreground/60 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="font-serif text-2xl mb-4">{editing.id ? "Edit" : "New"} Coupon</h3>
            <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Code</label>
            <input className="w-full rounded-xl border border-foreground/10 px-4 py-2 text-sm uppercase mb-3" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Type</label>
                <select className="w-full rounded-xl border border-foreground/10 px-4 py-2 text-sm" value={editing.discount_type} onChange={(e) => setEditing({ ...editing, discount_type: e.target.value as any })}>
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Value</label>
                <input type="number" className="w-full rounded-xl border border-foreground/10 px-4 py-2 text-sm" value={editing.discount_value} onChange={(e) => setEditing({ ...editing, discount_value: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Max uses</label>
                <input type="number" className="w-full rounded-xl border border-foreground/10 px-4 py-2 text-sm" value={editing.max_uses ?? ""} onChange={(e) => setEditing({ ...editing, max_uses: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-1">Expires</label>
                <input type="date" className="w-full rounded-xl border border-foreground/10 px-4 py-2 text-sm" value={editing.expires_at ?? ""} onChange={(e) => setEditing({ ...editing, expires_at: e.target.value || null })} />
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active
            </label>
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="rounded-full px-4 py-2 text-xs uppercase tracking-widest border border-foreground/20">Cancel</button>
              <button onClick={save} className="rounded-full px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground" style={{ background: "#143A2A" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

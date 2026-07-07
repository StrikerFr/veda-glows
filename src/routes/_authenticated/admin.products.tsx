import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListProducts, adminUpsertProduct } from "@/lib/products.functions";
import { inr } from "@/lib/format";
import { toast } from "sonner";
import { Pencil, X, Package } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const list = useServerFn(adminListProducts);
  const upsert = useServerFn(adminUpsertProduct);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });
  const [editing, setEditing] = useState<any | null>(null);

  async function save() {
    if (!editing) return;
    try {
      await upsert({ data: editing });
      toast.success("Product saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (e: any) { toast.error(e.message); }
  }

  const products = data?.products ?? [];
  const totalStock = products.reduce((a: number, p: any) => a + (p.stock || 0), 0);
  const activeCount = products.filter((p: any) => p.enabled).length;
  const lowStockCount = products.filter((p: any) => (p.stock ?? 0) < 10).length;

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryStat label="Products" value={products.length} />
        <SummaryStat label="Active" value={activeCount} accent="#3F8E5E" />
        <SummaryStat label="Total Stock" value={totalStock} />
        <SummaryStat label="Low Stock" value={lowStockCount} accent={lowStockCount > 0 ? "#C0392B" : undefined} />
      </div>

      {/* Product list */}
      <div className="rounded-2xl bg-white border border-foreground/10 overflow-hidden">
        {/* Table header (desktop) */}
        <div className="hidden md:grid grid-cols-[80px_1.6fr_1fr_120px_120px_70px] gap-4 px-5 py-3 border-b border-foreground/10 text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-semibold bg-foreground/[0.02]">
          <div>Image</div>
          <div>Product</div>
          <div>SKU</div>
          <div>Price</div>
          <div>Stock</div>
          <div className="text-right">Edit</div>
        </div>

        {products.length === 0 && (
          <div className="p-10 text-center text-sm text-foreground/50">No products yet.</div>
        )}

        {products.map((p: any) => {
          const lowStock = (p.stock ?? 0) < 10;
          const off = p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
          return (
            <div
              key={p.sku}
              className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[80px_1.6fr_1fr_120px_120px_70px] gap-4 px-4 md:px-5 py-4 items-center border-b border-foreground/8 last:border-b-0 hover:bg-foreground/[0.015] transition-colors"
            >
              {/* Thumb */}
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-gradient-to-br from-[#F4ECDC] to-[#E8D9B5] grid place-items-center overflow-hidden shrink-0">
                {p.image_url ? (
                  <img decoding="async" src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-5 w-5 text-[#143A2A]/35" />
                )}
              </div>

              {/* Name + description + status pills */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-[17px] text-[#143A2A] leading-tight truncate">{p.name}</h3>
                  <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-semibold ${p.enabled ? "bg-emerald-100 text-emerald-800" : "bg-foreground/5 text-foreground/50"}`}>
                    {p.enabled ? "Active" : "Disabled"}
                  </span>
                  {!p.visible && (
                    <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800">Hidden</span>
                  )}
                </div>
                <p className="text-xs text-foreground/55 mt-0.5 line-clamp-1">{p.description}</p>
                {/* Mobile-only price/stock row */}
                <div className="md:hidden mt-2 flex items-center gap-3 text-xs">
                  <span className="font-serif text-base text-[#143A2A]">{inr(p.price)}</span>
                  {p.mrp > p.price && <span className="text-foreground/40 line-through">{inr(p.mrp)}</span>}
                  <span className="text-foreground/30">·</span>
                  <span className={lowStock ? "text-red-600 font-medium" : "text-foreground/60"}>
                    {p.stock} in stock
                  </span>
                </div>
              </div>

              {/* SKU (desktop) */}
              <div className="hidden md:block font-mono text-[11px] text-foreground/55 uppercase tracking-wider truncate">{p.sku}</div>

              {/* Price (desktop) */}
              <div className="hidden md:block">
                <div className="font-serif text-lg text-[#143A2A] leading-none">{inr(p.price)}</div>
                {p.mrp > p.price && (
                  <div className="text-[11px] mt-1 flex items-center gap-1.5">
                    <span className="text-foreground/40 line-through">{inr(p.mrp)}</span>
                    {off > 0 && <span className="text-emerald-700 font-semibold">−{off}%</span>}
                  </div>
                )}
              </div>

              {/* Stock (desktop) */}
              <div className="hidden md:block">
                <div className={`text-sm font-medium ${lowStock ? "text-red-600" : "text-[#143A2A]"}`}>{p.stock}</div>
                <div className="text-[10px] text-foreground/50 mt-0.5">{lowStock ? "Low stock" : "In stock"}</div>
              </div>

              {/* Edit */}
              <button
                onClick={() => setEditing({ ...p })}
                className="justify-self-end h-9 w-9 grid place-items-center rounded-full hover:bg-[#143A2A]/8 text-[#143A2A]/70 hover:text-[#143A2A] transition-colors"
                aria-label={`Edit ${p.name}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-2xl">Edit Product</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Field label="Description" textarea value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />
              <Field label="Image URL" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} placeholder="https://…" />
              <div className="grid grid-cols-3 gap-3">
                <Field label="Price (₹)" type="number" value={String(editing.price)} onChange={(v) => setEditing({ ...editing, price: Number(v) || 0 })} />
                <Field label="MRP (₹)" type="number" value={String(editing.mrp)} onChange={(v) => setEditing({ ...editing, mrp: Number(v) || 0 })} />
                <Field label="Stock" type="number" value={String(editing.stock)} onChange={(v) => setEditing({ ...editing, stock: Number(v) || 0 })} />
              </div>
              <div className="flex gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.enabled} onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })} /> Enabled</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.visible} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} /> Visible on store</label>
              </div>
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="rounded-full px-4 py-2 text-xs uppercase tracking-widest border border-foreground/20">Cancel</button>
              <button onClick={save} className="rounded-full px-4 py-2 text-xs uppercase tracking-widest text-white" style={{ background: "#143A2A" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value, accent = "#143A2A" }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-xl bg-white p-4 border border-foreground/10">
      <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 font-semibold">{label}</div>
      <div className="font-serif text-2xl mt-1" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-[10px] uppercase tracking-widest text-foreground/55">{label}</span>
      {textarea
        ? <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-foreground/15 px-3 py-2 text-sm" />
        : <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-foreground/15 px-3 py-2 text-sm" />}
    </label>
  );
}

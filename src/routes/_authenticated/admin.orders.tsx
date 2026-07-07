import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/admin.functions";
import { inr, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Search, Filter, Download, ArrowUpRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const FILTERS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;

function AdminOrders() {
  const navigate = useNavigate();
  const list = useServerFn(adminListOrders);
  const update = useServerFn(adminUpdateOrderStatus);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-orders"], queryFn: () => list() });
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all");
  const [search, setSearch] = useState("");

  async function setStatus(id: string, status: string) {
    try {
      await update({ data: { id, status } });
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const orders = data?.orders ?? [];
  const filtered = useMemo(() => {
    return orders.filter((o: any) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.order_number?.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_email?.toLowerCase().includes(q) ||
          o.customer_phone?.includes(q)
        );
      }
      return true;
    });
  }, [orders, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o: any) => { c[o.status] = (c[o.status] ?? 0) + 1; });
    return c;
  }, [orders]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex overflow-x-auto no-scrollbar items-center gap-1 rounded-full bg-white border border-foreground/8 p-1 shadow-sm w-full md:w-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-[#143A2A] text-[#F4ECDC]"
                  : "text-foreground/65 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {f} <span className="opacity-60 ml-0.5">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-white border border-foreground/8 px-3 py-1.5 w-64 shadow-sm">
            <Search className="h-3.5 w-3.5 text-foreground/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, name, email…"
              className="bg-transparent text-xs outline-none flex-1"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3.5 py-2 text-xs font-medium text-foreground/70 hover:bg-foreground/5 shadow-sm">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3.5 py-2 text-xs font-medium text-foreground/70 hover:bg-foreground/5 shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-foreground/8 shadow-sm overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="text-left text-[10px] uppercase tracking-[0.16em] text-foreground/45 bg-[#FAF7F0] border-b border-foreground/8">
              <tr>
                <th className="py-3 px-5 font-semibold">Order</th>
                <th className="py-3 px-3 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">Phone</th>
                <th className="py-3 px-3 font-semibold">Coupon</th>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold">Payment</th>
                <th className="py-3 px-3 font-semibold text-right">Total</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o: any) => (
                <tr 
                  key={o.id} 
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName === 'SELECT') return;
                    navigate({ to: "/admin/orders/$id", params: { id: o.id } });
                  }}
                  className="border-b border-foreground/5 hover:bg-[#FAF7F0]/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-5">
                    <span className="font-mono text-xs font-semibold text-[#143A2A] group-hover:underline">
                      {o.order_number}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-foreground">{o.customer_name}</div>
                    <div className="text-xs text-foreground/50">{o.customer_email}</div>
                  </td>
                  <td className="py-3 px-3 text-foreground/70 text-xs">{o.customer_phone}</td>
                  <td className="py-3 px-3">
                    {o.coupon_code ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider bg-[#D4B978]/15 text-[#8A6A1F] px-2 py-0.5 rounded-md">
                        {o.coupon_code}
                      </span>
                    ) : <span className="text-foreground/30">—</span>}
                  </td>
                  <td className="py-3 px-3 text-foreground/60 text-xs">{formatDate(o.created_at)}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                      o.payment_status === "paid" ? "text-[#0F4A2C]" :
                      o.payment_status === "failed" ? "text-[#8A1F1F]" : "text-foreground/55"
                    }`}>
                      {o.payment_status ?? "—"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold tabular-nums">{inr(Number(o.total))}</td>
                  <td className="py-3 px-3">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      className="rounded-lg border border-foreground/10 bg-white px-2 py-1 text-xs capitalize cursor-pointer hover:border-foreground/25"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <Link to="/admin/orders/$id" params={{ id: o.id }} className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-foreground/5 text-foreground/60 hover:text-foreground">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-16 text-center text-foreground/40 text-sm">No orders match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-foreground/5 text-xs text-foreground/55 bg-[#FAF7F0]/40">
            <div>Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {orders.length} orders</div>
            <div className="flex items-center gap-3">
              <span>Total: <span className="font-semibold text-foreground">{inr(filtered.reduce((s: number, o: any) => s + Number(o.total), 0))}</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

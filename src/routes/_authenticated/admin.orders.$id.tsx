import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetOrder, adminUpdateOrderStatus, adminUpdateOrderNotes, adminUpdatePaymentStatus } from "@/lib/admin.functions";
import { inr, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ArrowLeft, MapPin, User, Phone, Mail, CreditCard, Ticket } from "lucide-react";
import { toast } from "sonner";
import { ImmersiveLoader } from "@/components/ImmersiveLoader";

export const Route = createFileRoute("/_authenticated/admin/orders/$id")({
  component: AdminOrderDetail,
});

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
const PAY_STATUSES = ["pending", "paid", "failed", "refunded"];

function AdminOrderDetail() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetOrder);
  const upStatus = useServerFn(adminUpdateOrderStatus);
  const upPay = useServerFn(adminUpdatePaymentStatus);
  const upNotes = useServerFn(adminUpdateOrderNotes);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-order", id], queryFn: () => get({ data: { id } }) });
  const order: any = data?.order;
  const [notes, setNotes] = useState("");
  useEffect(() => { if (order?.notes !== undefined) setNotes(order.notes ?? ""); }, [order?.notes]);

  if (!order) return <ImmersiveLoader message="Loading order…" />;

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-order", id] });
  const setStatus = async (status: string) => {
    try { await upStatus({ data: { id, status } }); toast.success("Status updated"); refresh(); }
    catch (e: any) { toast.error(e.message); }
  };
  const setPay = async (payment_status: string) => {
    try { await upPay({ data: { id, payment_status } }); toast.success("Payment updated"); refresh(); }
    catch (e: any) { toast.error(e.message); }
  };
  const saveNotes = async () => {
    try { await upNotes({ data: { id, notes } }); toast.success("Notes saved"); }
    catch (e: any) { toast.error(e.message); }
  };

  const addr = (order.shipping_address ?? {}) as any;

  return (
    <div className="space-y-5">
      <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-foreground/55 hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <div className="font-mono text-sm text-foreground/60">{order.order_number}</div>
          <h2 className="font-serif text-3xl">{order.customer_name}</h2>
          <div className="text-xs text-foreground/55">{formatDate(order.created_at)}</div>
        </div>
        <div className="text-right">
          <div className="font-serif text-3xl">{inr(Number(order.total))}</div>
          <div className="mt-1 flex gap-2 justify-end"><StatusBadge status={order.status} /><StatusBadge status={order.payment_status} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white p-5 border border-foreground/8">
            <h3 className="font-serif text-lg mb-3">Items</h3>
            <div className="divide-y divide-foreground/5">
              {(order.order_items ?? []).map((it: any) => (
                <div key={it.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{it.product_name}</div>
                    <div className="text-[11px] text-foreground/55 font-mono">{it.product_sku} · qty {it.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div>{inr(Number(it.line_total))}</div>
                    <div className="text-[11px] text-foreground/55">{inr(Number(it.unit_price))} each</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-foreground/8 space-y-1 text-sm">
              <Row label="Subtotal" value={inr(Number(order.subtotal))} />
              {Number(order.discount) > 0 && <Row label={`Discount${order.coupon_code ? ` (${order.coupon_code})` : ""}`} value={`− ${inr(Number(order.discount))}`} accent="text-emerald-700" />}
              <Row label="Shipping" value={Number(order.shipping) > 0 ? inr(Number(order.shipping)) : "FREE"} accent={Number(order.shipping) > 0 ? "" : "text-emerald-700"} />
              <div className="pt-2 mt-2 border-t border-foreground/8 flex justify-between font-serif text-xl"><span>Total</span><span>{inr(Number(order.total))}</span></div>
              {order.payment_method === 'cod' && (
                <div className="pt-2 space-y-1">
                  <Row label="Advance Paid (Razorpay)" value={inr(Math.min(Number(order.total), 40))} accent="text-emerald-700 font-medium" />
                  <Row label="Balance Due on Delivery" value={inr(Math.max(0, Number(order.total) - 40))} accent="text-amber-600 font-bold" />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-foreground/8">
            <h3 className="font-serif text-lg mb-3">Order Timeline</h3>
            <ol className="relative border-l border-foreground/10 ml-2 space-y-4 text-sm">
              <Step label="Order placed" date={formatDate(order.created_at)} done />
              <Step label="Payment" date={order.payment_status} done={["paid", "refunded"].includes(order.payment_status)} />
              <Step label="Processing" done={["processing", "shipped", "delivered"].includes(order.status)} />
              <Step label="Shipped" done={["shipped", "delivered"].includes(order.status)} />
              <Step label="Delivered" done={order.status === "delivered"} />
            </ol>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-foreground/8">
            <h3 className="font-serif text-lg mb-2">Internal Notes</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-xl border border-foreground/15 bg-white px-3 py-2 text-sm" placeholder="Add a note about this order…" />
            <div className="mt-2 flex justify-end"><button onClick={saveNotes} className="rounded-full px-4 py-2 text-xs uppercase tracking-widest text-white" style={{ background: "#143A2A" }}>Save</button></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 border border-foreground/8">
            <h3 className="font-serif text-lg mb-3">Customer</h3>
            <div className="text-sm space-y-1.5">
              <div className="inline-flex items-center gap-2"><User className="h-3.5 w-3.5 text-foreground/50" />{order.customer_name}</div>
              <div className="inline-flex items-center gap-2 text-foreground/70"><Mail className="h-3.5 w-3.5 text-foreground/50" />{order.customer_email}</div>
              <div className="inline-flex items-center gap-2 text-foreground/70"><Phone className="h-3.5 w-3.5 text-foreground/50" />{order.customer_phone}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-foreground/8">
            <h3 className="font-serif text-lg mb-3 inline-flex items-center gap-2"><MapPin className="h-4 w-4" />Shipping Address</h3>
            <div className="text-sm text-foreground/70 leading-relaxed">
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
              {addr.city}, {addr.state} {addr.pincode}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-foreground/8 space-y-3">
            <h3 className="font-serif text-lg">Manage</h3>
            <label className="block text-xs">
              <span className="text-[10px] uppercase tracking-widest text-foreground/55">Order status</span>
              <select value={order.status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-xl border border-foreground/15 px-3 py-2 text-sm">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-xs">
              <span className="text-[10px] uppercase tracking-widest text-foreground/55">Payment status</span>
              <select value={order.payment_status} onChange={(e) => setPay(e.target.value)} className="mt-1 w-full rounded-xl border border-foreground/15 px-3 py-2 text-sm">
                {PAY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <div className="text-xs text-foreground/60 pt-2 border-t border-foreground/8 space-y-1">
              <div className="inline-flex items-center gap-2"><CreditCard className="h-3.5 w-3.5" />Payment: {order.payment_method.toUpperCase()}</div>
              {order.coupon_code && <div className="inline-flex items-center gap-2"><Ticket className="h-3.5 w-3.5" />Coupon: {order.coupon_code}</div>}
              {order.razorpay_order_id && <div className="text-[10px] text-foreground/50 mt-1 truncate">RZP Order: {order.razorpay_order_id}</div>}
              {order.razorpay_payment_id && <div className="text-[10px] text-foreground/50 truncate">RZP Pay: {order.razorpay_payment_id}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent = "" }: { label: string; value: string; accent?: string }) {
  return <div className={`flex justify-between ${accent || "text-foreground/70"}`}><span>{label}</span><span>{value}</span></div>;
}
function Step({ label, date, done }: { label: string; date?: string; done?: boolean }) {
  return (
    <li className="ml-4">
      <span className={`absolute -left-[7px] h-3 w-3 rounded-full ${done ? "bg-[#143A2A]" : "bg-foreground/15"}`} />
      <div className={`font-medium ${done ? "" : "text-foreground/50"}`}>{label}</div>
      {date && <div className="text-[11px] text-foreground/55">{date}</div>}
    </li>
  );
}

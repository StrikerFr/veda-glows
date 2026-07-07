import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/admin.functions";
import { inr, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Clock,
  Truck, Package as PackageIcon, Ticket, Users as UsersIcon,
  Percent, ArrowRight, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

const FOREST = "#143A2A";
const GOLD = "#C9A24C";
const TRAFFIC = [
  { name: "Direct", value: 42, color: FOREST },
  { name: "Instagram", value: 28, color: GOLD },
  { name: "Google", value: 18, color: "#7C9A87" },
  { name: "Referral", value: 12, color: "#D4773A" },
];

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${up ? "text-emerald-700" : "text-red-600"}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}{value}%
    </span>
  );
}

function Kpi({ label, value, delta, Icon, accent = FOREST }: { label: string; value: string | number; delta?: number; Icon: any; accent?: string }) {
  return (
    <div className="group rounded-2xl bg-white p-5 border border-[#143A2A]/12 shadow-[0_2px_10px_-2px_rgba(20,58,42,0.10)] hover:shadow-[0_12px_28px_-10px_rgba(20,58,42,0.22)] transition">
      <div className="flex items-start justify-between">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#143A2A]/70 font-semibold">{label}</div>
        <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: `${accent}1f`, color: accent }}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2.5 font-serif text-[28px] leading-none text-[#143A2A]">{value}</div>
      {delta !== undefined && <div className="mt-2"><Delta value={delta} /> <span className="text-[10px] text-[#143A2A]/55 ml-1">vs last 7d</span></div>}
    </div>
  );
}

function MiniCard({ label, value, sub, accent = FOREST }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl bg-white p-4 border border-[#143A2A]/12 shadow-[0_1px_6px_-2px_rgba(20,58,42,0.08)]">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#143A2A]/65 font-semibold">{label}</div>
      <div className="font-serif text-2xl mt-1.5" style={{ color: accent }}>{value}</div>
      {sub && <div className="text-[11px] text-[#143A2A]/55 mt-1">{sub}</div>}
    </div>
  );
}

function AdminHome() {
  const fetchStats = useServerFn(adminStats);
  const { data, error } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fetchStats(), retry: false });
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
        <p className="font-mono text-sm whitespace-pre-wrap">{error.message || String(error)}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/70 border border-[#143A2A]/8 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Kpi label="Total Revenue" value={inr(data.totalRevenue)} delta={data.deltas.revenue} Icon={IndianRupee} />
        <Kpi label="Today's Revenue" value={inr(data.todayRevenue)} Icon={Sparkles} accent={GOLD} />
        <Kpi label="Total Orders" value={data.totalOrders} delta={data.deltas.orders} Icon={ShoppingCart} />
        <Kpi label="Pending" value={data.pendingOrders} Icon={Clock} accent="#D4773A" />
        <Kpi label="Delivered" value={data.deliveredOrders} Icon={Truck} accent="#3F8E5E" />
        <Kpi label="Avg Order Value" value={inr(Math.round(data.aov))} delta={data.deltas.aov} Icon={PackageIcon} />
        <Kpi label="Coupon Usage" value={data.couponUsageCount} Icon={Ticket} accent={GOLD} />
        <Kpi label="Conversion" value={`${data.checkoutCompletion}%`} Icon={Percent} accent={FOREST} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-[#143A2A]/12 shadow-[0_2px_10px_-2px_rgba(20,58,42,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg">Revenue · Last 30 days</h3>
              <p className="text-[11px] text-[#143A2A]/65">Daily total in INR, cancelled orders excluded.</p>
            </div>
            <Link to="/admin/analytics" className="text-[11px] uppercase tracking-widest text-[#143A2A]/70 hover:text-foreground inline-flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series} margin={{ left: -10, right: 6, top: 4 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={FOREST} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={FOREST} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#00000008" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b6b6b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b6b6b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "none", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => inr(Number(v))} />
                <Area type="monotone" dataKey="revenue" stroke={FOREST} strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-[#143A2A]/12 shadow-[0_2px_10px_-2px_rgba(20,58,42,0.08)]">
          <h3 className="font-serif text-lg">Traffic Sources</h3>
          <p className="text-[11px] text-[#143A2A]/65 mb-2">Sample distribution — connect analytics to populate.</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TRAFFIC} dataKey="value" innerRadius={42} outerRadius={72} paddingAngle={2}>
                  {TRAFFIC.map((t) => <Cell key={t.name} fill={t.color} />)}
                </Pie>
                <Tooltip contentStyle={{ border: "none", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {TRAFFIC.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: t.color }} />{t.name}</span>
                <span className="text-[#143A2A]/65">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VedaGlows-specific */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-serif text-lg">Starter Kit Performance</h3>
          <span className="text-[10px] uppercase tracking-widest text-[#143A2A]/55 px-2 py-0.5 rounded-full bg-foreground/5">VedaGlows</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-3">
          <MiniCard label="Total Kits Sold" value={data.starterKits.totalKits} accent={FOREST} />
          <MiniCard label="1-Kit Orders" value={data.starterKits.kit1} sub="₹499 each" />
          <MiniCard label="2-Kit Bundles" value={data.starterKits.kit2} sub="₹499 each" accent={GOLD} />
          <MiniCard label="3-Kit Bundles" value={data.starterKits.kit3} sub="₹699 each" accent="#3F8E5E" />
          <MiniCard label="Bundle Upgrade" value={`${data.bundleUpgradeRate}%`} sub="2+ kit share" accent={GOLD} />
          <MiniCard label="Most-Used Coupon" value={data.mostUsedCoupon} accent={FOREST} />
          <MiniCard label="Checkout Complete" value={`${data.checkoutCompletion}%`} sub="shipped + delivered" accent="#3F8E5E" />
        </div>
      </div>

      {/* Orders chart + top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-[#143A2A]/12 shadow-[0_2px_10px_-2px_rgba(20,58,42,0.08)]">
          <h3 className="font-serif text-lg mb-4">Orders · Last 30 days</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series} margin={{ left: -10, right: 6 }}>
                <CartesianGrid stroke="#00000008" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b6b6b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6b6b6b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "none", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Bar dataKey="orders" fill={GOLD} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-[#143A2A]/12 shadow-[0_2px_10px_-2px_rgba(20,58,42,0.08)]">
          <h3 className="font-serif text-lg mb-4">Top Selling Products</h3>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-[#143A2A]/65">No sales yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.topProducts.map((p: any, i: number) => {
                const max = data.topProducts[0].revenue || 1;
                return (
                  <li key={p.sku}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="text-[#143A2A]/50 w-4">{i + 1}</span>{p.name}</span>
                      <span className="text-[#143A2A]/75">{inr(p.revenue)}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(p.revenue / max) * 100}%`, background: `linear-gradient(90deg, ${FOREST}, ${GOLD})` }} />
                    </div>
                    <div className="text-[10px] text-foreground/50 mt-0.5">{p.qty} units sold</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Coupon performance + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-[#143A2A]/12 shadow-[0_2px_10px_-2px_rgba(20,58,42,0.08)]">
          <h3 className="font-serif text-lg mb-4">Coupon Performance</h3>
          {data.couponPerf.length === 0 ? (
            <p className="text-sm text-[#143A2A]/65">No coupon redemptions yet.</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.couponPerf} layout="vertical" margin={{ left: 10, right: 6 }}>
                  <CartesianGrid stroke="#00000008" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#6b6b6b" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="code" tick={{ fontSize: 10, fill: "#6b6b6b" }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip contentStyle={{ border: "none", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", fontSize: 12 }} />
                  <Bar dataKey="uses" fill={FOREST} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-[#143A2A]/12 shadow-[0_2px_10px_-2px_rgba(20,58,42,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[11px] uppercase tracking-widest text-[#143A2A]/70 hover:text-foreground inline-flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] uppercase tracking-widest text-[#143A2A]/55 border-b border-[#143A2A]/15">
                <tr><th className="py-2 pr-3 font-medium">Order</th><th className="font-medium">Customer</th><th className="font-medium">Date</th><th className="font-medium">Status</th><th className="text-right font-medium">Total</th></tr>
              </thead>
              <tbody>
                {data.recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-[#143A2A]/55"><span className="inline-flex items-center justify-center gap-2"><UsersIcon className="h-4 w-4" />No orders yet.</span></td></tr>
                )}
                {data.recentOrders.map((o: any) => (
                  <tr key={o.id} className="border-b border-[#143A2A]/8 hover:bg-foreground/[0.015]">
                    <td className="py-3 pr-3"><Link to="/admin/orders/$id" params={{ id: o.id }} className="font-mono text-xs text-[#143A2A] hover:underline">{o.order_number}</Link></td>
                    <td><div className="font-medium">{o.customer_name}</div><div className="text-[11px] text-foreground/50">{o.customer_email}</div></td>
                    <td className="text-[#143A2A]/70 text-xs">{formatDate(o.created_at)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="text-right font-medium">{inr(Number(o.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

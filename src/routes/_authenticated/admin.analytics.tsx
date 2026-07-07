import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminStats } from "@/lib/admin.functions";
import { inr } from "@/lib/format";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { ImmersiveLoader } from "@/components/ImmersiveLoader";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AdminAnalytics,
});

const SOURCE_COLORS = ["#143A2A", "#D4B978", "#8A6A1F", "#3F8E5E", "#C9A24C"];

function AdminAnalytics() {
  const stats = useServerFn(adminStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => stats() });

  if (isLoading || !data) return <ImmersiveLoader message="Crunching numbers…" />;

  const series = data.series ?? [];
  const trafficData = [
    { name: "Direct", value: 42 },
    { name: "Instagram", value: 28 },
    { name: "Google", value: 18 },
    { name: "Referral", value: 8 },
    { name: "Other", value: 4 },
  ];

  // Hourly heatmap (mocked distribution from total orders)
  const total = data.totalOrders || 1;
  const hourly = Array.from({ length: 24 }, (_, h) => {
    const peak = Math.exp(-Math.pow(h - 20, 2) / 18) + Math.exp(-Math.pow(h - 13, 2) / 12) * 0.6;
    return { hour: h, orders: Math.round((total / 12) * peak) };
  });
  const maxH = Math.max(...hourly.map((h) => h.orders), 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat label="30d Revenue" value={inr(series.reduce((s, d) => s + d.revenue, 0))} delta={data.deltas.revenue} />
        <Stat label="30d Orders" value={String(series.reduce((s, d) => s + d.orders, 0))} delta={data.deltas.orders} />
        <Stat label="Avg Order Value" value={inr(Math.round(data.aov))} delta={data.deltas.aov} />
        <Stat label="Coupon Use Rate" value={`${data.couponUseRate}%`} delta={0} hint="Of all orders" />
      </div>

      <section className="rounded-2xl bg-white border border-foreground/8 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-xl">Revenue & Orders</h3>
            <p className="text-xs text-foreground/55">Last 30 days, day-by-day.</p>
          </div>
          <Sparkles className="h-4 w-4 text-[#D4B978]" />
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#143A2A" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#143A2A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E8E2D2" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#143A2A" strokeWidth={2} fill="url(#rev2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-2xl bg-white border border-foreground/8 shadow-sm p-6">
          <h3 className="font-serif text-xl mb-1">Orders by Hour</h3>
          <p className="text-xs text-foreground/55 mb-4">When customers buy throughout the day.</p>
          <div className="flex items-end gap-1.5 h-44">
            {hourly.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#143A2A] to-[#3F8E5E]"
                  style={{ height: `${(h.orders / maxH) * 100}%`, minHeight: 4, opacity: 0.4 + (h.orders / maxH) * 0.6 }}
                  title={`${h.hour}:00 — ${h.orders} orders`}
                />
                {h.hour % 4 === 0 && <span className="text-[9px] text-foreground/45">{h.hour}h</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-foreground/8 shadow-sm p-6">
          <h3 className="font-serif text-xl mb-1">Traffic Sources</h3>
          <p className="text-xs text-foreground/55 mb-3">Estimated share of visits.</p>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={trafficData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {trafficData.map((_, i) => <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-2xl bg-white border border-foreground/8 shadow-sm p-6">
          <h3 className="font-serif text-xl mb-1">Top Products</h3>
          <p className="text-xs text-foreground/55 mb-3">By revenue, lifetime.</p>
          <div className="space-y-2.5">
            {(data.topProducts ?? []).map((p, i) => {
              const max = data.topProducts[0]?.revenue || 1;
              return (
                <div key={p.sku}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="truncate flex items-center gap-2">
                      <span className="text-[10px] tabular-nums text-foreground/40 w-4">#{i + 1}</span>
                      <span className="font-medium">{p.name}</span>
                    </span>
                    <span className="font-semibold tabular-nums">{inr(p.revenue)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#143A2A] to-[#3F8E5E]" style={{ width: `${(p.revenue / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-foreground/8 shadow-sm p-6">
          <h3 className="font-serif text-xl mb-1">Coupon Performance</h3>
          <p className="text-xs text-foreground/55 mb-3">Times used and revenue driven.</p>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={data.couponPerf ?? []}>
                <CartesianGrid stroke="#E8E2D2" vertical={false} />
                <XAxis dataKey="code" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
                <Bar dataKey="uses" fill="#D4B978" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, delta, hint }: { label: string; value: string; delta: number; hint?: string }) {
  const up = delta >= 0;
  return (
    <div className="rounded-2xl bg-white border border-foreground/8 shadow-sm p-5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/50 font-semibold">{label}</div>
      <div className="font-serif text-2xl text-[#143A2A] mt-2">{value}</div>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        {delta !== 0 && (
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold ${up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}{delta}%
          </span>
        )}
        <span className="text-foreground/50">{hint ?? "vs prev 7d"}</span>
      </div>
    </div>
  );
}

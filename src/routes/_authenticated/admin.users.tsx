import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListUsers, adminGetUserDetail } from "@/lib/admin.functions";
import { inr, formatDate } from "@/lib/format";
import { X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const list = useServerFn(adminListUsers);
  const detail = useServerFn(adminGetUserDetail);
  const { data } = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });
  const [openId, setOpenId] = useState<string | null>(null);
  const detailQuery = useQuery({
    queryKey: ["admin-user", openId],
    queryFn: () => detail({ data: { id: openId! } }),
    enabled: !!openId,
  });

  return (
    <div className="rounded-3xl bg-white p-6 border border-foreground/5 shadow-sm">
      <h2 className="font-serif text-xl mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-widest text-foreground/50 border-b border-foreground/10">
            <tr><th className="py-2 pr-3">Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Spent</th><th></th></tr>
          </thead>
          <tbody>
            {(data?.users ?? []).map((u: any) => (
              <tr key={u.id} className="border-b border-foreground/5">
                <td className="py-2.5 pr-3">{u.full_name || "—"}</td>
                <td>{u.email}</td>
                <td className="text-foreground/70">{u.phone || "—"}</td>
                <td>{u.total_orders}</td>
                <td>{inr(u.total_spent)}</td>
                <td className="text-right">
                  <button onClick={() => setOpenId(u.id)} className="text-xs uppercase tracking-widest text-foreground/70 hover:text-foreground">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={() => setOpenId(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between">
              <h3 className="font-serif text-2xl">{detailQuery.data?.profile?.full_name || "User"}</h3>
              <button onClick={() => setOpenId(null)}><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-foreground/60">{detailQuery.data?.profile?.email}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-[color:var(--ivory)] p-3"><div className="text-[10px] uppercase tracking-widest text-foreground/50">Lifetime</div><div className="font-serif text-xl">{inr(detailQuery.data?.lifetime ?? 0)}</div></div>
              <div className="rounded-xl bg-[color:var(--ivory)] p-3"><div className="text-[10px] uppercase tracking-widest text-foreground/50">Orders</div><div className="font-serif text-xl">{detailQuery.data?.orders.length ?? 0}</div></div>
              <div className="rounded-xl bg-[color:var(--ivory)] p-3"><div className="text-[10px] uppercase tracking-widest text-foreground/50">Coupons used</div><div className="font-serif text-xl">{detailQuery.data?.coupons.length ?? 0}</div></div>
            </div>
            <h4 className="mt-5 font-serif text-lg">Order History</h4>
            <div className="mt-2 space-y-2">
              {(detailQuery.data?.orders ?? []).map((o: any) => (
                <div key={o.id} className="rounded-xl border border-foreground/5 p-3 flex justify-between text-sm">
                  <span className="font-mono text-xs">{o.order_number}</span>
                  <span className="text-foreground/60">{formatDate(o.created_at)}</span>
                  <span className="text-[10px] uppercase tracking-widest">{o.status}</span>
                  <span>{inr(Number(o.total))}</span>
                </div>
              ))}
            </div>
            {(detailQuery.data?.coupons ?? []).length > 0 && (
              <>
                <h4 className="mt-5 font-serif text-lg">Coupons Used</h4>
                <div className="mt-2 space-y-2">
                  {detailQuery.data?.coupons.map((c: any) => (
                    <div key={c.id} className="rounded-xl border border-foreground/5 p-3 flex justify-between text-sm">
                      <span className="font-mono text-xs">{c.coupons?.code}</span>
                      <span>− {inr(Number(c.discount_amount))}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute, Outlet, useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Bell, Search, ExternalLink } from "lucide-react";
import { ImmersiveLoader } from "@/components/ImmersiveLoader";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin - VedaGlows" }] }),
  component: AdminLayout,
});

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/coupons": "Coupons",
  "/admin/users": "Customers",
  "/admin/analytics": "Analytics",
  "/admin/popups": "Popups",
  "/admin/settings": "Settings",
};

function AdminLayout() {
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  useEffect(() => { if (!loading && !isAdmin) navigate({ to: "/" }); }, [loading, isAdmin, navigate]);

  if (loading) {
    return <ImmersiveLoader fullScreen={true} message="Loading Admin..." />;
  }
  if (!isAdmin) return null;

  const titleKey = Object.keys(PAGE_TITLES).find((k) => k !== "/admin" && pathname.startsWith(k)) ?? "/admin";
  const title = PAGE_TITLES[titleKey] ?? "Admin";

  return (
    <SidebarProvider>
      <div className="flex h-dvh min-h-dvh w-full overflow-hidden bg-[#EFE9DA] text-[#1B2E26]">
        <AdminSidebar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-foreground/8 bg-white/95 backdrop-blur px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs uppercase tracking-[0.22em] text-foreground/40">VedaGlows</span>
              <span className="text-foreground/30">/</span>
              <span className="text-sm font-medium truncate">{title}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1.5 w-64">
                <Search className="h-3.5 w-3.5 text-foreground/50" />
                <input placeholder="Search orders, customers…" className="bg-transparent text-xs outline-none flex-1" />
                <kbd className="text-[10px] text-foreground/40 border border-foreground/15 rounded px-1.5">⌘K</kbd>
              </div>
              <Link to="/" className="hidden md:inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-foreground px-2.5 py-1.5 rounded-full hover:bg-foreground/5">
                <ExternalLink className="h-3.5 w-3.5" /> View store
              </Link>
              <button className="relative h-9 w-9 grid place-items-center rounded-full hover:bg-foreground/5">
                <Bell className="h-4 w-4 text-foreground/70" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#D4773A]" />
              </button>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#143A2A] to-[#1f4a36] grid place-items-center text-white text-xs font-semibold">A</div>
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="font-serif italic text-3xl md:text-4xl text-[#143A2A]">{title}</h1>
              <p className="text-sm text-foreground/55 mt-1">{subtitleFor(title)}</p>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function subtitleFor(title: string) {
  switch (title) {
    case "Dashboard": return "Real-time overview of your store performance.";
    case "Orders": return "Track, fulfill, and update customer orders.";
    case "Products": return "Manage your catalog, pricing, and stock.";
    case "Coupons": return "Create discount codes and watch them perform.";
    case "Customers": return "Customer profiles, orders, and lifetime value.";
    case "Analytics": return "Deeper insights into revenue and behavior.";
    case "Popups": return "On-site campaigns: bundles, exit intent, social proof.";
    case "Settings": return "Store configuration, shipping, payments.";
    default: return "";
  }
}

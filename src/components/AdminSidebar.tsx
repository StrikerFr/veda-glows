import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, ShoppingBag, Ticket, Users, BarChart3,
  Bell, Settings, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

type NavItem = { to: string; label: string; Icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", Icon: Package },
  { to: "/admin/products", label: "Products", Icon: ShoppingBag },
  { to: "/admin/coupons", label: "Coupons", Icon: Ticket },
  { to: "/admin/users", label: "Customers", Icon: Users },
  { to: "/admin/analytics", label: "Analytics", Icon: BarChart3 },
  { to: "/admin/popups", label: "Popups", Icon: Bell },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#1f3a2c]/40"
      style={{
        ["--sidebar" as any]: "#0F2A1F",
        ["--sidebar-foreground" as any]: "#EEE7D5",
        ["--sidebar-accent" as any]: "rgba(212,185,120,0.16)",
        ["--sidebar-accent-foreground" as any]: "#E8C98A",
        ["--sidebar-border" as any]: "rgba(255,255,255,0.06)",
        ["--sidebar-ring" as any]: "#D4B978",
        ["--sidebar-primary" as any]: "#D4B978",
        ["--sidebar-primary-foreground" as any]: "#0F2A1F",
      }}
    >
      <SidebarHeader className="px-4 py-5 border-b border-white/5">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img decoding="async" src="/favicon.png" alt="VedaGlows" className="h-9 w-9 rounded-xl shrink-0 object-cover" />
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-serif text-xl tracking-tight">VedaGlows</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4B978]/80">Admin</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ to, label, Icon, exact }) => {
                const active = exact ? pathname === to : pathname.startsWith(to);
                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={label} className="data-[active=true]:bg-[#D4B978]/15 data-[active=true]:text-[#D4B978] hover:bg-white/5 text-[#EEE7D5]/85 rounded-xl">
                      <Link to={to as any} className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="text-[13px] font-medium">{label}</span>}
                        {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4B978]" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2 pb-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout" className="text-[#EEE7D5]/85 hover:bg-white/5 rounded-xl">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

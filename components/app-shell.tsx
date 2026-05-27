import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  ClipboardList,
  UtensilsCrossed,
  CreditCard,
  ShoppingBag,
  User,
  Menu,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { useState } from "react";
import { cn } from "~/lib/utils";

const navItems = [
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/guest-order", label: "Guest Order", icon: ShoppingBag },
  { to: "/profile", label: "Profile", icon: User },
];

function NavLink({
  to,
  label,
  icon: Icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  const isActive = useMatchRoute({ to });
  const active = isActive({ to });

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = useMatchRoute({ to: item.to });
          const active = isActive({ to: item.to });
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("w-64 border-r bg-background", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-bold">Ordee</h1>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:block" />

      {/* Mobile header + content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b px-4 h-14 md:hidden">
          <h1 className="text-lg font-bold">Ordee</h1>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-lg font-bold">Ordee</h1>
              </div>
              <nav className="space-y-1 p-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    {...item}
                    onClick={() => setSheetOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

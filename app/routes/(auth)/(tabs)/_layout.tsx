import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/_layout")({
  component: TabsLayout,
});

const tabs = [
  { to: "/orders", label: "Orders" },
  { to: "/menu", label: "Menu" },
  { to: "/payments", label: "Payments" },
  { to: "/guest-order", label: "Guest Orders" },
  { to: "/profile", label: "Profile" },
];

function TabsLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="border-b bg-background">
        <div className="flex h-14 items-center px-4 gap-6">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors [&.active]:text-foreground [&.active]:border-b-2 [&.active]:border-primary"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export const OrdeeTabs = [
  {
    name: "index",
    title: "Mesas",
    icon: ["mingcute:board-fill.svg", "mingcute:board-line.svg"],
    roles: ["guest", "admin", "user"],
  },
  {
    name: "menu",
    title: "Menú",
    icon: ["mingcute:hamburger-fill.svg", "mingcute:hamburger-line.svg"],
    roles: ["guest", "admin", "user"],
  },
  {
    name: "payments",
    title: "Pagos",
    icon: [
      "mingcute:currency-dollar-fill.svg",
      "mingcute:currency-dollar-line.svg",
    ],
    roles: ["admin"],
  },
  {
    name: "guest-order",
    title: "Ordenes",
    icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
    roles: ["guest"],
  },
  {
    name: "orders",
    title: "Ordenes",
    icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
    roles: ["user", "admin"],
  },
  {
    name: "my-profile",
    title: "Mi Perfil",
    icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
    roles: ["guest", "user"],
  },
  {
    name: "profile",
    title: "Mi Perfil",
    icon: ["mingcute:user-3-fill.svg", "mingcute:user-3-line.svg"],
    roles: ["admin"],
  },
];

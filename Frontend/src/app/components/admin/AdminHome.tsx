import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Coffee, LayoutDashboard, ShoppingBag, BarChart2, Users,
  Settings, LogOut, TrendingUp, TrendingDown, Clock,
  Star, Package, ChevronDown, Menu, X,
} from "lucide-react";
import type { User } from "../../App";

interface AdminHomeProps {
  user: User;
  onLogout: () => void;
}

type DateRange = "today" | "week" | "month";
type NavSection = "dashboard" | "orders" | "menu" | "analytics" | "customers" | "settings";

const revenueData = {
  today: [
    { time: "7am", revenue: 82 }, { time: "8am", revenue: 210 }, { time: "9am", revenue: 345 },
    { time: "10am", revenue: 290 }, { time: "11am", revenue: 178 }, { time: "12pm", revenue: 421 },
    { time: "1pm", revenue: 312 }, { time: "2pm", revenue: 186 }, { time: "3pm", revenue: 243 },
    { time: "4pm", revenue: 318 }, { time: "5pm", revenue: 289 },
  ],
  week: [
    { time: "Mon", revenue: 892 }, { time: "Tue", revenue: 1043 }, { time: "Wed", revenue: 967 },
    { time: "Thu", revenue: 1124 }, { time: "Fri", revenue: 1389 }, { time: "Sat", revenue: 1721 },
    { time: "Sun", revenue: 1298 },
  ],
  month: [
    { time: "W1", revenue: 5820 }, { time: "W2", revenue: 6341 }, { time: "W3", revenue: 5987 },
    { time: "W4", revenue: 7123 },
  ],
};

const popularItems = [
  { name: "Signature Espresso", orders: 1842, revenue: 6447, growth: 12 },
  { name: "Cold Brew Reserve", orders: 1356, revenue: 6780, growth: 8 },
  { name: "Caramel Cloud Latte", orders: 987, revenue: 5429, growth: -3 },
  { name: "Velvet Cappuccino", orders: 1204, revenue: 5418, growth: 5 },
  { name: "Iced Vanilla Latte", orders: 918, revenue: 5049, growth: 15 },
  { name: "Flat White", orders: 743, revenue: 2972, growth: -1 },
];

const categoryData = [
  { name: "Hot Drinks", value: 4776, color: "#B86B2C" },
  { name: "Cold Drinks", value: 2886, color: "#2C6B5E" },
  { name: "Pastries", value: 1505, color: "#D4A843" },
  { name: "Specials", value: 823, color: "#8B4513" },
];

const recentOrders = [
  { id: "BH-2841", customer: "Maya Patel", items: ["Cold Brew Reserve", "Butter Croissant"], total: 8.50, status: "Ready", time: "2 min ago" },
  { id: "BH-2840", customer: "James Liu", items: ["Caramel Cloud Latte ×2"], total: 11.00, status: "Preparing", time: "5 min ago" },
  { id: "BH-2839", customer: "Sara O'Brien", items: ["Signature Espresso", "Blueberry Muffin"], total: 7.50, status: "Preparing", time: "8 min ago" },
  { id: "BH-2838", customer: "Dev Kumar", items: ["Nitro Cold Brew"], total: 6.00, status: "Collected", time: "12 min ago" },
  { id: "BH-2837", customer: "Elena Ros", items: ["Matcha Latte", "Cardamom Bun"], total: 10.50, status: "Collected", time: "18 min ago" },
  { id: "BH-2836", customer: "Tom Walsh", items: ["Flat White ×2", "Croissant"], total: 11.50, status: "Collected", time: "24 min ago" },
];

const statusColors: Record<string, string> = {
  Ready: "#2C6B5E",
  Preparing: "#B86B2C",
  Collected: "#7A6355",
};

const kpiData = {
  today: { orders: 127, revenue: 892.5, avgValue: 7.03, waitTime: 8, growth: { orders: 12, revenue: 9.3 } },
  week: { orders: 834, revenue: 6434, avgValue: 7.71, waitTime: 7, growth: { orders: 5, revenue: 7.1 } },
  month: { orders: 3271, revenue: 25271, avgValue: 7.73, waitTime: 8, growth: { orders: 11, revenue: 14.2 } },
};

const navItems: { id: NavSection; icon: React.ReactNode; label: string }[] = [
  { id: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { id: "orders", icon: <ShoppingBag size={18} />, label: "Orders" },
  { id: "menu", icon: <Coffee size={18} />, label: "Menu" },
  { id: "analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
  { id: "customers", icon: <Users size={18} />, label: "Customers" },
  { id: "settings", icon: <Settings size={18} />, label: "Settings" },
];

export function AdminHome({ user, onLogout }: AdminHomeProps) {
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [activeNav, setActiveNav] = useState<NavSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const kpi = kpiData[dateRange];
  const revenue = revenueData[dateRange];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      className={`${mobile ? "w-full" : "w-60 hidden lg:flex"} flex-col h-full`}
      style={{ background: "var(--sidebar)" }}
    >
      <div className="p-6 flex items-center gap-3" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--sidebar-primary)" }}>
          <Coffee size={16} color="#fff" />
        </div>
        <div>
          <span className="block" style={{ fontFamily: "'Playfair Display', serif", color: "var(--sidebar-foreground)" }}>
            BrewHouse
          </span>
          <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "rgba(255,248,240,0.4)" }}>
            Admin
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-colors"
            style={
              activeNav === item.id
                ? { background: "var(--sidebar-primary)", color: "#fff" }
                : { color: "rgba(255,248,240,0.6)" }
            }
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ background: "var(--sidebar-primary)", color: "#fff" }}>
            {user.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate" style={{ color: "var(--sidebar-foreground)" }}>{user.name}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,248,240,0.4)", fontFamily: "'DM Mono', monospace" }}>Administrator</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm"
          style={{ color: "rgba(255,248,240,0.55)" }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full flex flex-col">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 md:px-6 h-16 flex-shrink-0"
          style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: "var(--foreground)" }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                {navItems.find((n) => n.id === activeNav)?.label}
              </h2>
              <p className="text-xs hidden sm:block" style={{ color: "var(--muted-foreground)" }}>
                Friday, June 12 · 2026
              </p>
            </div>
          </div>

          {/* Date range selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--secondary)" }}>
            {(["today", "week", "month"] as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className="px-3 py-1.5 rounded-lg text-xs capitalize transition-all"
                style={
                  dateRange === r
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {r === "today" ? "Today" : r === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Orders",
                value: kpi.orders.toLocaleString(),
                sub: `${kpi.growth.orders > 0 ? "+" : ""}${kpi.growth.orders}% vs last period`,
                positive: kpi.growth.orders > 0,
                icon: <ShoppingBag size={18} />,
              },
              {
                label: "Revenue",
                value: `$${kpi.revenue.toLocaleString()}`,
                sub: `${kpi.growth.revenue > 0 ? "+" : ""}${kpi.growth.revenue}% vs last period`,
                positive: kpi.growth.revenue > 0,
                icon: <TrendingUp size={18} />,
              },
              {
                label: "Avg Order Value",
                value: `$${kpi.avgValue.toFixed(2)}`,
                sub: "Per transaction",
                positive: true,
                icon: <BarChart2 size={18} />,
              },
              {
                label: "Avg Wait Time",
                value: `${kpi.waitTime} min`,
                sub: "Target: under 10 min",
                positive: kpi.waitTime < 10,
                icon: <Clock size={18} />,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl p-5"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{card.label}</p>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--secondary)", color: "var(--accent)" }}
                  >
                    {card.icon}
                  </div>
                </div>
                <p className="text-2xl mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
                  {card.value}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: card.positive ? "#2C6B5E" : "#C0392B" }}>
                  {card.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {card.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <div
              className="xl:col-span-2 rounded-2xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                  Revenue Trend
                </h3>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--secondary)", color: "var(--muted-foreground)", fontFamily: "'DM Mono', monospace" }}>
                  {dateRange === "today" ? "Hourly" : dateRange === "week" ? "Daily" : "Weekly"}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B86B2C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#B86B2C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toFixed(0)}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#B86B2C" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: "#B86B2C" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <h3 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Orders by Category
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [v.toLocaleString(), "Orders"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                      <span style={{ color: "var(--foreground)" }}>{cat.name}</span>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
                      {cat.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular items chart */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Top Items by Orders
              </h3>
              <Star size={16} style={{ color: "var(--accent)" }} fill="var(--accent)" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={popularItems} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number, name: string) => [v.toLocaleString(), name === "orders" ? "Orders" : "Revenue $"]}
                />
                <Bar dataKey="orders" fill="#B86B2C" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Popular items table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Item Performance
              </h3>
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Month to date</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Item", "Orders", "Revenue", "Trend"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "'DM Mono', monospace" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {popularItems.map((item, i) => (
                    <tr key={item.name} style={{ borderBottom: i < popularItems.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {i === 0 && <Star size={13} fill="var(--accent)" style={{ color: "var(--accent)" }} />}
                          <span style={{ color: "var(--foreground)" }}>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
                        {item.orders.toLocaleString()}
                      </td>
                      <td className="px-5 py-3" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
                        ${item.revenue.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="flex items-center gap-1 text-xs w-fit px-2 py-0.5 rounded-full"
                          style={{
                            background: item.growth > 0 ? "rgba(44,107,94,0.12)" : "rgba(192,57,43,0.12)",
                            color: item.growth > 0 ? "#2C6B5E" : "#C0392B",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {item.growth > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {item.growth > 0 ? "+" : ""}{item.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent orders */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Live Orders
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2C6B5E" }} />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Real-time</span>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)" }}>
                        {order.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--foreground)" }}>{order.customer}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{order.items.join(", ")}</p>
                  </div>
                  <div className="ml-auto text-right flex-shrink-0">
                    <p className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

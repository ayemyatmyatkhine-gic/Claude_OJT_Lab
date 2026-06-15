import { useState } from "react";
import { toast } from "sonner";
import {
  Coffee, LayoutDashboard, ShoppingBag, ListFilter,
  LogOut, Plus, Pencil, Trash2, X, Check,
  Menu, TrendingUp, Users, Package, Upload,
} from "lucide-react";
import { initialCoffeeItems, CATEGORIES, type CoffeeItem } from "../shared/coffeeData";
import type { AppUser } from "../../App";

const FONT_DISPLAY = "'Playfair Display', serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'DM Mono', monospace";

type NavSection = "dashboard" | "coffee-items" | "orders";

interface Props {
  user: AppUser;
  onLogout: () => void;
}

const EMPTY_FORM: Omit<CoffeeItem, "id" | "totalOrders"> = {
  name: "",
  category: "Espresso",
  price: 0,
  description: "",
  image: "",
  status: "Available",
};

export function AdminPage({ user, onLogout }: Props) {
  const [items, setItems] = useState<CoffeeItem[]>(initialCoffeeItems);
  const [activeNav, setActiveNav] = useState<NavSection>("coffee-items");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [imagePreview, setImagePreview] = useState<string>("");

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setImagePreview("");
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (item: CoffeeItem) => {
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      status: item.status,
    });
    setImagePreview(item.image);
    setEditingId(item.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImagePreview("");
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (!form.price || form.price <= 0) { toast.error("Valid price is required"); return; }

    if (editingId !== null) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, ...form } : i))
      );
      toast.success("Item updated successfully");
    } else {
      const newItem: CoffeeItem = {
        ...form,
        id: Date.now(),
        totalOrders: 0,
        image: form.image || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=480&h=360&fit=crop",
      };
      setItems((prev) => [newItem, ...prev]);
      toast.success("Item added successfully");
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteConfirm(null);
    toast.success("Item deleted");
  };

  const toggleStatus = (id: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "Available" ? "Out of Stock" : "Available" }
          : i
      )
    );
  };

  const handleImageUrl = (url: string) => {
    setForm((f) => ({ ...f, image: url }));
    setImagePreview(url);
  };

  const visibleItems =
    filterCategory === "All"
      ? items
      : items.filter((i) => i.category === filterCategory);

  const stats = {
    total: items.length,
    available: items.filter((i) => i.status === "Available").length,
    outOfStock: items.filter((i) => i.status === "Out of Stock").length,
    totalOrders: items.reduce((s, i) => s + i.totalOrders, 0),
  };

  const navItems: { id: NavSection; icon: React.ReactNode; label: string }[] = [
    { id: "dashboard", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { id: "coffee-items", icon: <Coffee size={17} />, label: "Coffee Items" },
    { id: "orders", icon: <ShoppingBag size={17} />, label: "Orders" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ fontFamily: FONT_BODY }}>
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--sidebar-primary)" }}
          >
            <Coffee size={17} color="#fff" />
          </div>
          <div>
            <p
              className="text-base leading-none"
              style={{ fontFamily: FONT_DISPLAY, color: "var(--sidebar-foreground)" }}
            >
              BrewHouse
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ fontFamily: FONT_MONO, color: "rgba(250,247,244,0.38)" }}
            >
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
            style={
              activeNav === item.id
                ? {
                    background: "var(--sidebar-primary)",
                    color: "#fff",
                  }
                : {
                    color: "rgba(250,247,244,0.55)",
                  }
            }
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid var(--sidebar-border)", paddingTop: 16 }}>
        <div className="flex items-center gap-3 px-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: "var(--sidebar-primary)", color: "#fff" }}
          >
            {user.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate" style={{ color: "var(--sidebar-foreground)" }}>
              {user.name}
            </p>
            <p
              className="text-xs truncate"
              style={{ fontFamily: FONT_MONO, color: "rgba(250,247,244,0.38)" }}
            >
              Administrator
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-70"
          style={{ color: "rgba(250,247,244,0.5)" }}
        >
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: FONT_BODY, background: "var(--background)" }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0"
        style={{ background: "var(--sidebar)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(26,15,7,0.5)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className="relative w-64 h-full flex flex-col"
            style={{ background: "var(--sidebar)" }}
          >
            <SidebarContent />
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
              onClick={() => setSidebarOpen(true)}
              style={{ color: "var(--foreground)" }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1
                className="text-base"
                style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}
              >
                {navItems.find((n) => n.id === activeNav)?.label}
              </h1>
            </div>
          </div>

          {activeNav === "coffee-items" && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-85"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          )}
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* ── Dashboard ── */}
          {activeNav === "dashboard" && (
            <div className="p-4 md:p-6 space-y-6">
              <div>
                <h2 style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}>
                  Good morning, {user.name.split(" ")[0]} ☕
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Here's what's happening at BrewHouse today.
                </p>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Items", value: stats.total, icon: <Package size={18} />, sub: "On menu" },
                  { label: "Available", value: stats.available, icon: <Check size={18} />, sub: "Ready to order", accent: true },
                  { label: "Out of Stock", value: stats.outOfStock, icon: <X size={18} />, sub: "Need restocking" },
                  { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: <TrendingUp size={18} />, sub: "All time" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl p-5"
                    style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(61,31,13,0.05)" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {card.label}
                      </p>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: card.accent ? "rgba(196,105,42,0.12)" : "var(--secondary)",
                          color: card.accent ? "var(--accent)" : "var(--muted-foreground)",
                        }}
                      >
                        {card.icon}
                      </div>
                    </div>
                    <p
                      className="text-3xl mb-1"
                      style={{ fontFamily: FONT_MONO, color: "var(--foreground)" }}
                    >
                      {card.value}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {card.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Top performers */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div
                  className="px-6 py-4"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <h3 style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}>
                    Top Performers
                  </h3>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {[...items]
                    .sort((a, b) => b.totalOrders - a.totalOrders)
                    .slice(0, 5)
                    .map((item, i) => (
                      <div key={item.id} className="flex items-center gap-4 px-6 py-3.5">
                        <span
                          className="w-6 text-center text-sm flex-shrink-0"
                          style={{ fontFamily: FONT_MONO, color: i === 0 ? "var(--accent)" : "var(--muted-foreground)" }}
                        >
                          {i + 1}
                        </span>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm truncate"
                            style={{ color: "var(--foreground)", fontFamily: FONT_DISPLAY }}
                          >
                            {item.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                            {item.category}
                          </p>
                        </div>
                        <span
                          className="text-sm flex-shrink-0"
                          style={{ fontFamily: FONT_MONO, color: "var(--muted-foreground)" }}
                        >
                          {item.totalOrders.toLocaleString()} orders
                        </span>
                        <span
                          className="text-sm flex-shrink-0"
                          style={{ fontFamily: FONT_MONO, color: "var(--accent)" }}
                        >
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Coffee Items ── */}
          {activeNav === "coffee-items" && (
            <div className="p-4 md:p-6 space-y-4">
              {/* Filter row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                <ListFilter size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                {["All", ...CATEGORIES.filter((c) => c !== "All")].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs transition-all flex-shrink-0"
                    style={
                      filterCategory === cat
                        ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                        : { background: "var(--card)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }
                    }
                  >
                    {cat}
                  </button>
                ))}
                <span
                  className="ml-auto flex-shrink-0 text-xs"
                  style={{ fontFamily: FONT_MONO, color: "var(--muted-foreground)" }}
                >
                  {visibleItems.length} items
                </span>
              </div>

              {/* Desktop table */}
              <div
                className="hidden md:block rounded-2xl overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--secondary)" }}>
                      {["Item", "Category", "Price", "Orders", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-xs"
                          style={{ color: "var(--muted-foreground)", fontFamily: FONT_MONO }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems.map((item, i) => (
                      <tr
                        key={item.id}
                        style={{
                          borderTop: "1px solid var(--border)",
                        }}
                      >
                        {/* Item */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                            />
                            <div>
                              <p style={{ color: "var(--foreground)", fontFamily: FONT_DISPLAY }}>
                                {item.name}
                              </p>
                              <p
                                className="text-xs mt-0.5 max-w-xs truncate"
                                style={{ color: "var(--muted-foreground)" }}
                              >
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-5 py-3.5">
                          <span
                            className="px-2.5 py-1 rounded-lg text-xs"
                            style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                          >
                            {item.category}
                          </span>
                        </td>
                        {/* Price */}
                        <td className="px-5 py-3.5">
                          <span style={{ fontFamily: FONT_MONO, color: "var(--accent)" }}>
                            ${item.price.toFixed(2)}
                          </span>
                        </td>
                        {/* Orders */}
                        <td className="px-5 py-3.5">
                          <span style={{ fontFamily: FONT_MONO, color: "var(--muted-foreground)" }}>
                            {item.totalOrders.toLocaleString()}
                          </span>
                        </td>
                        {/* Status toggle */}
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => toggleStatus(item.id)}
                            className="px-2.5 py-1 rounded-full text-xs transition-all"
                            style={
                              item.status === "Available"
                                ? { background: "rgba(61,122,94,0.12)", color: "#3D7A5E" }
                                : { background: "rgba(192,57,43,0.1)", color: "#C0392B" }
                            }
                          >
                            {item.status}
                          </button>
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              className="p-2 rounded-lg transition-all hover:opacity-70"
                              style={{ background: "var(--secondary)", color: "var(--foreground)" }}
                            >
                              <Pencil size={14} />
                            </button>
                            {deleteConfirm === item.id ? (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs"
                                  style={{ background: "#C0392B", color: "#fff" }}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs"
                                  style={{ background: "var(--secondary)", color: "var(--foreground)" }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(item.id)}
                                className="p-2 rounded-lg transition-all hover:opacity-70"
                                style={{ background: "rgba(192,57,43,0.08)", color: "#C0392B" }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card grid */}
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <div className="relative h-40" style={{ background: "#F2E8DE" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs"
                        style={
                          item.status === "Available"
                            ? { background: "rgba(61,122,94,0.85)", color: "#fff" }
                            : { background: "rgba(192,57,43,0.85)", color: "#fff" }
                        }
                      >
                        {item.status}
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <p
                          className="text-sm"
                          style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}
                        >
                          {item.name}
                        </p>
                        <span
                          className="text-sm flex-shrink-0"
                          style={{ fontFamily: FONT_MONO, color: "var(--accent)" }}
                        >
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p
                        className="text-xs mb-3 line-clamp-2"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2 py-0.5 rounded-md text-xs"
                          style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                        >
                          {item.category}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg"
                            style={{ background: "var(--secondary)", color: "var(--foreground)" }}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteConfirm === item.id ? handleDelete(item.id) : setDeleteConfirm(item.id)}
                            className="p-1.5 rounded-lg"
                            style={{ background: "rgba(192,57,43,0.08)", color: "#C0392B" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {visibleItems.length === 0 && (
                <div className="text-center py-20">
                  <Coffee size={36} className="mx-auto mb-3 opacity-20" />
                  <p style={{ color: "var(--muted-foreground)" }}>No items in this category.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Orders (placeholder) ── */}
          {activeNav === "orders" && (
            <div className="p-4 md:p-6">
              <div
                className="rounded-2xl p-12 text-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <ShoppingBag size={40} className="mx-auto mb-4 opacity-20" />
                <h3 style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}>
                  Orders coming soon
                </h3>
                <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>
                  Live order tracking will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(26,15,7,0.55)", backdropFilter: "blur(6px)" }}
            onClick={closeModal}
          />
          <div
            className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "var(--card)", maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}>
                {editingId !== null ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl transition-opacity hover:opacity-60"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-5">
              {/* Image preview */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--foreground)" }}>
                  Image
                </label>
                <div
                  className="w-full h-44 rounded-2xl overflow-hidden mb-3 relative flex items-center justify-center"
                  style={{ background: "var(--secondary)", border: "1.5px dashed var(--border)" }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview("")}
                    />
                  ) : (
                    <div className="text-center">
                      <Upload size={28} className="mx-auto mb-2" style={{ color: "var(--muted-foreground)" }} />
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        Enter an image URL below
                      </p>
                    </div>
                  )}
                </div>
                <input
                  value={form.image}
                  onChange={(e) => handleImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                  Coffee Name <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Caramel Cloud Latte"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Category + Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                    Category <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value as CoffeeItem["category"] }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none"
                    style={{
                      background: "var(--input-background)",
                      border: "1.5px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                    Price (USD) <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.price || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--input-background)",
                        border: "1.5px solid var(--border)",
                        color: "var(--foreground)",
                        fontFamily: FONT_MONO,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the flavour profile, ingredients, and what makes it special…"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--foreground)" }}>
                  Status
                </label>
                <div className="flex gap-3">
                  {(["Available", "Out of Stock"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className="flex items-center gap-2 flex-1 py-2.5 px-4 rounded-xl text-sm transition-all"
                      style={
                        form.status === s
                          ? {
                              background: s === "Available" ? "rgba(61,122,94,0.12)" : "rgba(192,57,43,0.08)",
                              border: `2px solid ${s === "Available" ? "#3D7A5E" : "#C0392B"}`,
                              color: s === "Available" ? "#3D7A5E" : "#C0392B",
                            }
                          : {
                              background: "var(--secondary)",
                              border: "2px solid var(--border)",
                              color: "var(--muted-foreground)",
                            }
                      }
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background:
                            form.status === s
                              ? s === "Available"
                                ? "#3D7A5E"
                                : "#C0392B"
                              : "var(--muted-foreground)",
                        }}
                      />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex gap-3 px-6 py-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ background: "var(--secondary)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-85"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {editingId !== null ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

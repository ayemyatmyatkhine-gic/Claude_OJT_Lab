import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  ShoppingCart, X, Plus, Minus, Star, ChevronDown,
  Search, LogOut, ArrowRight, Coffee, Trash2,
} from "lucide-react";
import {
  initialCoffeeItems,
  CATEGORIES,
  type Category,
  type CartItem,
  type CoffeeItem,
} from "../shared/coffeeData";
import type { AppUser } from "../../App";

const FONT_DISPLAY = "'Playfair Display', serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'DM Mono', monospace";

interface Props {
  user: AppUser;
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onUpdateQty: (itemId: number, qty: number) => void;
  onClearCart: () => void;
  onLogout: () => void;
}

export function CustomerPage({ user, cart, onAddToCart, onUpdateQty, onClearCart, onLogout }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const items = initialCoffeeItems;
  const topItem = [...items].sort((a, b) => b.totalOrders - a.totalOrders)[0];

  const filtered = items.filter((item) => {
    const catMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartTax = cartSubtotal * 0.085;
  const cartTotal = cartSubtotal + cartTax;

  const handleAdd = (item: CoffeeItem) => {
    if (item.status === "Out of Stock") return;
    onAddToCart({ itemId: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
    toast.success(`${item.name} added to cart`);
  };

  const handleOrder = async () => {
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
      setCartOpen(false);
      setOrderPlaced(false);
      toast.success("Order placed! Your coffee will be ready in ~8 min ☕");
    }, 2000);
  };

  const scrollToMenu = () => menuRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: FONT_BODY, background: "var(--background)", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(250,247,244,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <Coffee size={18} color="var(--primary-foreground)" />
            </div>
            <span
              className="text-lg tracking-tight"
              style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}
            >
              BrewHouse
            </span>
          </div>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-foreground)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drinks…"
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{
                background: "var(--input-background)",
                border: "1.5px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  style={{ background: "var(--accent)", color: "#fff", fontFamily: FONT_MONO }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {user.name[0]}
              </div>
              <span className="hidden lg:block text-sm" style={{ color: "var(--foreground)" }}>
                {user.name.split(" ")[0]}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg transition-opacity hover:opacity-60"
              style={{ color: "var(--muted-foreground)" }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
        <img
          src="https://images.unsplash.com/photo-1645677020082-721a854c24f2?w=1400&h=600&fit=crop&auto=format"
          alt="Coffee shop interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(26,15,7,0.82) 0%, rgba(61,31,13,0.55) 60%, rgba(61,31,13,0.2) 100%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full py-20 md:py-28">
          <p
            className="mb-3 text-xs tracking-[0.25em] uppercase"
            style={{ color: "var(--accent)", fontFamily: FONT_MONO }}
          >
            Artisan · Specialty · Craft
          </p>
          <h1
            className="mb-5 leading-[1.15] max-w-xl"
            style={{
              fontFamily: FONT_DISPLAY,
              color: "#FAF7F4",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
            }}
          >
            Freshly Brewed<br />
            <em>Coffee Every Day.</em>
          </h1>
          <p
            className="mb-8 max-w-md text-base leading-relaxed"
            style={{ color: "rgba(250,247,244,0.65)" }}
          >
            Handcrafted with single-origin beans. Every cup is a small act of dedication — from our baristas to you.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToMenu}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Order Now <ArrowRight size={16} />
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
              style={{ background: "rgba(250,247,244,0.12)", color: "#FAF7F4", border: "1px solid rgba(250,247,244,0.25)" }}
            >
              View Menu <ChevronDown size={16} />
            </button>
          </div>
          {/* Social proof */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#C4692A", "#8A5030", "#5C3317"].map((bg, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
                  style={{ borderColor: "rgba(26,15,7,0.6)", background: bg, color: "#fff" }}
                >
                  {["M", "S", "J"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} fill="#C4692A" style={{ color: "#C4692A" }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: "rgba(250,247,244,0.55)" }}>
                Loved by 2,400+ coffee regulars
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter ── */}
      <div
        ref={menuRef}
        className="sticky top-16 z-30"
        style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="whitespace-nowrap px-4 py-2 rounded-lg text-sm transition-all flex-shrink-0"
                style={
                  activeCategory === cat
                    ? {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }
                    : {
                        color: "var(--muted-foreground)",
                        background: "transparent",
                      }
                }
              >
                {cat}
              </button>
            ))}
            {/* Mobile search */}
            <div className="ml-auto flex-shrink-0 md:hidden relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-3 py-2 rounded-lg text-sm outline-none w-36"
                style={{
                  background: "var(--input-background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}>
              {activeCategory === "All" ? "Our Menu" : activeCategory}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
          </div>
          {activeCategory === "All" && !search && (
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
            >
              <Star size={12} fill="var(--accent)" style={{ color: "var(--accent)" }} />
              Most popular: <strong style={{ color: "var(--foreground)" }}>{topItem.name}</strong>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Coffee size={40} className="mx-auto mb-4 opacity-20" />
            <p style={{ color: "var(--muted-foreground)" }}>No items match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => {
              const cartQty = cart.find((c) => c.itemId === item.id)?.quantity ?? 0;
              const isTop = item.id === topItem.id;

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "var(--card)",
                    boxShadow: "0 1px 3px rgba(61,31,13,0.06), 0 4px 16px rgba(61,31,13,0.04)",
                    border: "1px solid var(--border)",
                    opacity: item.status === "Out of Stock" ? 0.65 : 1,
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: 192, background: "#F2E8DE" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {isTop && (
                        <span
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ background: "var(--accent)", color: "#fff" }}
                        >
                          <Star size={10} fill="#fff" /> Best Seller
                        </span>
                      )}
                      {item.status === "Out of Stock" && (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{ background: "rgba(26,15,7,0.65)", color: "#FAF7F4" }}
                        >
                          Out of Stock
                        </span>
                      )}
                    </div>
                    {cartQty > 0 && (
                      <div
                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: FONT_MONO }}
                      >
                        {cartQty}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className="text-sm leading-snug flex-1"
                        style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}
                      >
                        {item.name}
                      </h3>
                      <span
                        className="flex-shrink-0 text-sm"
                        style={{ fontFamily: FONT_MONO, color: "var(--accent)" }}
                      >
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <p
                      className="text-xs leading-relaxed flex-1 mb-4 line-clamp-3"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {item.description}
                    </p>

                    {/* Category chip + orders */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-2 py-0.5 rounded-md text-xs"
                        style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                      >
                        {item.category}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--muted-foreground)", fontFamily: FONT_MONO }}
                      >
                        {item.totalOrders.toLocaleString()} orders
                      </span>
                    </div>

                    {/* Add to cart */}
                    {item.status === "Out of Stock" ? (
                      <div
                        className="w-full py-2.5 rounded-xl text-sm text-center"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                      >
                        Out of Stock
                      </div>
                    ) : cartQty === 0 ? (
                      <button
                        onClick={() => handleAdd(item)}
                        className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:opacity-85 active:scale-[0.98]"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        <Plus size={15} /> Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl overflow-hidden" style={{ background: "var(--secondary)" }}>
                        <button
                          onClick={() => onUpdateQty(item.id, cartQty - 1)}
                          className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-70"
                          style={{ color: "var(--foreground)" }}
                        >
                          <Minus size={15} />
                        </button>
                        <span
                          className="text-sm"
                          style={{ fontFamily: FONT_MONO, color: "var(--foreground)" }}
                        >
                          {cartQty}
                        </span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-70"
                          style={{ color: "var(--foreground)" }}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Cart Panel ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(26,15,7,0.45)", backdropFilter: "blur(4px)" }}
            onClick={() => setCartOpen(false)}
          />

          {/* Panel */}
          <div
            className="relative w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right"
            style={{ background: "var(--card)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div>
                <h2 style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}>
                  Your Cart
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-lg transition-opacity hover:opacity-60"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "var(--secondary)" }}
                  >
                    <ShoppingCart size={28} style={{ color: "var(--muted-foreground)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Your cart is empty
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                    Add something from the menu!
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-5 px-5 py-2.5 rounded-xl text-sm"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center gap-4 p-3 rounded-2xl"
                    style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm truncate mb-0.5"
                        style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ fontFamily: FONT_MONO, color: "var(--accent)" }}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => onUpdateQty(item.itemId, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "var(--muted)", color: "var(--foreground)" }}
                      >
                        {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                      </button>
                      <span
                        className="w-6 text-center text-sm"
                        style={{ fontFamily: FONT_MONO, color: "var(--foreground)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.itemId, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "var(--muted)", color: "var(--foreground)" }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span
                      className="text-sm flex-shrink-0 w-14 text-right"
                      style={{ fontFamily: FONT_MONO, color: "var(--foreground)" }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Summary + Checkout */}
            {cart.length > 0 && (
              <div
                className="px-6 py-5 flex-shrink-0 space-y-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
                    <span style={{ fontFamily: FONT_MONO, color: "var(--foreground)" }}>
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--muted-foreground)" }}>Tax (8.5%)</span>
                    <span style={{ fontFamily: FONT_MONO, color: "var(--foreground)" }}>
                      ${cartTax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--foreground)" }}>Total</span>
                    <span
                      className="text-lg"
                      style={{ fontFamily: FONT_MONO, color: "var(--accent)" }}
                    >
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={orderPlaced}
                  className="w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  {orderPlaced ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Placing order…
                    </>
                  ) : (
                    <>
                      Place Order · ${cartTotal.toFixed(2)}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button
                  onClick={onClearCart}
                  className="w-full py-2 text-xs transition-opacity hover:opacity-70"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Clear cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-in { animation: slideIn 0.25s ease-out; }
        .slide-in-from-right { --tw-enter-translate-x: 100%; }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

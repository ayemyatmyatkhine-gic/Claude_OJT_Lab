import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Coffee, Search, ShoppingCart, Star, Clock, Flame,
  LogOut, ChevronRight, X, Plus, Minus, User as UserIcon,
} from "lucide-react";
import { menuItems, categories, type Category } from "../shared/data";
import type { User, CartItem } from "../../App";

interface UserHomeProps {
  user: User;
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onLogout: () => void;
}

export function UserHome({ user, cart, onAddToCart, onLogout }: UserHomeProps) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, "S" | "M" | "L">>({});

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getSize = (id: number, defaultSize: "S" | "M" | "L") =>
    selectedSizes[id] || defaultSize;

  const handleAdd = (item: typeof menuItems[0]) => {
    const availableSizes = item.sizes.map((s) => s.label);
    const size = getSize(item.id, availableSizes[Math.floor(availableSizes.length / 2)]);
    const sizeObj = item.sizes.find((s) => s.label === size) || item.sizes[0];
    onAddToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price + sizeObj.priceAdd,
      quantity: 1,
      size: sizeObj.label,
      image: item.image,
      customizations: [],
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}>
      {/* Navbar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 h-16"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Coffee size={16} color="var(--primary-foreground)" />
          </div>
          <span className="hidden sm:block" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
            BrewHouse
          </span>
        </div>

        <div className="flex-1 max-w-sm mx-4 relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drinks, pastries…"
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--secondary)" }}
          >
            <ShoppingCart size={17} style={{ color: "var(--foreground)" }} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                style={{ background: "var(--accent)", color: "#fff", fontFamily: "'DM Mono', monospace" }}
              >
                {cartCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {user.name[0]}
            </div>
            <span className="hidden sm:block text-sm" style={{ color: "var(--foreground)" }}>{user.name.split(" ")[0]}</span>
          </div>
          <button onClick={onLogout} className="p-2 rounded-lg hover:opacity-70 transition-opacity" style={{ color: "var(--muted-foreground)" }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "var(--primary)", minHeight: 220 }}>
        <img
          src="https://images.unsplash.com/photo-1634863619588-85ff90ef2904?w=1200&h=400&fit=crop&auto=format"
          alt="Coffee bar"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 px-4 md:px-8 py-10 md:py-14 max-w-2xl">
          <p className="text-sm mb-2 tracking-widest uppercase" style={{ color: "var(--accent)", fontFamily: "'DM Mono', monospace" }}>
            Good morning, {user.name.split(" ")[0]}
          </p>
          <h1 className="mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', serif", color: "var(--primary-foreground)" }}>
            What shall we brew<br /><em>for you today?</em>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,248,240,0.65)" }}>
            Order ahead, skip the queue, and have your cup ready when you arrive.
          </p>
        </div>
      </div>

      <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Mobile search */}
        <div className="relative mb-6 md:hidden">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all"
              style={
                activeCategory === cat
                  ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                  : { background: "var(--card)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Most ordered callout */}
        {(activeCategory === "All") && (
          <div
            className="flex items-center gap-3 p-4 rounded-2xl mb-8"
            style={{ background: "linear-gradient(135deg, var(--accent) 0%, #8B4513 100%)", color: "#fff" }}
          >
            <Star size={20} fill="currentColor" />
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace" }}>Most Ordered</p>
              <p className="text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                Signature Espresso — ordered 1,842 times this month
              </p>
            </div>
            <button
              onClick={() => handleAdd(menuItems[0])}
              className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
            >
              Add to cart <ChevronRight size={13} />
            </button>
          </div>
        )}

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const selectedSize = getSize(item.id, item.sizes[Math.floor(item.sizes.length / 2)].label);
            const sizeObj = item.sizes.find((s) => s.label === selectedSize) || item.sizes[0];
            const displayPrice = item.price + sizeObj.priceAdd;

            return (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="relative h-44 bg-amber-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.isTopItem && (
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      <Star size={11} fill="currentColor" />
                      Best Seller
                    </div>
                  )}
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: "rgba(0,0,0,0.5)", color: "#fff", fontFamily: "'DM Mono', monospace" }}
                  >
                    {item.totalOrders.toLocaleString()} orders
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                      {item.name}
                    </h3>
                    <span className="ml-2 text-sm flex-shrink-0" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)" }}>
                      ${displayPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs mb-3 leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 mb-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <Clock size={12} />
                    <span style={{ fontFamily: "'DM Mono', monospace" }}>{item.prepTime} min</span>
                    <span className="mx-1">·</span>
                    <Flame size={12} />
                    <span style={{ fontFamily: "'DM Mono', monospace" }}>{item.calories} kcal</span>
                  </div>

                  {/* Size selector */}
                  {item.sizes.length > 1 && (
                    <div className="flex gap-1.5 mb-3">
                      {item.sizes.map((s) => (
                        <button
                          key={s.label}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [item.id]: s.label }))}
                          className="flex-1 py-1 rounded-lg text-xs transition-colors"
                          style={
                            getSize(item.id, item.sizes[Math.floor(item.sizes.length / 2)].label) === s.label
                              ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                              : { background: "var(--secondary)", color: "var(--secondary-foreground)", border: "1px solid var(--border)" }
                          }
                        >
                          {s.label}
                          {s.priceAdd > 0 && ` +$${s.priceAdd}`}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAdd(item)}
                    className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    <Plus size={15} />
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Coffee size={40} className="mx-auto mb-3 opacity-30" />
            <p style={{ color: "var(--muted-foreground)" }}>No items found. Try a different search.</p>
          </div>
        )}
      </main>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div
            className="relative w-full max-w-sm h-full flex flex-col shadow-2xl"
            style={{ background: "var(--card)" }}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Your Order
              </h2>
              <button onClick={() => setCartOpen(false)} style={{ color: "var(--muted-foreground)" }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Your cart is empty</p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Add something delicious!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.menuItemId}-${item.size}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "'DM Mono', monospace" }}>
                        {item.size} · ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm w-5 text-center" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
                        {item.quantity}
                      </span>
                    </div>
                    <span className="text-sm flex-shrink-0" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between mb-1 text-sm">
                  <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span style={{ color: "var(--muted-foreground)" }}>Est. prep time</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>~5 min</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); navigate("/order"); }}
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Proceed to checkout
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Coffee, ArrowLeft, Plus, Minus, X, CreditCard,
  MapPin, Clock, CheckCircle, LogOut, Star,
} from "lucide-react";
import type { User, CartItem } from "../../App";

interface OrderPageProps {
  user: User;
  cart: CartItem[];
  onUpdateQuantity: (id: number, size: string, qty: number) => void;
  onClearCart: () => void;
  onLogout: () => void;
}

type OrderStep = "cart" | "pickup" | "payment" | "confirmed";

const PICKUP_SLOTS = [
  "Now (~8 min)", "15 min", "30 min", "45 min", "1 hour",
];

export function OrderPage({ user, cart, onUpdateQuantity, onClearCart, onLogout }: OrderPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<OrderStep>("cart");
  const [pickupTime, setPickupTime] = useState(PICKUP_SLOTS[0]);
  const [payMethod, setPayMethod] = useState<"card" | "apple" | "loyalty">("card");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderNumber] = useState(() => `BH-${Math.floor(1000 + Math.random() * 9000)}`);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setStep("confirmed");
    onClearCart();
    setLoading(false);
    toast.success("Order placed successfully!");
  };

  const stepBadge = (label: string, active: boolean, done: boolean) => (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
        style={{
          background: done ? "var(--accent)" : active ? "var(--primary)" : "var(--muted)",
          color: done || active ? "#fff" : "var(--muted-foreground)",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {done ? <CheckCircle size={12} /> : label}
      </div>
    </div>
  );

  if (step === "confirmed") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
        style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "var(--accent)" }}
        >
          <CheckCircle size={36} color="#fff" />
        </div>
        <h1 className="mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
          Order Confirmed!
        </h1>
        <p className="mb-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Your order number is
        </p>
        <p className="mb-6 text-2xl" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)" }}>
          {orderNumber}
        </p>
        <div
          className="w-full max-w-sm rounded-2xl p-5 mb-8"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={16} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>BrewHouse — Main St</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>123 Main Street, Coffeevillle</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-sm" style={{ color: "var(--foreground)" }}>Ready by {pickupTime}</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>We'll notify you when it's ready</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl text-sm"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Back to menu
          </button>
          <button
            onClick={onLogout}
            className="px-6 py-3 rounded-xl text-sm border"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center gap-4 px-4 md:px-8 h-16"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
      >
        <button onClick={() => navigate("/")} style={{ color: "var(--muted-foreground)" }}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Coffee size={14} color="var(--primary-foreground)" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>Checkout</span>
        </div>
        <div className="ml-auto flex items-center gap-6">
          {/* Step indicators */}
          <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            {stepBadge("1", step === "cart", step === "pickup" || step === "payment")}
            <span>Cart</span>
            <div className="w-6 h-px" style={{ background: "var(--border)" }} />
            {stepBadge("2", step === "pickup", step === "payment")}
            <span>Pickup</span>
            <div className="w-6 h-px" style={{ background: "var(--border)" }} />
            {stepBadge("3", step === "payment", false)}
            <span>Payment</span>
          </div>
          <button onClick={onLogout} style={{ color: "var(--muted-foreground)" }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Step: Cart */}
          {step === "cart" && (
            <div>
              <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Review your order
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-16" style={{ color: "var(--muted-foreground)" }}>
                  <Coffee size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Your cart is empty.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-5 py-2 rounded-xl text-sm"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    Browse menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.menuItemId}-${item.size}`}
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                          {item.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
                          Size {item.size} · ${item.price.toFixed(2)} each
                        </p>
                        {item.customizations.length > 0 && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                            {item.customizations.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.menuItemId, item.size, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: "var(--secondary)", color: "var(--foreground)" }}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.menuItemId, item.size, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: "var(--secondary)", color: "var(--foreground)" }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.menuItemId, item.size, 0)}
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "var(--foreground)" }}>
                      Order note (optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Any special instructions for your order…"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <button
                    onClick={() => setStep("pickup")}
                    disabled={cart.length === 0}
                    className="w-full py-3 rounded-xl text-sm disabled:opacity-50"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    Continue to pickup options
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step: Pickup */}
          {step === "pickup" && (
            <div>
              <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Pick-up time
              </h2>
              <div
                className="flex items-start gap-3 p-4 rounded-2xl mb-6"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <MapPin size={18} style={{ color: "var(--accent)", marginTop: 2 }} />
                <div>
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>BrewHouse — Main Street</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>123 Main Street, Coffeeville · Open until 9 PM</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {PICKUP_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setPickupTime(slot)}
                    className="py-3 px-4 rounded-xl text-sm transition-all"
                    style={
                      pickupTime === slot
                        ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                        : { background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }
                    }
                  >
                    <Clock size={13} className="inline mr-1.5" />
                    {slot}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("cart")}
                  className="flex-1 py-3 rounded-xl text-sm border"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 py-3 rounded-xl text-sm"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {/* Step: Payment */}
          {step === "payment" && (
            <div>
              <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
                Payment method
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: "card" as const, label: "Credit / Debit card", sub: "Visa ending in 4242", icon: <CreditCard size={18} /> },
                  { id: "apple" as const, label: "Apple Pay", sub: "Touch ID to confirm", icon: <Star size={18} /> },
                  { id: "loyalty" as const, label: "Loyalty Beans", sub: "1,280 beans available (~$12.80)", icon: <Coffee size={18} /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                    style={
                      payMethod === m.id
                        ? { background: "var(--secondary)", border: "2px solid var(--accent)" }
                        : { background: "var(--card)", border: "2px solid var(--border)" }
                    }
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: payMethod === m.id ? "var(--accent)" : "var(--muted)", color: payMethod === m.id ? "#fff" : "var(--muted-foreground)" }}>
                      {m.icon}
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--foreground)" }}>{m.label}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{m.sub}</p>
                    </div>
                    {payMethod === m.id && (
                      <CheckCircle size={18} className="ml-auto" style={{ color: "var(--accent)" }} />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("pickup")}
                  className="flex-1 py-3 rounded-xl text-sm border"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl text-sm disabled:opacity-60"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  {loading ? "Placing order…" : `Pay $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-5 sticky top-24"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <h3 className="mb-4 text-base" style={{ fontFamily: "'Playfair Display', serif", color: "var(--foreground)" }}>
              Order summary
            </h3>
            {cart.map((item) => (
              <div key={`${item.menuItemId}-${item.size}`} className="flex justify-between mb-2 text-sm">
                <span style={{ color: "var(--foreground)" }}>
                  {item.name} <span style={{ color: "var(--muted-foreground)" }}>×{item.quantity}</span>
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="my-4 h-px" style={{ background: "var(--border)" }} />
            <div className="flex justify-between mb-2 text-sm">
              <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span style={{ color: "var(--muted-foreground)" }}>Tax (8.5%)</span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span style={{ color: "var(--muted-foreground)" }}>Pick-up</span>
              <span style={{ color: "var(--accent)" }}>Free</span>
            </div>
            <div className="my-4 h-px" style={{ background: "var(--border)" }} />
            <div className="flex justify-between">
              <span style={{ color: "var(--foreground)" }}>Total</span>
              <span className="text-lg" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)" }}>
                ${total.toFixed(2)}
              </span>
            </div>
            {step !== "cart" && (
              <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                <Clock size={12} className="inline mr-1" />
                Pickup at <strong>{pickupTime}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Coffee } from "lucide-react";
import type { AppUser } from "../../App";

const FONT_DISPLAY = "'Playfair Display', serif";
const FONT_BODY = "'Inter', sans-serif";

const DEMO_USERS: AppUser[] = [
  { id: "c1", name: "Alex Rivera", email: "alex@example.com", role: "customer" },
  { id: "c2", name: "Jordan Kim", email: "jordan@example.com", role: "customer" },
  { id: "a1", name: "Sam Chen", email: "admin@brewhouse.com", role: "admin" },
];

interface Props {
  onLogin: (user: AppUser) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter your email and password."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found && password.length >= 6) {
      toast.success(`Welcome back, ${found.name}!`);
      onLogin(found);
    } else {
      toast.error("Invalid credentials. Use a demo account below.");
    }
    setLoading(false);
  };

  const quickLogin = (role: "customer" | "admin") => {
    const u = role === "admin" ? DEMO_USERS[2] : DEMO_USERS[0];
    toast.success(`Signed in as ${u.name}`);
    onLogin(u);
  };

  const inputBase = {
    background: "var(--input-background)",
    border: "1.5px solid var(--border)",
    color: "var(--foreground)",
    fontFamily: FONT_BODY,
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: FONT_BODY, background: "var(--background)" }}
    >
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "var(--primary)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1645677020082-721a854c24f2?w=800&h=1200&fit=crop&auto=format"
          alt="Coffee shop"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        {/* Top: logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <Coffee size={20} color="#fff" />
          </div>
          <span
            className="text-xl"
            style={{ fontFamily: FONT_DISPLAY, color: "var(--primary-foreground)" }}
          >
            BrewHouse
          </span>
        </div>

        {/* Middle: headline */}
        <div className="relative z-10">
          <h1
            className="leading-snug mb-4"
            style={{
              fontFamily: FONT_DISPLAY,
              color: "var(--primary-foreground)",
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
            }}
          >
            Freshly brewed,<br />
            <em>every single day.</em>
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "rgba(250,247,244,0.6)", maxWidth: 340 }}
          >
            Order ahead, skip the queue, and pick up your perfect cup when you arrive.
          </p>
        </div>

        {/* Bottom: social proof */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#C4692A", "#8A5030", "#5C3317"].map((bg, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
                  style={{ borderColor: "var(--primary)", background: bg, color: "#fff" }}
                >
                  {["A", "B", "C"][i]}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: "rgba(250,247,244,0.5)" }}>
              2,400+ happy regulars
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <Coffee size={17} color="var(--primary-foreground)" />
            </div>
            <span
              className="text-lg"
              style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}
            >
              BrewHouse
            </span>
          </div>

          <h2
            className="mb-1"
            style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}
          >
            Welcome back
          </h2>
          <p className="mb-8 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputBase}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm" style={{ color: "var(--foreground)" }}>
                  Password
                </label>
                <span
                  className="text-xs cursor-pointer hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-12"
                  style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity hover:opacity-60"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium mt-2 transition-all disabled:opacity-60 hover:opacity-85"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              or try a demo
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Quick demo logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => quickLogin("customer")}
              className="py-2.5 rounded-xl text-sm border transition-all hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                background: "var(--card)",
              }}
            >
              Customer Demo
            </button>
            <button
              onClick={() => quickLogin("admin")}
              className="py-2.5 rounded-xl text-sm border transition-all hover:opacity-80"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                background: "var(--card)",
              }}
            >
              Admin Demo
            </button>
          </div>

          <p className="mt-8 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

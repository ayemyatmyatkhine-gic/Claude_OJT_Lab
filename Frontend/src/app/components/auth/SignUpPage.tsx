import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Coffee, CheckCircle2 } from "lucide-react";
import type { AppUser } from "../../App";

const FONT_DISPLAY = "'Playfair Display', serif";
const FONT_BODY = "'Inter', sans-serif";

interface Props {
  onLogin: (user: AppUser) => void;
}

export function SignUpPage({ onLogin }: Props) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Strong"][passwordStrength];
  const strengthColor = ["", "#C0392B", "#C4692A", "#3D7A5E"][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const newUser: AppUser = {
      id: `c${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      role: "customer",
    };
    toast.success(`Welcome to BrewHouse, ${newUser.name}!`);
    onLogin(newUser);
    setLoading(false);
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
          src="https://images.unsplash.com/photo-1598959652545-c0230cdbb01f?w=800&h=1200&fit=crop&auto=format"
          alt="Coffee menu board"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
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

        <div className="relative z-10">
          <h1
            className="leading-snug mb-4"
            style={{
              fontFamily: FONT_DISPLAY,
              color: "var(--primary-foreground)",
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
            }}
          >
            Start your<br />
            <em>coffee journey.</em>
          </h1>
          <p
            className="mb-8 text-base leading-relaxed"
            style={{ color: "rgba(250,247,244,0.6)", maxWidth: 340 }}
          >
            Join thousands of coffee lovers who discover their perfect cup every day.
          </p>
          {/* Perks list */}
          <div className="space-y-3">
            {[
              "Order ahead, skip the line",
              "Personalised AI drink recommendations",
              "Earn loyalty beans with every order",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle2
                  size={17}
                  style={{ color: "var(--accent)", flexShrink: 0 }}
                />
                <span className="text-sm" style={{ color: "rgba(250,247,244,0.7)" }}>
                  {perk}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10" />
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

          <h2 className="mb-1" style={{ fontFamily: FONT_DISPLAY, color: "var(--foreground)" }}>
            Create your account
          </h2>
          <p className="mb-8 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Join BrewHouse — it's free and takes 30 seconds
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                Full name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Alex Rivera"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputBase}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputBase}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-12"
                  style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-60 transition-opacity"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1.5 mb-1">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          background: passwordStrength >= n ? strengthColor : "var(--muted)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--foreground)" }}>
                Confirm password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  ...inputBase,
                  borderColor:
                    form.confirm && form.confirm !== form.password
                      ? "var(--destructive)"
                      : "var(--border)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    form.confirm && form.confirm !== form.password
                      ? "var(--destructive)"
                      : "var(--border)")
                }
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium mt-2 transition-all disabled:opacity-60 hover:opacity-85"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
            By signing up you agree to our{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--accent)" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--accent)" }}>
              Privacy Policy
            </span>
            .
          </p>

          <p className="mt-6 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

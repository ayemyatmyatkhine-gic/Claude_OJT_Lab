import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { LoginPage } from "./components/auth/LoginPage";
import { SignUpPage } from "./components/auth/SignUpPage";
import { CustomerPage } from "./components/customer/CustomerPage";
import { AdminPage } from "./components/admin/AdminPage";
import { ChatBot } from "./components/shared/ChatBot";
import type { CartItem } from "./components/shared/coffeeData";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
};

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === item.itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (itemId: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.itemId !== itemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.itemId === itemId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const clearCart = () => setCart([]);

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage onLogin={setUser} />} />
          <Route path="/signup" element={<SignUpPage onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {user.role === "admin" ? (
          <>
            <Route path="/" element={<AdminPage user={user} onLogout={logout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <CustomerPage
                  user={user}
                  cart={cart}
                  onAddToCart={addToCart}
                  onUpdateQty={updateQty}
                  onClearCart={clearCart}
                  onLogout={logout}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
      {user.role === "customer" && <ChatBot userName={user.name} cart={cart} />}
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

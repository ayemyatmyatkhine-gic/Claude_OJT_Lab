import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Coffee, Bot, Minimize2 } from "lucide-react";
import type { CartItem } from "./coffeeData";

const FONT_DISPLAY = "'Playfair Display', serif";
const FONT_BODY = "'Inter', sans-serif";

interface Props {
  userName: string;
  cart: CartItem[];
}

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

function getResponse(input: string, userName: string, cart: CartItem[]): string {
  const q = input.toLowerCase();
  const first = userName.split(" ")[0];

  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("help")) {
    return `Hey ${first}! ☕ I'm Brew, your AI barista. I can recommend drinks, help with dietary questions, or tell you what's in your cart. What are you in the mood for?`;
  }
  if (q.includes("recommend") || q.includes("suggest") || q.includes("popular") || q.includes("best")) {
    return `Our absolute best-seller is the **Classic Espresso** — bold, rich, 1,842 orders this month. If you prefer something sweet and cold, the **Cold Brew Reserve** is trending hard right now. Feeling indulgent? Try the **Dark Chocolate Mocha**. Which sounds good?`;
  }
  if (q.includes("cold") || q.includes("iced")) {
    return `Our cold options are:\n• **Cold Brew Reserve** ($5.00) — 18-hour steep, smooth and chocolatey\n• **Nitro Cold Brew** ($6.00) — nitrogen-infused, creamy cascade\n• **Iced Brown Sugar Latte** ($5.50) — espresso, oat milk, brown sugar\n\nAll refreshing choices for a warm day!`;
  }
  if (q.includes("latte")) {
    return `We have three lattes you'll love:\n• **Caramel Latte** ($5.50) — salted caramel drizzle\n• **Vanilla Oat Latte** ($5.50) — dairy-free, naturally sweet\n• **Iced Brown Sugar Latte** ($5.50) — espresso over ice\n\nAll made with espresso and silky steamed milk.`;
  }
  if (q.includes("cappuccino")) {
    return `Our cappuccinos:\n• **Classic Cappuccino** ($4.50) — equal thirds espresso, milk, and foam with cacao dust\n• **Dry Cappuccino** ($4.50) — mostly foam, more intense espresso — for the purist\n\nBoth are currently Available!`;
  }
  if (q.includes("espresso") || q.includes("strong") || q.includes("caffeine")) {
    return `For a caffeine boost:\n1. **Nitro Cold Brew** — highest caffeine, ultra smooth\n2. **Classic Espresso** — our #1 seller, concentrated and intense\n3. **Smooth Americano** — espresso diluted with hot water, bright and clean\n\nAll three will wake you right up!`;
  }
  if (q.includes("vegan") || q.includes("dairy") || q.includes("plant") || q.includes("oat")) {
    return `Great news — most drinks can be made with **oat milk** at no extra charge. Our **Vanilla Oat Latte** and **Iced Brown Sugar Latte** already use oat milk by default. The **Cold Brew** and **Nitro Cold Brew** are naturally dairy-free too!`;
  }
  if (q.includes("price") || q.includes("cost") || q.includes("cheap")) {
    return `Our menu ranges from **$3.50** (Classic Espresso) to **$6.00** (Nitro Cold Brew). Most drinks are in the $4.50–$5.50 range. The best value combo? A Classic Espresso + Butter Croissant for under $7!`;
  }
  if (q.includes("cart") || q.includes("order") || q.includes("checkout")) {
    if (cart.length === 0) {
      return `Your cart is empty right now. Browse the menu above and tap **Add to Cart** on anything that catches your eye. Need a suggestion?`;
    }
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const names = cart.map((i) => `${i.name} ×${i.quantity}`).join(", ");
    return `You have **${cart.length} item(s)** in your cart: ${names}. Subtotal: **$${total.toFixed(2)}** (before tax). Ready to checkout? Tap the cart icon in the top-right corner!`;
  }
  if (q.includes("mocha")) {
    return `Our mochas are rich and indulgent:\n• **Dark Chocolate Mocha** ($5.50) — 70% dark chocolate, espresso, whipped cream\n• **White Chocolate Mocha** ($5.50) — creamy white chocolate sauce, steamed milk\n\nPerfect for a sweet treat!`;
  }
  if (q.includes("wait") || q.includes("time") || q.includes("how long") || q.includes("ready")) {
    return `Most orders are ready in **2–5 minutes**. Espressos and Americanos take ~2 min, lattes and mochas ~4–5 min. After you place your order, you'll see an estimated ready time!`;
  }
  return `I'd love to help! Ask me about our drinks, caffeine options, dairy-free alternatives, prices, or your cart. What's on your mind, ${first}?`;
}

export function ChatBot({ userName, cart }: Props) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: `Hi ${userName.split(" ")[0]}! ☕ I'm **Brew**, your AI barista. Ask me for drink recommendations, dietary info, or help with your order!`,
    },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, minimized]);

  const send = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((p) => [...p, { id: Date.now().toString(), role: "user", text: userText }]);
    setInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));
    setMessages((p) => [
      ...p,
      { id: (Date.now() + 1).toString(), role: "bot", text: getResponse(userText, userName, cart) },
    ]);
    setTyping(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const renderText = (text: string) =>
    text.split("\n").map((line, i) => {
      const html = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p key={i} dangerouslySetInnerHTML={{ __html: html }} className={i > 0 ? "mt-1" : ""} />
      );
    });

  const PROMPTS = ["Recommend a drink", "Vegan options", "My cart", "Strongest coffee"];

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <MessageCircle size={22} />
          {cart.length > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontFamily: "'DM Mono', monospace" }}
            >
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 shadow-2xl flex flex-col overflow-hidden"
          style={{
            bottom: 24,
            right: 24,
            width: "min(380px, calc(100vw - 32px))",
            height: minimized ? "auto" : "min(540px, calc(100vh - 100px))",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            fontFamily: FONT_BODY,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "var(--primary)", borderRadius: "20px 20px 0 0" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent)" }}
            >
              <Bot size={17} color="#fff" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm leading-none"
                style={{ fontFamily: FONT_DISPLAY, color: "var(--primary-foreground)" }}
              >
                Brew — AI Barista
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: typing ? "#D4A843" : "#4ade80" }}
                />
                <span className="text-xs" style={{ color: "rgba(250,247,244,0.55)" }}>
                  {typing ? "Thinking…" : "Online"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
              style={{ color: "rgba(250,247,244,0.55)" }}
            >
              <Minimize2 size={14} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
              style={{ color: "rgba(250,247,244,0.55)" }}
            >
              <X size={14} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "var(--accent)" }}
                      >
                        <Coffee size={13} color="#fff" />
                      </div>
                    )}
                    <div
                      className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={
                        msg.role === "user"
                          ? {
                              background: "var(--primary)",
                              color: "var(--primary-foreground)",
                              borderBottomRightRadius: 4,
                            }
                          : {
                              background: "var(--secondary)",
                              color: "var(--foreground)",
                              borderBottomLeftRadius: 4,
                            }
                      }
                    >
                      {renderText(msg.text)}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--accent)" }}
                    >
                      <Coffee size={13} color="#fff" />
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl"
                      style={{ background: "var(--secondary)", borderBottomLeftRadius: 4 }}
                    >
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{
                              background: "var(--muted-foreground)",
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: "0.9s",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts */}
              <div
                className="px-4 pb-2 flex gap-1.5 overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={async () => {
                      setInput(p);
                      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", text: p }]);
                      setTyping(true);
                      await new Promise((r) => setTimeout(r, 700));
                      setMessages((prev) => [
                        ...prev,
                        { id: (Date.now() + 1).toString(), role: "bot", text: getResponse(p, userName, cart) },
                      ]);
                      setTyping(false);
                      setInput("");
                    }}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs flex-shrink-0 transition-all hover:opacity-80"
                    style={{
                      background: "var(--secondary)",
                      color: "var(--muted-foreground)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div
                className="flex items-center gap-2 p-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Ask me anything…"
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-background)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontFamily: FONT_BODY,
                  }}
                />
                <button
                  onClick={send}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-35 hover:opacity-80"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

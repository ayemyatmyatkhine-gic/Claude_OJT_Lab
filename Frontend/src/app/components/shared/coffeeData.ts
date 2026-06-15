export type Category = "All" | "Espresso" | "Latte" | "Cappuccino" | "Mocha" | "Cold Brew";

export const CATEGORIES: Category[] = ["All", "Espresso", "Latte", "Cappuccino", "Mocha", "Cold Brew"];

export type CoffeeItem = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  description: string;
  image: string;
  status: "Available" | "Out of Stock";
  totalOrders: number;
};

export const initialCoffeeItems: CoffeeItem[] = [
  {
    id: 1,
    name: "Classic Espresso",
    category: "Espresso",
    price: 3.5,
    description: "A bold, concentrated shot pulled from our house single-origin blend. Rich crema, notes of dark chocolate and walnut.",
    image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 1842,
  },
  {
    id: 2,
    name: "Smooth Americano",
    category: "Espresso",
    price: 4.0,
    description: "Double espresso diluted with hot water to your preferred strength. Clean, bright, and endlessly drinkable.",
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 1124,
  },
  {
    id: 3,
    name: "Caramel Latte",
    category: "Latte",
    price: 5.5,
    description: "Espresso with velvety steamed milk and our house-made salted caramel syrup. Topped with a swirl of caramel drizzle.",
    image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 987,
  },
  {
    id: 4,
    name: "Vanilla Oat Latte",
    category: "Latte",
    price: 5.5,
    description: "Silky oat milk steamed with two shots of espresso and Madagascar vanilla. Naturally sweet and dairy-free.",
    image: "https://images.unsplash.com/photo-1571328003758-4a3921661729?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 743,
  },
  {
    id: 5,
    name: "Classic Cappuccino",
    category: "Cappuccino",
    price: 4.5,
    description: "Equal thirds of espresso, steamed milk, and thick velvety foam. Dusted with a veil of fine cacao powder.",
    image: "https://images.unsplash.com/photo-1534234757579-8ad69d218ad4?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 1204,
  },
  {
    id: 6,
    name: "Dry Cappuccino",
    category: "Cappuccino",
    price: 4.5,
    description: "Mostly stiff foam with minimal steamed milk for a more intense espresso flavour. For the cappuccino purist.",
    image: "https://images.unsplash.com/photo-1578314674306-5f52904e35bd?w=480&h=360&fit=crop&auto=format",
    status: "Out of Stock",
    totalOrders: 312,
  },
  {
    id: 7,
    name: "Dark Chocolate Mocha",
    category: "Mocha",
    price: 5.5,
    description: "Two shots of espresso swirled with 70% dark chocolate and steamed whole milk. Finished with whipped cream.",
    image: "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 865,
  },
  {
    id: 8,
    name: "White Chocolate Mocha",
    category: "Mocha",
    price: 5.5,
    description: "Espresso with creamy white chocolate sauce and steamed milk. Indulgent, sweet, and irresistible.",
    image: "https://images.unsplash.com/photo-1549652127-2e5e59e86a7a?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 631,
  },
  {
    id: 9,
    name: "Cold Brew Reserve",
    category: "Cold Brew",
    price: 5.0,
    description: "Steeped for 18 hours in cold filtered water. Naturally sweet, low-acid, and rich with notes of dark chocolate.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 1356,
  },
  {
    id: 10,
    name: "Nitro Cold Brew",
    category: "Cold Brew",
    price: 6.0,
    description: "Cold brew charged with nitrogen for a creamy, Guinness-like cascade effect. Smooth with a silky, foamy head.",
    image: "https://images.unsplash.com/photo-1527156231393-7023794f363c?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 612,
  },
  {
    id: 11,
    name: "Iced Brown Sugar Latte",
    category: "Latte",
    price: 5.5,
    description: "Espresso over ice with brown sugar syrup and a splash of oat milk. Stir, sip, repeat.",
    image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 489,
  },
  {
    id: 12,
    name: "Macchiato",
    category: "Espresso",
    price: 4.0,
    description: "A ristretto shot 'stained' with a dollop of foamed milk. Small but mighty — the purest espresso experience.",
    image: "https://images.unsplash.com/photo-1642647391072-6a2416f048e5?w=480&h=360&fit=crop&auto=format",
    status: "Available",
    totalOrders: 478,
  },
];

export type CartItem = {
  itemId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

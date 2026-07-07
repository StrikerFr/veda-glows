import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "./products";

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addStarterKit: (qty?: number) => void;
  setStarterKitQty: (qty: number) => void;
  removeItem: (sku: string) => void;
  clear: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addStarterKit: (qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.sku === PRODUCTS.STARTER_KIT.sku);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
        } else {
          items.push({
            sku: PRODUCTS.STARTER_KIT.sku,
            name: PRODUCTS.STARTER_KIT.name,
            price: PRODUCTS.STARTER_KIT.price,
            quantity: qty,
          });
        }
        set({ items });
      },
      setStarterKitQty: (qty: number) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.sku !== PRODUCTS.STARTER_KIT.sku) });
          return;
        }
        const items = [...get().items];
        const idx = items.findIndex((i) => i.sku === PRODUCTS.STARTER_KIT.sku);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: qty };
        } else {
          items.push({
            sku: PRODUCTS.STARTER_KIT.sku,
            name: PRODUCTS.STARTER_KIT.name,
            price: PRODUCTS.STARTER_KIT.price,
            quantity: qty,
          });
        }
        set({ items });
      },
      removeItem: (sku) => set({ items: get().items.filter((i) => i.sku !== sku) }),
      clear: () => set({ items: [] }),
      totalQuantity: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () => {
        const items = get().items;
        const qty = items.reduce((s, i) => s + i.quantity, 0);
        return qty * PRODUCTS.STARTER_KIT.price;
      },
    }),
    { name: "vedaglow-cart" },
  ),
);

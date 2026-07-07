// Single product catalog — VedaGlows Starter Kit
export const PRODUCTS = {
  STARTER_KIT: {
    sku: "VG-STARTER-1",
    name: "VedaGlows Starter Kit",
    price: 499,
    compareAt: 1299,
    description: "28-Day Skin Reset — Daily Clean, Glow Repair, Deep Detox",
    contents: ["Daily Clean", "Glow Repair", "Deep Detox"],
  },
  BUNDLE_2: {
    sku: "VG-STARTER-2",
    name: "VedaGlows Starter Kit · 2-Pack",
    price: 899,
    compareAt: 2598,
    description: "Two 28-Day Skin Reset kits — share or stock up",
    contents: ["2× Daily Clean", "2× Glow Repair", "2× Deep Detox"],
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

export const SHIPPING_FEE = 0; // free shipping

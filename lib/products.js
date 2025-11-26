// Formatter & helper harga
export const currencyIDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});
export const basePrice = (p) => p?.variants?.[0]?.price ?? 0;

// Load JSON dari /public/products.json (client-side)
export async function loadProductsJSON() {
  try {
    const res = await fetch("/products.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products.json");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("[products] fallback (empty).", e);
    return [];
  }
}

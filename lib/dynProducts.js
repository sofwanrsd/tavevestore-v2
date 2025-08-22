// Simpan produk kustom di browser (localStorage)
export const LOCAL_KEY = "taveve_custom_products_v1";

export function loadCustomProducts() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomProducts(arr) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(arr || []));
}

export function upsertProduct(p) {
  const arr = loadCustomProducts();
  const i = arr.findIndex((x) => x.id === p.id);
  if (i >= 0) arr[i] = p;
  else arr.push(p);
  saveCustomProducts(arr);
  return arr;
}

export function deleteProduct(id) {
  const arr = loadCustomProducts().filter((x) => x.id !== id);
  saveCustomProducts(arr);
  return arr;
}

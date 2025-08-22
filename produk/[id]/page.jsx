"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { currencyIDR, loadProductsJSON } from "@/lib/products";
import { WHATSAPP_NUMBER } from "@/lib/config";

export default function DetailPage() {
  const { id } = useParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // Muat data JSON publik
  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await loadProductsJSON();
      if (!alive) return;
      setAll(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const product = useMemo(() => all.find((p) => p.id === id), [all, id]);

  // ==== FIX di sini: pakai string kosong "" sebagai default, bukan null ====
  const firstVariantId = product?.variants?.[0]?.id ?? "";
  const [variantId, setVariantId] = useState("");

  // Saat product berubah, set default variant 1x
  useEffect(() => {
    setVariantId(firstVariantId);
  }, [firstVariantId]);

  const [qty, setQty] = useState(1);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (product) {
      setQty(1);
      setAgree(false);
    }
  }, [product]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Memuat produk…</h1>
        <a
          href="/"
          className="mt-4 inline-block rounded-xl bg-slate-800 px-5 py-3 text-white"
        >
          Kembali ke Beranda
        </a>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <a
          href="/"
          className="mt-4 inline-block rounded-xl bg-slate-800 px-5 py-3 text-white"
        >
          Kembali ke Beranda
        </a>
      </main>
    );
  }

  const variant = product.variants?.find((v) => v.id === variantId);
  const total = (variant?.price ?? 0) * qty;

  function goBack() {
    if (history.length > 1) history.back();
    else window.location.href = "/#produk";
  }

  function buy() {
    if (!agree || !variant) return;
    const cmd = `buy ${variant.code} ${Math.max(1, qty || 1)}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cmd)}`,
      "_blank"
    );
  }

  const hasVariants =
    Array.isArray(product.variants) && product.variants.length > 0;

  return (
    <main className="pb-16">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-4">
          <button
            onClick={goBack}
            className="rounded-xl border border-slate-200 px-3 py-2"
          >
            ← Kembali
          </button>
          <div className="font-semibold">{product.name}</div>
          <a
            href="/#produk"
            className="hidden sm:inline-block rounded-xl border border-slate-200 px-3 py-2"
          >
            Beranda
          </a>
        </div>
      </section>

      <section className="container mx-auto grid items-start gap-6 px-4 py-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div
            className="h-56 w-full bg-slate-200 bg-cover bg-center sm:h-80"
            style={{ backgroundImage: `url('${product.img}')` }}
          />
          <div className="p-5 sm:p-6">
            <h1 className="text-xl font-bold">{product.name}</h1>
            <p className="mt-2 text-slate-600">{product.desc}</p>
            {!!product.features?.length && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
                {product.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          id="beli"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6"
        >
          <h2 className="text-lg font-semibold">Beli</h2>

          <div className="mt-4">
            <label className="block text-sm text-slate-600">
              Paket / Varian
            </label>

            {/* ==== FIX: value pakai string, ada placeholder jika belum ada pilihan ==== */}
            <select
              value={variantId ?? ""} // <= tidak pernah null
              onChange={(e) => setVariantId(e.target.value)}
              disabled={!hasVariants}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {!hasVariants && <option value="">Tidak ada varian</option>}
              {hasVariants && (
                <>
                  <option value="" disabled>
                    Pilih varian…
                  </option>
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} — {currencyIDR.format(v.price)}
                    </option>
                  ))}
                </>
              )}
            </select>

            {variant && (
              <p className="mt-1 text-xs text-slate-500">
                Kode varian (bot):{" "}
                <code className="font-semibold">{variant.code}</code>
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm text-slate-600">Jumlah</label>
            <div className="mt-1 inline-flex items-center gap-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(
                    Math.min(
                      100,
                      Math.max(1, parseInt(e.target.value || "1", 10))
                    )
                  )
                }
                className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center shadow-soft focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <button
                onClick={() => setQty((q) => Math.min(100, q + 1))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                +
              </button>
            </div>
          </div>

          {!!product.snk?.length && (
            <div className="mt-4">
              <h3 className="font-semibold">Syarat & Ketentuan</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 text-sm">
                {product.snk.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <label className="mt-3 inline-flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/40"
                />
                <span>
                  Saya telah membaca & setuju dengan Syarat & Ketentuan.
                </span>
              </label>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
            <span className="text-slate-500">Total</span>
            <span className="text-lg font-extrabold">
              {currencyIDR.format(total)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={buy}
              disabled={!agree || !variant}
              className={`w-full rounded-xl px-4 py-2 font-semibold text-white ${
                agree && variant
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600"
                  : "bg-amber-400/60 cursor-not-allowed"
              }`}
            >
              Beli via WhatsApp
            </button>
            <button
              onClick={goBack}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2"
            >
              Kembali
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Format bot:{" "}
            <code className="font-semibold">
              buy &lt;kode&gt; &lt;jumlah&gt;
            </code>{" "}
            — contoh: <code>buy canva1b 10</code>
          </p>
        </div>
      </section>
    </main>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { currencyIDR } from "@/lib/products";

export default function ProductModal({ product, open, onClose }) {
  const [variantId, setVariantId] = useState(
    product?.variants?.[0]?.id || null
  );
  const [qty, setQty] = useState(1);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-hidden");
      document.body.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  useEffect(() => {
    if (product) {
      setVariantId(product.variants?.[0]?.id || null);
      setQty(1);
      setAgree(false);
    }
  }, [product]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const variant = useMemo(
    () =>
      product?.variants.find((v) => v.id === variantId) ||
      product?.variants?.[0],
    [product, variantId]
  );
  const total = useMemo(
    () => (variant ? variant.price * qty : 0),
    [variant, qty]
  );

  function buy() {
    if (!agree) return;
    const code = variant?.code;
    if (!code) return alert("Kode varian belum diatur.");
    const cmd = `buy ${code} ${Math.max(1, qty || 1)}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      cmd
    )}`;
    window.open(url, "_blank");
  }

  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose}></div>

      <div className="relative min-h-full flex items-start justify-center p-4 sm:p-6">
        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft md:grid-cols-2 max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
          >
            &times;
          </button>

          <div
            className="h-56 w-full bg-slate-200 bg-cover bg-center sm:h-72 md:h-auto md:max-h-[90vh]"
            style={{ backgroundImage: `url('${product.img}')` }}
            aria-hidden="true"
          ></div>

          <div className="p-5 sm:p-6 overflow-y-auto md:max-h-[90vh]">
            <h3 id="modalTitle" className="text-xl font-bold">
              {product.name}
            </h3>
            <p className="mt-1 text-slate-600">{product.desc}</p>

            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {(product.features || []).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <div className="mt-4">
              <h4 className="font-semibold">Syarat & Ketentuan</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 text-sm">
                {(product.snk || []).map((s, i) => (
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

            <div className="mt-4">
              <label className="block text-sm text-slate-600">
                Paket / Varian
              </label>
              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} — {currencyIDR.format(v.price)}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Kode varian untuk bot:{" "}
                <code className="font-semibold">{variant?.code || "-"}</code>
              </p>
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

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
              <span className="text-slate-500">Total</span>
              <span className="text-lg font-extrabold">
                {currencyIDR.format(total)}
              </span>
            </div>

            <div className="mt-4 mb-2 flex flex-wrap gap-2">
              <button
                onClick={buy}
                disabled={!agree}
                aria-disabled={!agree}
                className={`rounded-xl px-4 py-2 font-medium text-white ${
                  agree
                    ? "bg-brand hover:bg-brand-dark"
                    : "bg-brand/60 cursor-not-allowed"
                }`}
              >
                Beli via WhatsApp
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2"
              >
                Tutup
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Format bot:{" "}
              <code className="font-semibold">
                buy &lt;kode&gt; &lt;jumlah&gt;
              </code>{" "}
              — contoh: <code>buy canva1b 10</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

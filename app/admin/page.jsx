"use client";
import { useEffect, useMemo, useState } from "react";
import {
  loadCustomProducts,
  upsertProduct,
  deleteProduct,
  saveCustomProducts,
} from "@/lib/dynProducts";
import { loadProductsJSON } from "@/lib/products";

const blankProduct = {
  id: "",
  name: "",
  img: "",
  desc: "",
  tags: [],
  features: [],
  snk: [],
  variants: [{ id: "30d", label: "30 hari", price: 0, code: "" }],
};

export default function AdminPage() {
  const [defaults, setDefaults] = useState([]); // dari public/products.json (publik)
  const [items, setItems] = useState([]); // kustom (localStorage)
  const [editing, setEditing] = useState(blankProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState("");

  // muat data awal
  useEffect(() => {
    loadProductsJSON().then((d) => setDefaults(Array.isArray(d) ? d : []));
    setItems(loadCustomProducts());
    const onStorage = (e) => {
      if (e.key === "taveve_custom_products_v1") setItems(loadCustomProducts());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // semua tag unik dari defaults + items
  const allTags = useMemo(() => {
    const def = (defaults || []).flatMap((p) => p.tags || []);
    const cur = (items || []).flatMap((p) => p.tags || []);
    return Array.from(new Set([...def, ...cur]))
      .filter(Boolean)
      .sort();
  }, [defaults, items]);

  // gabungkan defaults + items (items override id sama)
  const merged = useMemo(() => {
    const map = new Map((defaults || []).map((p) => [p.id, p]));
    (items || []).forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  }, [defaults, items]);

  function resetForm() {
    setEditing(blankProduct);
    setIsEditing(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!editing.id) return alert("ID produk wajib diisi.");
    if (!/^[a-z0-9-]+$/.test(editing.id))
      return alert("ID hanya huruf kecil/angka/tanda - (slug).");

    const clean = {
      ...editing,
      id: editing.id.trim().toLowerCase(),
      tags: (editing.tags || []).map((t) => String(t).trim()).filter(Boolean),
      features: (editing.features || [])
        .map((t) => String(t).trim())
        .filter(Boolean),
      snk: (editing.snk || []).map((t) => String(t).trim()).filter(Boolean),
      variants: (editing.variants || [])
        .map((v) => ({
          id: String(v.id || "").trim(),
          label: String(v.label || "").trim(),
          price: Number(v.price || 0),
          code: String(v.code || "").trim(),
        }))
        .filter((v) => v.id && v.label && v.code && v.price >= 0),
    };

    const arr = upsertProduct(clean);
    setItems(arr);
    resetForm();
  }

  function editItem(p) {
    setEditing({
      ...p,
      tags: p.tags ? [...p.tags] : [],
      features: p.features ? [...p.features] : [],
      snk: p.snk ? [...p.snk] : [],
      variants: p.variants
        ? p.variants.map((v) => ({ ...v }))
        : [{ id: "30d", label: "30 hari", price: 0, code: "" }],
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Export hanya produk kustom (untuk digabung manual)
  function exportCustomOnly() {
    const data = JSON.stringify(items, null, 2);
    setJsonText(data);
    navigator.clipboard?.writeText(data).catch(() => {});
    alert("Produk kustom diekspor ke textarea & dicopy ke clipboard.");
  }

  // Build gabungan (defaults + kustom override) → download products.json
  function buildAndDownloadMerged() {
    const data = JSON.stringify(merged, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    alert(
      "File products.json siap. Commit ke public/products.json di GitHub untuk publish."
    );
  }

  function importJsonToCustom() {
    try {
      const arr = JSON.parse(jsonText || "[]");
      if (!Array.isArray(arr)) throw new Error("JSON harus array");
      saveCustomProducts(arr);
      setItems(arr);
      alert("Import berhasil ke localStorage (kustom).");
    } catch (e) {
      alert("JSON tidak valid: " + e.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <a href="/" className="font-semibold">
            ← Kembali ke Halaman Utama
          </a>
          <div className="text-sm text-slate-500">
            Admin Produk (generator JSON)
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-2">
        {/* Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            {isEditing ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">ID (slug)*</span>
                <input
                  value={editing.id}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      id: e.target.value
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="mis. canva, netflix, youtube"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
                <small className="text-slate-500">
                  Hanya huruf kecil, angka, tanda -
                </small>
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Nama*</span>
                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-slate-600">Gambar (URL)*</span>
              <input
                value={editing.img}
                onChange={(e) =>
                  setEditing({ ...editing, img: e.target.value })
                }
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Deskripsi*</span>
              <textarea
                value={editing.desc}
                onChange={(e) =>
                  setEditing({ ...editing, desc: e.target.value })
                }
                rows={3}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>

            {/* TAGS */}
            <div>
              <div className="text-sm text-slate-600">Tag</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() =>
                      setEditing((p) => ({
                        ...p,
                        tags: p.tags?.includes(t)
                          ? p.tags.filter((x) => x !== t)
                          : [...(p.tags || []), t],
                      }))
                    }
                    className={`rounded-full px-3 py-1 text-sm ${
                      editing.tags?.includes(t)
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="Tambah tag baru lalu Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const v = e.currentTarget.value.trim();
                      if (v) {
                        setEditing((p) => ({
                          ...p,
                          tags: [...(p.tags || []), v],
                        }));
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm"
                />
              </div>
            </div>

            {/* FEATURES & SNK */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">
                  Fitur (satu per baris)
                </span>
                <textarea
                  rows={4}
                  value={(editing.features || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      features: e.target.value
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">
                  S&K (satu per baris)
                </span>
                <textarea
                  rows={4}
                  value={(editing.snk || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      snk: e.target.value
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
            </div>

            {/* VARIANTS */}
            <div>
              <div className="mb-2 text-sm font-semibold">Varian</div>
              <div className="grid gap-3">
                {(editing.variants || []).map((v, idx) => (
                  <div
                    key={idx}
                    className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-4"
                  >
                    <input
                      value={v.id}
                      onChange={(e) => {
                        const nv = [...editing.variants];
                        nv[idx] = { ...v, id: e.target.value };
                        setEditing({ ...editing, variants: nv });
                      }}
                      placeholder="id (30d, 60d)"
                      className="rounded-xl border border-slate-200 px-3 py-2"
                    />
                    <input
                      value={v.label}
                      onChange={(e) => {
                        const nv = [...editing.variants];
                        nv[idx] = { ...v, label: e.target.value };
                        setEditing({ ...editing, variants: nv });
                      }}
                      placeholder="label (30 hari)"
                      className="rounded-xl border border-slate-200 px-3 py-2"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => {
                        const nv = [...editing.variants];
                        nv[idx] = { ...v, price: Number(e.target.value || 0) };
                        setEditing({ ...editing, variants: nv });
                      }}
                      placeholder="harga (IDR)"
                      className="rounded-xl border border-slate-200 px-3 py-2"
                    />
                    <input
                      value={v.code}
                      onChange={(e) => {
                        const nv = [...editing.variants];
                        nv[idx] = { ...v, code: e.target.value };
                        setEditing({ ...editing, variants: nv });
                      }}
                      placeholder="kode bot (mis. canva1b)"
                      className="rounded-xl border border-slate-200 px-3 py-2"
                    />
                    <div className="sm:col-span-4">
                      <button
                        type="button"
                        onClick={() => {
                          const nv = editing.variants.filter(
                            (_, i) => i !== idx
                          );
                          setEditing({ ...editing, variants: nv });
                        }}
                        className="mt-2 rounded-xl border border-slate-200 px-3 py-1 text-sm"
                      >
                        Hapus varian
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    ...editing,
                    variants: [
                      ...(editing.variants || []),
                      { id: "", label: "", price: 0, code: "" },
                    ],
                  })
                }
                className="mt-2 rounded-xl border border-slate-200 px-3 py-2"
              >
                + Tambah varian
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white"
              >
                {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-4 py-2"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* List + Import/Export */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            Produk Kustom (browser ini)
          </h2>

          <div className="grid gap-3">
            {items.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
                Belum ada produk kustom. Tambah lewat form di kiri.
              </div>
            )}

            {items.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3"
              >
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-slate-500">/{p.id}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(p.tags || []).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 space-x-2">
                  <button
                    onClick={() => editItem(p)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Hapus produk ini?")) {
                        setItems(deleteProduct(p.id));
                      }
                    }}
                    className="rounded-xl bg-red-500 px-3 py-1.5 text-sm text-white"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Import/Export */}
          <div className="mt-6">
            <div className="mb-2 text-sm font-semibold">
              Import / Export JSON (kustom)
            </div>
            <textarea
              rows={6}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='[ { "id":"...", "name":"...", ... } ]'
              className="w-full rounded-xl border border-slate-200 p-3 font-mono text-xs"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={exportCustomOnly}
                className="rounded-xl border border-slate-200 px-3 py-2"
              >
                Export (kustom)
              </button>
              <button
                onClick={importJsonToCustom}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-white"
              >
                Import → kustom
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Data kustom tersimpan di <b>localStorage</b> browser ini.
            </p>
          </div>

          {/* Build merged products.json */}
          <div className="mt-8 rounded-xl border border-slate-200 p-4">
            <div className="mb-2 text-sm font-semibold">
              Build & Download products.json (publik)
            </div>
            <p className="text-xs text-slate-600">
              File ini adalah gabungan <b>public/products.json</b> saat ini +
              kustom kamu (id yang sama akan di-override oleh kustom). Download
              lalu commit ke
              <code> public/products.json</code> di GitHub untuk mem-publish.
            </p>
            <button
              onClick={buildAndDownloadMerged}
              className="mt-3 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Download products.json (merged)
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

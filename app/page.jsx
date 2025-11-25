"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { basePrice, currencyIDR, loadProductsJSON } from "@/lib/products";
import { WHATSAPP_NUMBER, WHATSAPP_OWNER } from "@/lib/config";

/* Heading section — center dengan underline */
function SectionTitle({ id, title, eyebrow }) {
  return (
    <div id={id} className="mb-8 text-center">
      {eyebrow && (
        <>
          <div className="mx-auto text-xs font-semibold uppercase tracking-widest text-amber-600">
            {eyebrow}
          </div>
        </>
      )}
      <h2 className="relative mx-auto inline-block text-2xl font-extrabold sm:text-3xl">
        {title}
        <span className="absolute -bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></span>
      </h2>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  useEffect(() => {
    loadProductsJSON().then(setProducts);
  }, []);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [chip, setChip] = useState("all");

  // buat chips dari tag di JSON
  const CHIPS = useMemo(() => {
    const tags = Array.from(
      new Set(products.flatMap((p) => p.tags || []))
    ).sort();
    return ["all", ...tags];
  }, [products]);

  // filter/sort
  const list = useMemo(() => {
    let l = products.slice();
    if (chip !== "all") l = l.filter((p) => (p.tags || []).includes(chip));
    const qq = q.toLowerCase();
    if (qq)
      l = l.filter((p) =>
        [p.name, p.desc, ...(p.tags || [])].join(" ").toLowerCase().includes(qq)
      );
    if (sort === "name_asc") l.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name_desc") l.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "price_asc") l.sort((a, b) => basePrice(a) - basePrice(b));
    if (sort === "price_desc") l.sort((a, b) => basePrice(b) - basePrice(a));
    return l;
  }, [products, q, sort, chip]);

  // warna chip
  function chipClass(tag, active) {
    const map = {
      "Paling Laris": [
        "bg-amber-100 text-amber-800 hover:bg-amber-200",
        "bg-amber-500 text-white",
      ],
      Designer: [
        "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        "bg-indigo-500 text-white",
      ],
      Music: [
        "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        "bg-emerald-500 text-white",
      ],
    };
    if (tag === "all")
      return active
        ? "bg-slate-800 text-white"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200";
    const c = map[tag];
    return active
      ? c
        ? c[1]
        : "bg-slate-800 text-white"
      : c
      ? c[0]
      : "bg-slate-100 text-slate-700 hover:bg-slate-200";
  }

  const [openFaq, setOpenFaq] = useState(-1);
  const faqs = [
    {
      q: "Apakah ada garansi?",
      a: "Ya, garansi sesuai yang tertera pada deskripsi & SNK produk. Jika ada kendala, silakan hubungi admin via WhatsApp. Proses perbaikan akan kami bantu dalam waktu maksimal 1x24 jam (tidak instan saat klaim).",
      icon: "🛡️",
    },
    {
      q: "Jika stok kosong bagaimana?",
      a: "Tenang, stok selalu tersedia. Jika belum muncul di bot, berarti belum direstok. Silakan tunggu atau hubungi admin/owner untuk update stok.",
      icon: "📦",
    },
    {
      q: "Berapa lama prosesnya?",
      a: "Jika stok tersedia di bot, proses umumnya < 1 menit setelah pembayaran terverifikasi.",
      icon: "⚡",
    },
    {
      q: "Metode pembayaran apa saja?",
      a: "Saat ini hanya mendukung pembayaran QRIS (Full Payment). QR Code akan tampil otomatis saat klik 'Beli' dan diarahkan ke WhatsApp.",
      icon: "💳",
    },
    {
      q: "Apakah akun bisa digunakan di semua perangkat?",
      a: "Ya, akun bisa digunakan di berbagai perangkat sesuai ketentuan layanan (HP, Laptop, Tablet, Smart TV, dll).",
      icon: "📲",
    },
    {
      q: "Bagaimana jika akun tiba-tiba tidak bisa dipakai?",
      a: "Silakan segera hubungi admin via WhatsApp dengan bukti transaksi. Admin akan bantu cek atau mengganti sesuai garansi produk.",
      icon: "❓",
    },
    {
      q: "Apakah bisa beli manual lewat admin?",
      a: "Bisa, pembelian manual tersedia melalui chat langsung dengan admin/owner jika tidak ingin lewat bot.",
      icon: "👨‍💻",
    },
    {
      q: "Apakah bisa beli untuk banyak akun sekaligus?",
      a: "Bisa, pembelian dalam jumlah banyak (reseller) dipersilakan. Silakan hubungi admin untuk info lebih lanjut.",
      icon: "📦",
    },
  ];
  const openDetail = (id, anchor = "beli") =>
    router.push(`/produk/${id}#${anchor}`);

  return (
    <>
      <div id="top" />
      <Navbar />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 hidden h-80 w-80 rounded-full bg-amber-100 blur-3xl md:block"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 hidden h-80 w-80 rounded-full bg-yellow-100 blur-3xl md:block"></div>

        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              Langganan & Akun Digital Cepat, Aman, Terpercaya.
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Pilih paket, lihat detail, setujui SNK, lalu checkout via WhatsApp
              bot.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="#produk"
                className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 font-medium text-white shadow hover:from-amber-500 hover:to-amber-600"
              >
                Lihat Produk
              </a>
              <a
                href="#faq"
                className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700 shadow hover:bg-white"
              >
                FAQ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUK */}
      <section id="produk" className="bg-white py-10">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Katalog" title="Produk Tersedia" />

          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            {/* Chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setChip(c)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium shadow-soft ${chipClass(
                    c,
                    chip === c
                  )}`}
                >
                  {c === "all" ? "Semua" : c}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:w-[520px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="Cari: Netflix, YouTube, Canva…"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-soft focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                <option value="name_asc">Nama A–Z</option>
                <option value="name_desc">Nama Z–A</option>
                <option value="price_asc">Termurah</option>
                <option value="price_desc">Termahal</option>
              </select>
            </div>
          </div>

          {/* Grid: mobile 2, laptop 4; tombol beli sejajar */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {list.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                Tidak ada hasil. Coba kata lain.
              </div>
            )}

            {list.map((p) => (
              <article
                key={p.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative h-32 w-full sm:h-40 md:h-44">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow-soft">
                    Mulai {currencyIDR.format(basePrice(p))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="text-sm font-semibold leading-snug sm:text-base">
                    {p.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm min-h-[34px] sm:min-h-[40px]">
                    {p.desc}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2 min-h-[26px] sm:min-h-[30px]">
                    {(p.tags || []).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 sm:text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-3">
                    <button
                      onClick={() => openDetail(p.id)}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-soft hover:from-amber-500 hover:to-amber-600"
                      aria-label={`Beli ${p.name}`}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CARA BELI */}
      <section id="cara" className="py-12">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Panduan" title="Cara Beli" />
          <div className="relative mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["🔎", "Pilih Produk", "Buka detail produk yang kamu mau."],
              [
                "🧩",
                "Pilih Varian",
                "Tentukan paket & jumlah sesuai kebutuhan.",
              ],
              ["✅", "Setujui SNK", "Centang Syarat & Ketentuan yang berlaku."],
              ["💬", "Checkout WA", "Klik Beli — WhatsApp terbuka otomatis."],
            ].map(([icon, title, desc], i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-soft"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
                  {icon}
                </div>
                <div className="font-semibold">
                  {i + 1}. {title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{desc}</div>
                {i < 3 && (
                  <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[2px] w-6 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-slate-200 to-transparent lg:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="Bantuan" title="FAQ" />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-soft transition ${
                    open ? "border-amber-300" : "border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                          open
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="font-medium">{item.q}</div>
                    </div>
                    <span
                      className={`text-xl transition ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      ＋
                    </span>
                  </button>
                  <div
                    className={`px-4 pb-4 text-slate-600 transition-all duration-300 ${
                      open
                        ? "max-h-96 opacity-100"
                        : "max-h-0 overflow-hidden opacity-0"
                    }`}
                  >
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section id="kontak" className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <SectionTitle eyebrow="Hubungi" title="Kontak Kami" />
          <div className="mx-auto mt-6 grid max-w-4xl gap-6 sm:grid-cols-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-lg"
            >
              <div className="text-2xl">📱</div>
              <div className="mt-2 font-semibold">WhatsApp Admin</div>
              <div className="text-sm text-slate-600">+{WHATSAPP_NUMBER}</div>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_OWNER}`}
              target="_blank"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-lg"
            >
              <div className="text-2xl">📱</div>
              <div className="mt-2 font-semibold">WhatsApp Owner</div>
              <div className="text-sm text-slate-600">+{WHATSAPP_OWNER}</div>
            </a>
            <a
              href="https://instagram.com/tavevestore"
              target="_blank"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-lg"
            >
              <div className="text-2xl">📷</div>
              <div className="mt-2 font-semibold">Instagram</div>
              <div className="text-sm text-slate-600">@tavevestore</div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 text-slate-200">
        <div className="container mx-auto px-4 text-center">
          <nav className="mb-4 flex flex-wrap justify-center gap-6 text-sm">
            <a href="#produk" className="hover:underline">
              Produk
            </a>
            <a href="#cara" className="hover:underline">
              Cara Beli
            </a>
            <a href="#faq" className="hover:underline">
              FAQ
            </a>
            <a href="#kontak" className="hover:underline">
              Kontak
            </a>
          </nav>
          <a
            href="#top"
            className="inline-block rounded-xl border border-slate-600 px-5 py-2.5 font-semibold text-slate-200 hover:bg-slate-800"
          >
            ↑ Back to top
          </a>
          <p className="mt-6 text-xs sm:text-sm">
            © 2025 TAVEVE STORE. Semua hak cipta dilindungi.
            <br />
            Made with <span className="font-semibold">TAVEVE STORE</span>
          </p>
        </div>
      </footer>
    </>
  );
}

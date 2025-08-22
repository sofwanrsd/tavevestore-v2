"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="inline-flex items-center gap-2">
          <span className="h-7 w-7 rounded-xl bg-brand"></span>
          <span className="font-semibold">TAVEVE STORE</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
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

        <div className="flex items-center gap-2">
          {/* tombol belanja berwarna (gradient brand) */}
          <a
            href="#produk"
            className="hidden sm:inline-block rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-sm font-medium text-white shadow hover:from-amber-500 hover:to-amber-600"
          >
            Belanja
          </a>
          <button
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden rounded-xl border border-slate-200 p-2"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="container mx-auto px-4 md:hidden">
          <nav className="mb-3 mt-2 grid gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow text-sm">
            {[
              ["#produk", "Produk"],
              ["#cara", "Cara Beli"],
              ["#faq", "FAQ"],
              ["#kontak", "Kontak"],
            ].map(([href, label]) => (
              <a
                key={href}
                onClick={() => setOpen(false)}
                href={href}
                className="rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                {label}
              </a>
            ))}
            <a
              onClick={() => setOpen(false)}
              href="#produk"
              className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-2 font-medium text-white hover:from-amber-500 hover:to-amber-600"
            >
              Belanja
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

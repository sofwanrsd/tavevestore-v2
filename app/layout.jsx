import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "TAVEVE STORE — Produk Digital",
  description:
    "Jual akun & langganan digital. Checkout otomatis via WhatsApp bot.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Tailwind CDN (config dulu, lalu script) */}
        <Script id="tw-config" strategy="beforeInteractive">{`
          tailwind.config = {
            theme: {
              container: { center: true, padding: "1rem" },
              extend: {
                colors: { brand: { DEFAULT: "#f59e0b", dark: "#d97706" } },
                boxShadow: { soft: "0 10px 30px rgba(2,6,23,.06)" }
              }
            }
          }
        `}</Script>
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />

        <style>{`body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}`}</style>
      </head>
      <body className="bg-slate-50 text-slate-800 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

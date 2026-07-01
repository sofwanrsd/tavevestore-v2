import "./globals.css";

export const metadata = {
  title: "TAVEVE STORE — Produk Digital",
  description:
    "Jual akun & langganan digital. Checkout otomatis via WhatsApp bot.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
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
        <style>{`body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}`}</style>
      </head>
      <body className="bg-slate-50 text-slate-800 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

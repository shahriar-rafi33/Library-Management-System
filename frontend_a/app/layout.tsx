import type { Metadata } from "next";
import "./globals.css";
import Header from "@/Content/Header";
import Footer from "@/Content/Footer";

export const metadata: Metadata = {
  title: "Library Management System",
  description: "Simple Library Management System project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

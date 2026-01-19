import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-10 py-6 text-center text-sm opacity-80">
      © {year} Library Management System. All rights reserved.
    </footer>
  );
}

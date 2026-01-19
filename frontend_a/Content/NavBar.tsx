"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/Home", label: "Home" },
  { href: "/Dashboard", label: "Dashboard" },
  { href: "/Books", label: "Books" },
  { href: "/AddBook", label: "Add Book" },
  { href: "/IssueBook", label: "Issue Book" },
  { href: "/ReturnBook", label: "Return Book" },
  { href: "/Arival", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function hasToken() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
}

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // initial check
    setIsLoggedIn(hasToken());

    // same-tab updates (login/logout)
    const onAuthChanged = () => setIsLoggedIn(hasToken());

    // cross-tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken") setIsLoggedIn(hasToken());
    };

    window.addEventListener("authChanged", onAuthChanged as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");

    // ✅ update navbar immediately
    window.dispatchEvent(new Event("authChanged"));

    router.push("/LogIn");
  }

  return (
    <nav className="flex flex-wrap gap-4 text-sm items-center">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-3 py-1 rounded ${
            pathname === l.href
              ? "bg-white text-red-700"
              : "text-white hover:bg-red-600"
          }`}
        >
          {l.label}
        </Link>
      ))}

      {/* ✅ Login / Logout toggle */}
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded bg-black text-white hover:opacity-90"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/LogIn"
          className="px-3 py-1 rounded bg-black text-white hover:opacity-90"
        >
          Login
        </Link>
      )}
    </nav>
  );
}

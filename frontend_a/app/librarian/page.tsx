"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Title from "@/Content/Title";

export default function LibrarianDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "librarian") router.push("/LogIn");
  }, [router]);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    router.push("/LogIn");
  }

  return (
    <div>
      <Title title="Librarian Dashboard" />
      <h1 className="text-2xl font-bold mb-2">Librarian Dashboard</h1>
      <p className="mb-4">Welcome Librarian ✅</p>
      <button className="px-4 py-2 bg-black text-white rounded" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

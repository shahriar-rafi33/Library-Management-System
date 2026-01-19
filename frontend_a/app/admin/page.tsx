"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Title from "@/Content/Title";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") router.push("/LogIn");
  }, [router]);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    router.push("/LogIn");
  }

  return (
    <div>
      <Title title="Admin Dashboard" />
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="mb-4">Welcome Admin ✅</p>

      <div className="flex gap-3 flex-wrap mb-6">
        <Link className="px-4 py-2 border rounded" href="/Admins">View Admins (CSR)</Link>
        <Link className="px-4 py-2 border rounded" href="/Librarians">View Librarians (CSR)</Link>
      </div>

      <button className="px-4 py-2 bg-black text-white rounded" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

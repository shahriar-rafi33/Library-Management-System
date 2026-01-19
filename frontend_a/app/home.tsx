"use client";

import Link from "next/link";
import Title from "@/Content/Title";

export default function Home() {
  return (
    <>
      <Title title="Home" />
      <h1 className="text-2xl font-bold mb-2">Welcome 👋</h1>
      <p className="mb-4">
        This is a simple Library Management System using Next.js + NestJS.
      </p>

      <div className="flex gap-3">
        <Link className="px-4 py-2 bg-red-700 text-white rounded" href="/LogIn">
          Login
        </Link>
        <Link className="px-4 py-2 border rounded" href="/Registration">
          Register
        </Link>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/Content/Title";
import { api,getAxiosErrorMessage } from "@/lib/api";


type Admin = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  role: string;
  status: string;
};

export default function AdminsPage() {
  const router = useRouter();
  const [jsonData, setJsonData] = useState<Admin[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/LogIn");
      return;
    }

    async function fetchData() {
      try {
        const response = await api.get("/admin");
        const data = response.data; // ✅ slide style
        setJsonData(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(getAxiosErrorMessage(e));
      }
    }

    fetchData();
  }, [router]);

  return (
    <div>
      <Title title="Admins" />
      <h1 className="text-2xl font-bold mb-4">All Admins (CSR)</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {jsonData && (
        <div className="space-y-3">
          {jsonData.map((a) => (
            <div key={a.id} className="border rounded p-3">
              <p><b>ID:</b> {a.id}</p>
              <p><b>Name:</b> {a.fullName}</p>
              <p><b>Email:</b> {a.email}</p>
              <p><b>Status:</b> {a.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

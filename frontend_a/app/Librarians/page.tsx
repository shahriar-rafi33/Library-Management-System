"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/Content/Title";
import {api, getAxiosErrorMessage } from "@/lib/api";


type Librarian = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  isActive: boolean;
};

export default function LibrariansPage() {
  const router = useRouter();
  const [jsonData, setJsonData] = useState<Librarian[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/LogIn");
      return;
    }

    async function fetchData() {
      try {
        const response = await api.get("/librarian");
        const data = response.data;
        setJsonData(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(getAxiosErrorMessage(e));
      }
    }

    fetchData();
  }, [router]);

  return (
    <div>
      <Title title="Librarians" />
      <h1 className="text-2xl font-bold mb-4">All Librarians (CSR)</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {jsonData && (
        <div className="space-y-3">
          {jsonData.map((l) => (
            <div key={l.id} className="border rounded p-3">
              <p><b>ID:</b> {l.id}</p>
              <p><b>Name:</b> {l.firstName} {l.lastName}</p>
              <p><b>Email:</b> {l.email}</p>
              <p><b>Active:</b> {String(l.isActive)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

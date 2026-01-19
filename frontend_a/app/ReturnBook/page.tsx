"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/Content/Title";
import { api,getAxiosErrorMessage } from "@/lib/api";


type Issue = {
  id: number;
  status: "issued" | "returned";
  borrowerName: string;
  borrowerEmail?: string;
  issuedAt: string;
  returnedAt?: string;
  book: { id: number; title: string };
};

export default function ReturnBookPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) router.push("/LogIn");

    fetchIssues();
    async function fetchIssues() {
      try {
        const response = await api.get("/issues");
        const jsonData = response.data;
        setIssues(Array.isArray(jsonData) ? jsonData : []);
      } catch (e) {
        setMsg(getAxiosErrorMessage(e));
      }
    }
  }, [router]);

  async function handleReturn(id: number) {
    setMsg("");
    try {
      const response = await api.post(`/issues/${id}/return`);
      console.log("RETURNED:", response.data);

      // refresh list
      const refreshed = await api.get("/issues");
      setIssues(Array.isArray(refreshed.data) ? refreshed.data : []);

      setMsg("Book returned successfully ✅");
    } catch (e) {
      setMsg(getAxiosErrorMessage(e));
    }
  }

  return (
    <div>
      <Title title="Return Book" />
      <h1 className="text-2xl font-bold mb-4">Return a Book</h1>

      {msg && <p className="mb-3">{msg}</p>}

      <div className="space-y-3">
        {issues.map((i) => (
          <div key={i.id} className="border rounded p-3">
            <p><b>Issue ID:</b> {i.id}</p>
            <p><b>Book:</b> {i.book?.title}</p>
            <p><b>Borrower:</b> {i.borrowerName}</p>
            <p><b>Status:</b> {i.status}</p>

            {i.status === "issued" && (
              <button
                className="mt-2 px-4 py-2 bg-black text-white rounded"
                onClick={() => handleReturn(i.id)}
              >
                Return
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/Content/Title";
import { z } from "zod";
import { api, getAxiosErrorMessage } from "@/lib/api";

type Book = { id: number; title: string; availableCopies: number };

const schema = z.object({
  bookId: z.coerce.number().int().min(1),
  borrowerName: z.string().min(2, "Borrower name is required"),
  borrowerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
});

export default function IssueBookPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<any>({
    bookId: "",
    borrowerName: "",
    borrowerEmail: "",
  });
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) router.push("/LogIn");

    async function loadBooks() {
      try {
        const response = await api.get("/books");
        const jsonData = response.data;
        setBooks(Array.isArray(jsonData) ? jsonData : []);
      } catch (e) {
        setMsg(getAxiosErrorMessage(e));
      }
    }

    loadBooks();
  }, [router]);

  function handleChange(e: any) {
    setForm((p: any) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setErrors({});
    setMsg("");

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const err: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (err[String(i.path[0])] = i.message));
      setErrors(err);
      return;
    }

    const payload = {
      ...parsed.data,
      borrowerEmail: parsed.data.borrowerEmail ? parsed.data.borrowerEmail : undefined,
    };

    try {
      const response = await api.post("/issues", payload);
      console.log("ISSUED:", response.data);
      setMsg("Book issued successfully ✅");
      router.push("/ReturnBook");
    } catch (e) {
      setMsg(getAxiosErrorMessage(e));
    }
  }

  return (
    <div className="max-w-md">
      <Title title="Issue Book" />
      <h1 className="text-2xl font-bold mb-4">Issue a Book</h1>

      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">Select Book</label>
        <select
          className="border rounded px-3 py-2 w-full mb-2"
          name="bookId"
          value={form.bookId}
          onChange={handleChange}
        >
          <option value="">-- choose --</option>
          {books.map((b) => (
            <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
              {b.title} (available: {b.availableCopies})
            </option>
          ))}
        </select>
        {errors.bookId && <p className="text-red-600 text-sm mb-2">{errors.bookId}</p>}

        <label className="block font-medium mb-1">Borrower Name</label>
        <input className="border rounded px-3 py-2 w-full mb-2" name="borrowerName" value={form.borrowerName} onChange={handleChange} />
        {errors.borrowerName && <p className="text-red-600 text-sm mb-2">{errors.borrowerName}</p>}

        <label className="block font-medium mb-1">Borrower Email (optional)</label>
        <input className="border rounded px-3 py-2 w-full mb-2" name="borrowerEmail" value={form.borrowerEmail} onChange={handleChange} />
        {errors.borrowerEmail && <p className="text-red-600 text-sm mb-2">{errors.borrowerEmail}</p>}

        {msg && <p className="text-sm mt-2">{msg}</p>}

        <button className="px-4 py-2 bg-red-700 text-white rounded mt-3" type="submit">
          Issue Book
        </button>
      </form>
    </div>
  );
}

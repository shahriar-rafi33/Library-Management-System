"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/Content/Title";
import Input from "@/Content/Input";
import { z } from "zod";
import { api,getAxiosErrorMessage } from "@/lib/api";


const schema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().optional(),
  isbn: z.string().optional(),
  totalCopies: z.coerce.number().int().min(1, "Must be at least 1"),
});

export default function AddBookPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    title: "",
    author: "",
    category: "",
    isbn: "",
    totalCopies: "1",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) router.push("/LogIn");
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

    try {
      const response = await api.post("/books", parsed.data);
      console.log("BOOK CREATED:", response.data);
      setMsg("Book added successfully ✅");
      router.push("/Books");
    } catch (error) {
      setMsg(getAxiosErrorMessage(error));
    }
  }

  return (
    <div className="max-w-md">
      <Title title="Add Book" />
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>

      <form onSubmit={handleSubmit}>
        <Input label="Title" name="title" value={form.title} onChange={handleChange} error={errors.title} />
        <Input label="Author" name="author" value={form.author} onChange={handleChange} error={errors.author} />
        <Input label="Category (optional)" name="category" value={form.category} onChange={handleChange} error={errors.category} />
        <Input label="ISBN (optional)" name="isbn" value={form.isbn} onChange={handleChange} error={errors.isbn} />
        <Input label="Total Copies" name="totalCopies" value={String(form.totalCopies)} onChange={handleChange} error={errors.totalCopies} />

        {msg && <p className="text-sm mt-2">{msg}</p>}

        <button className="px-4 py-2 bg-red-700 text-white rounded mt-3" type="submit">
          Add Book
        </button>
      </form>
    </div>
  );
}

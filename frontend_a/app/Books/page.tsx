import axios from "axios";
import Link from "next/link";
import Title from "@/Content/Title";

type Book = {
  id: number;
  title: string;
  author: string;
  availableCopies: number;
};

export const dynamic = "force-dynamic"; // always fetch latest

export default async function BooksPage() {
  const API = process.env.NEXT_PUBLIC_API_ENDPOINT;

  if (!API) {
    return <p>Missing NEXT_PUBLIC_API_ENDPOINT in .env.local</p>;
  }

  let books: Book[] = [];
  try {
    const response = await axios.get(`${API}/books`);
    const jsonData = response.data;
    books = Array.isArray(jsonData) ? jsonData : [];
  } catch {
    return <p>Failed to load books from backend.</p>;
  }

  return (
    <>
      <Title title="Books" />
      <h1 className="text-2xl font-bold mb-4">Books (SSR)</h1>

      <div className="space-y-3">
        {books.map((b) => (
          <div key={b.id} className="border rounded p-3">
            <p className="font-semibold">{b.title}</p>
            <p className="text-sm opacity-80">Author: {b.author}</p>
            <p className="text-sm">Available: {b.availableCopies}</p>
            <Link className="underline text-sm" href={`/Book/${b.id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

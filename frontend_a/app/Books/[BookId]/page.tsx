import axios from "axios";
import Title from "@/Content/Title";
import { notFound } from "next/navigation";

type Book = {
  id: number;
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  totalCopies: number;
  availableCopies: number;
};

export const dynamic = "force-dynamic";

export default async function BookDetails({ params }: { params: { BookId: string } }) {
  const API = process.env.NEXT_PUBLIC_API_ENDPOINT;
  if (!API) return <p>Missing NEXT_PUBLIC_API_ENDPOINT</p>;

  try {
    const response = await axios.get(`${API}/books/${params.BookId}`);
    const book: Book = response.data;

    return (
      <div>
        <Title title={`Book ${book.id}`} />
        <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
        <p className="mb-1"><b>Author:</b> {book.author}</p>
        <p className="mb-1"><b>Category:</b> {book.category ?? "N/A"}</p>
        <p className="mb-1"><b>ISBN:</b> {book.isbn ?? "N/A"}</p>
        <p className="mb-1"><b>Total Copies:</b> {book.totalCopies}</p>
        <p className="mb-1"><b>Available Copies:</b> {book.availableCopies}</p>
      </div>
    );
  } catch (e: any) {
    // if backend says 404, show not-found.tsx
    notFound();
  }
}

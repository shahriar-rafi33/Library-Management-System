import axios from "axios";
import Title from "@/Content/Title";

export default async function ArivalPage() {
  const API = process.env.NEXT_PUBLIC_API_ENDPOINT;

  if (!API) {
    return <p>Missing NEXT_PUBLIC_API_ENDPOINT</p>;
  }

  const response = await axios.get(`${API}/books?limit=5`);
  const books = Array.isArray(response.data) ? response.data : [];

  return (
    <>
      <Title title="New Arrivals" />
      <h1>New Arrival Books</h1>

      <ul>
        {books.map((book: any) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </>
  );
}

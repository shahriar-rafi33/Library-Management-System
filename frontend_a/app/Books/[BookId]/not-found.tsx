import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Book Not Found</h2>
      <p className="mb-3">This book does not exist.</p>
      <Link className="underline" href="/Books">Back to Books</Link>
    </div>
  );
}

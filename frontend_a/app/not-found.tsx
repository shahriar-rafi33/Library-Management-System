import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
      <p className="mb-3">The page you are looking for does not exist.</p>
      <Link className="underline" href="/Home">Go to Home</Link>
    </div>
  );
}

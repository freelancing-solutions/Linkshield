
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
      <p>The report you are looking for does not exist.</p>
      <Link href="/" className="mt-4 text-blue-500">
        Go back to the homepage
      </Link>
    </div>
  );
}

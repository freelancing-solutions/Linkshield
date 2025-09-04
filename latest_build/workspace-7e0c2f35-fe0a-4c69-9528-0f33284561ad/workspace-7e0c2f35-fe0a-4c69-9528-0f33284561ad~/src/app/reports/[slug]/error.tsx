
'use client';

import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Try Again
      </button>
      <Link href="/" className="mt-4 ml-4 text-blue-500">
        Go Home
      </Link>
    </div>
  );
}

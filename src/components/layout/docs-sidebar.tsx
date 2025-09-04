import React from 'react'
import Link from 'next/link'

export default function DocsSidebar() {
  return (
    <nav className="space-y-2 p-4 bg-card rounded-lg">
      <h3 className="text-sm font-semibold">Documentation</h3>
      <ul className="mt-2 space-y-1 text-sm">
        <li>
          <Link href="/docs" className="block py-1 px-2 rounded hover:bg-muted">Overview</Link>
        </li>
        <li>
          <Link href="/docs/getting-started" className="block py-1 px-2 rounded hover:bg-muted">Getting Started</Link>
        </li>
        <li>
          <Link href="/docs/integration" className="block py-1 px-2 rounded hover:bg-muted">Integration</Link>
        </li>
      </ul>
    </nav>
  )
}

import React from 'react'
import DocsSidebar from '@/components/layout/docs-sidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <DocsSidebar />
        </aside>
        <main className="md:col-span-3 bg-card p-6 rounded-lg">{children}</main>
      </div>
    </div>
  )
}

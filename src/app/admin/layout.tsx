import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Home, Users, FileText, BarChart } from 'lucide-react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/dashboard') // Redirect non-admins to their dashboard
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin/dashboard" className="flex items-center p-2 rounded hover:bg-gray-700">
            <BarChart className="mr-2 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center p-2 rounded hover:bg-gray-700">
            <Users className="mr-2 h-5 w-5" />
            Users
          </Link>
          <Link href="/admin/reports" className="flex items-center p-2 rounded hover:bg-gray-700">
            <FileText className="mr-2 h-5 w-5" />
            Reports
          </Link>
          <hr className="my-4 border-gray-600" />
          <Link href="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-700">
            <Home className="mr-2 h-5 w-5" />
            Back to App
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  )
}

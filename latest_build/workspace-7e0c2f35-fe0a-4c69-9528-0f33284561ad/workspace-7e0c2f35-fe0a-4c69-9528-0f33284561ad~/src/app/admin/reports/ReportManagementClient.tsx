'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface Report {
  id: string;
  url: string;
  isPublic: boolean;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  } | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function ReportManagementClient() {
  const [reports, setReports] = useState<Report[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10', search })
      const res = await fetch(`/api/admin/reports?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch reports')
      const data = await res.json()
      setReports(data.data)
      setPagination(data.pagination)
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch reports.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [page, search])

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete report');
      toast({ title: "Success", description: "Report deleted successfully." });
      fetchReports(); // Refetch reports after deletion
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete report.", variant: "destructive" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Input
        placeholder="Search by URL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="max-w-xs truncate">{report.url}</TableCell>
                <TableCell>{report.user?.email || 'Anonymous'}</TableCell>
                <TableCell>{report.isPublic ? 'Public' : 'Private'}</TableCell>
                <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(report.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Add pagination controls here */}
    </div>
  )
}

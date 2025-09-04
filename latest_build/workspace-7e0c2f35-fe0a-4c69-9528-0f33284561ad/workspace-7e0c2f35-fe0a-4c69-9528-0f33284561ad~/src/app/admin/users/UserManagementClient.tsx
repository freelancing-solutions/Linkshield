'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Define the User type based on our knowledge of the schema
interface User {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  role: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function UserManagementClient() {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page), limit: '10', search })
        const res = await fetch(`/api/admin/users?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        setUsers(data.data)
        setPagination(data.pagination)
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch users.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [page, search])

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      toast({ title: "Success", description: "User role updated." });
      // Refetch users to show updated data
      const fetchUsers = async () => {
        const params = new URLSearchParams({ page: String(page), limit: '10', search })
        const res = await fetch(`/api/admin/users?${params.toString()}`)
        const data = await res.json()
        setUsers(data.data)
        setPagination(data.pagination)
      }
      fetchUsers()
    } catch (error) {
      toast({ title: "Error", description: "Failed to update role.", variant: "destructive" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.plan}</TableCell>
                <TableCell>
                  <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">USER</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {/* Add other actions like delete if needed */}
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

'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/dashboard';
import { ProjectsTable } from '@/components/dashboard/ProjectsTable';
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/utils/use-debounce';

/**
 * Projects List Page
 * 
 * Displays a list of user projects with search, filters, and pagination.
 * Allows creating new projects and navigating to project details.
 */
export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Debounce search query to avoid excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch projects with filters
  const { data, isLoading, error } = useProjects({
    page,
    per_page: 10,
    search: debouncedSearch || undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your monitored projects and websites
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Projects Table */}
      <ProjectsTable
        data={data}
        isLoading={isLoading}
        error={error}
        page={page}
        onPageChange={setPage}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

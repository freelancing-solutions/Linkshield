'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  Link, 
  FileText, 
  Upload, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Info
} from 'lucide-react'
import { Label } from '@/components/ui/label'

const addUrlsSchema = z.object({
  urls: z.string().min(1, 'At least one URL is required'),
  method: z.enum(['manual', 'sitemap', 'upload']).default('manual')
})

type AddUrlsForm = z.infer<typeof addUrlsSchema>

interface AddUrlsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: {
    id: string
    name: string
    domain: string
    isVerified: boolean
  }
  onUrlsAdded: (result: any) => void
}

export function AddUrlsModal({ open, onOpenChange, project, onUrlsAdded }: AddUrlsModalProps) {
  if (!project) return null
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const form = useForm<AddUrlsForm>({
    resolver: zodResolver(addUrlsSchema),
    defaultValues: {
      urls: '',
      method: 'manual'
    }
  })

  const onSubmit = async (data: AddUrlsForm) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let urls: string[] = []
      
      if (data.method === 'manual') {
        // Split by new lines and filter empty lines
        urls = data.urls.split('\n').filter(url => url.trim()).map(url => url.trim())
      } else if (data.method === 'sitemap') {
        urls = [data.urls.trim()] // Sitemap URL
      } else if (data.method === 'upload') {
        // File upload is handled separately
        return
      }

      const response = await fetch(`/api/projects/${project.id}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urls,
          method: data.method
        })
      })

      const responseResult = await response.json()

      if (!response.ok) {
        throw new Error(responseResult.error || 'Failed to add URLs')
      }

      setResult(responseResult.data)
      
      toast({
        title: 'URLs Added',
        description: `Successfully added ${responseResult.data.added} URLs to project.`
      })

      onUrlsAdded(responseResult.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const text = await file.text()
      const urls = text.split('\n').filter(url => url.trim()).map(url => url.trim())

      if (urls.length === 0) {
        throw new Error('No valid URLs found in the file')
      }

      const response = await fetch(`/api/projects/${project.id}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urls,
          method: 'upload'
        })
      })

      const responseResult = await response.json()

      if (!response.ok) {
        throw new Error(responseResult.error || 'Failed to add URLs')
      }

      setResult(responseResult.data)
      
      toast({
        title: 'URLs Added',
        description: `Successfully added ${responseResult.data.added} URLs from file.`
      })

      onUrlsAdded(responseResult.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    form.reset()
    setError(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm()
      onOpenChange(open)
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add URLs to Project
          </DialogTitle>
          <DialogDescription>
            Add URLs to monitor for project "{project.name}" ({project.domain})
          </DialogDescription>
        </DialogHeader>
        
        {!result ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="sitemap" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Sitemap
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="urls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter URLs (one per line)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={`https://${project.domain}/page1\nhttps://${project.domain}/page2\nhttps://${project.domain}/page3`}
                            className="min-h-[120px] font-mono text-sm"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-gray-600">
                          Only URLs from the domain {project.domain} will be accepted.
                        </p>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="sitemap" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="urls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sitemap URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={`https://${project.domain}/sitemap.xml`}
                            className="font-mono text-sm"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-gray-600">
                          The system will fetch and parse the sitemap to extract all URLs.
                        </p>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Upload Text File</Label>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Upload a .txt file with one URL per line.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding URLs...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add URLs
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">URLs Added Successfully</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.added}</div>
                <div className="text-sm text-gray-600">Added</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{result.invalid?.length || 0}</div>
                <div className="text-sm text-gray-600">Invalid</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{result.duplicates?.length || 0}</div>
                <div className="text-sm text-gray-600">Duplicates</div>
              </div>
            </div>

            {result.invalid && result.invalid.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <strong>Invalid URLs (not in domain {project.domain}):</strong>
                    <div className="max-h-20 overflow-y-auto text-sm">
                      {result.invalid.map((url: string, index: number) => (
                        <div key={index} className="font-mono text-xs">{url}</div>
                      ))}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {result.duplicates && result.duplicates.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <strong>Duplicate URLs (already in project):</strong>
                    <div className="max-h-20 overflow-y-auto text-sm">
                      {result.duplicates.map((url: string, index: number) => (
                        <div key={index} className="font-mono text-xs">{url}</div>
                      ))}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
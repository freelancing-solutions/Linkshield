'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  CheckCircle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Shield, 
  Info,
  RefreshCw
} from 'lucide-react'

interface DomainVerificationProps {
  project: {
    id: string
    name: string
    domain: string
    isVerified: boolean
    verificationToken: string
  }
  onVerificationComplete: (project: any) => void
}

export function DomainVerification({ project, onVerificationComplete }: DomainVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const metaTagContent = `<meta name="linkshield-verification" content="${project.verificationToken}" />`

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(metaTagContent)
      toast({
        title: 'Copied to Clipboard',
        description: 'Meta tag has been copied to your clipboard.'
      })
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy meta tag to clipboard.',
        variant: 'destructive'
      })
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setError(null)
    setVerificationStatus('idle')

    try {
      const response = await fetch(`/api/projects/${project.id}/verify`, {
        method: 'POST'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Verification failed')
      }

      if (result.success) {
        setVerificationStatus('success')
        onVerificationComplete(result.project)
        
        toast({
          title: 'Verification Successful',
          description: `Domain ${project.domain} has been verified successfully.`
        })
      } else {
        setVerificationStatus('error')
        setError(result.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed'
      setError(errorMessage)
      setVerificationStatus('error')
      
      toast({
        title: 'Verification Failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (project.isVerified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Domain Verified
          </CardTitle>
          <CardDescription>
            Your domain {project.domain} has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
            <span className="text-sm text-gray-600">
              You can now add URLs to this project.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verify Domain Ownership
        </CardTitle>
        <CardDescription>
          To add URLs to your project, you must first prove you own {project.domain}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Add the following meta tag to the <code className="bg-gray-100 px-1 rounded">&lt;head&gt;</code> section 
            of your domain's homepage, then click "Verify Ownership".
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="meta-tag">Verification Meta Tag</Label>
          <div className="flex gap-2">
            <Input
              id="meta-tag"
              value={metaTagContent}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p className="mb-2">Add this tag to:</p>
          <code className="block bg-gray-100 p-2 rounded text-xs">
            https://{project.domain}/index.html<br />
            or<br />
            https://{project.domain}/
          </code>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            className="flex-1"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Verify Ownership
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://${project.domain}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {verificationStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Domain verified successfully! You can now add URLs to your project.
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'error' && error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500">
          <p><strong>Troubleshooting:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Ensure the meta tag is in the <code className="bg-gray-100 px-1 rounded">&lt;head&gt;</code> section</li>
            <li>Check that the content attribute matches exactly</li>
            <li>Make sure your website is publicly accessible</li>
            <li>Wait a few minutes for DNS changes to propagate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
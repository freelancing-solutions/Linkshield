'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const frameworks = [
  { id: 'plain-js', label: 'Plain HTML', icon: '📄' },
  { id: 'react', label: 'React', icon: '⚛️' },
  { id: 'nextjs', label: 'Next.js', icon: '▲' }
]

export default function BadgeIntegrationDemo() {
  const [url, setUrl] = useState('https://example.com')
  const [framework, setFramework] = useState('plain-js')
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generateCode = () => {
    const encodedUrl = encodeURIComponent(url)
    
    switch (framework) {
      case 'plain-js':
        return `<!-- LinkShield Badge for ${url} -->
<script src="https://linkshield.site/api/v1/badge/script.js?domain=${encodedUrl}" async></script>

<!-- Optional: Add this div where you want the badge to appear -->
<div id="linkshield-badge"></div>`
      
      case 'react':
        return `import { useEffect } from 'react'

function LinkShieldBadge({ domain = "${url}" }) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = \`https://linkshield.site/api/v1/badge/script.js?domain=\${encodeURIComponent(domain)}\`
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [domain])

  return <div id="linkshield-badge" />
}

export default LinkShieldBadge`
      
      case 'nextjs':
        return `// components/LinkShieldBadge.tsx
'use client'

import { useEffect } from 'react'

interface LinkShieldBadgeProps {
  domain?: string
}

export default function LinkShieldBadge({ 
  domain = "${url}" 
}: LinkShieldBadgeProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = \`https://linkshield.site/api/v1/badge/script.js?domain=\${encodeURIComponent(domain)}\`
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [domain])

  return <div id="linkshield-badge" className="my-4" />
}`
      
      default:
        return ''
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateCode())
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Integration code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">LinkShield Badge Integration</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium mb-2">
                Your Website URL
              </label>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        <Tabs value={framework} onValueChange={setFramework} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {frameworks.map((fw) => (
              <TabsTrigger key={fw.id} value={fw.id}>
                <span className="mr-2">{fw.icon}</span>
                {fw.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {frameworks.map((fw) => (
            <TabsContent key={fw.id} value={fw.id} className="mt-4">
              <div className="relative">
                <Textarea
                  value={generateCode()}
                  readOnly
                  className="min-h-[200px] font-mono text-sm bg-muted/50"
                />
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Copy the code above and paste it into your website. The badge will automatically 
            display the security status of your domain.
          </p>
        </div>
      </div>
    </div>
  )
}
import { DocumentationLayout, DocsSection, DocsCallout, DocsCodeBlock, PropsTable } from '@/components/docs/DocumentationLayout';

export default function DocsPage() {
  return (
    <DocumentationLayout>
      <div className="docs-container">
        <header className="docs-header">
          <h1>LinkShield Documentation</h1>
          <p className="docs-description">
            Comprehensive guide to using LinkShield for secure URL management and threat detection.
          </p>
        </header>

        <DocsSection title="Getting Started" id="getting-started">
          <p>
            Welcome to LinkShield! This guide will help you get up and running quickly with our 
            comprehensive URL security platform.
          </p>
          
          <DocsCallout type="info">
            <strong>Prerequisites:</strong> Node.js 18+ and npm or yarn
          </DocsCallout>

          <h3>Installation</h3>
          <DocsCodeBlock language="bash">
            npm install linkshield
            # or
            yarn add linkshield
          </DocsCodeBlock>
        </DocsSection>

        <DocsSection title="Quick Start" id="quick-start">
          <p>Get started with LinkShield in just a few steps:</p>
          
          <ol>
            <li>Sign up for a LinkShield account</li>
            <li>Create your first project</li>
            <li>Start scanning URLs for threats</li>
          </ol>

          <DocsCallout type="success">
            <strong>Tip:</strong> Start with our free tier to explore basic features before upgrading.
          </DocsCallout>
        </DocsSection>

        <DocsSection title="API Reference" id="api-reference">
          <h3>Base URL</h3>
          <DocsCodeBlock language="text">
            https://api.linkshield.com/v1
          </DocsCodeBlock>

          <h3>Authentication</h3>
          <p>All API requests require an API key in the Authorization header:</p>
          <DocsCodeBlock language="bash">
            curl -H "Authorization: Bearer YOUR_API_KEY" \
                 https://api.linkshield.com/v1/scan
          </DocsCodeBlock>
        </DocsSection>
      </div>
    </DocumentationLayout>
  );
}
import React from 'react';
import { cn } from '@/lib/utils';

interface DocumentationLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DocumentationLayout({ children, className }: DocumentationLayoutProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Documentation</h3>
            <ul className="space-y-2">
              <li>
                <a href="#getting-started" className="text-sm text-gray-600 hover:text-gray-900 block py-1">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="#api-reference" className="text-sm text-gray-600 hover:text-gray-900 block py-1">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#examples" className="text-sm text-gray-600 hover:text-gray-900 block py-1">
                  Examples
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

interface DocsSectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

export function DocsSection({ title, children, id }: DocsSectionProps) {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="prose prose-gray max-w-none">
        {children}
      </div>
    </section>
  );
}

interface DocsCalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'success';
  title?: string;
  children: React.ReactNode;
}

export function DocsCallout({ type = 'info', title, children }: DocsCalloutProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      title: 'text-blue-900'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      title: 'text-yellow-900'
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      title: 'text-red-900'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      title: 'text-green-900'
    }
  } as const;

  // Type-safe access with fallback
  const currentStyle = type in styles ? styles[type as keyof typeof styles] : styles.info;

  return (
    <div className={cn(
      'border rounded-lg p-4 my-4',
      currentStyle.bg,
      currentStyle.border
    )}>
      {title && (
        <h4 className={cn('font-semibold mb-2', currentStyle.title)}>
          {title}
        </h4>
      )}
      <div className={cn('text-sm', currentStyle.text)}>
        {children}
      </div>
    </div>
  );
}

interface DocsCodeBlockProps {
  language?: string;
  code: string;
  filename?: string;
}

export function DocsCodeBlock({ language = 'typescript', code, filename }: DocsCodeBlockProps) {
  return (
    <div className="my-4">
      {filename && (
        <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 rounded-t-md">
          {filename}
        </div>
      )}
      <pre className={cn(
        "bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto",
        filename ? "rounded-t-none rounded-b-md" : "rounded-md"
      )}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

interface PropsTableProps {
  props: Array<{
    name: string;
    type: string;
    required?: boolean;
    default?: string;
    description: string;
  }>;
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prop
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Required
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Default
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {props.map((prop) => (
            <tr key={prop.name}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {prop.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {prop.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {prop.required ? 'Yes' : 'No'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                {prop.default || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
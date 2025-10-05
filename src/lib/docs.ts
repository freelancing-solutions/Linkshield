import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

/**
 * Documentation Article Interface
 * 
 * Represents a single documentation article with metadata and content.
 */
export interface DocArticle {
  /** Unique slug identifier for the article */
  slug: string
  /** Article title (from frontmatter or filename) */
  title: string
  /** Brief description of the article */
  description: string
  /** Category this article belongs to */
  category: string
  /** Full file path relative to docs folder */
  path: string
  /** Raw markdown content */
  content: string
  /** Parsed HTML content */
  html?: string
  /** Frontmatter metadata */
  metadata: {
    title?: string
    description?: string
    category?: string
    tags?: string[]
    author?: string
    date?: string
    updated?: string
    order?: number
    isNew?: boolean
    isPopular?: boolean
    [key: string]: any
  }
}

/**
 * Documentation Category Interface
 * 
 * Represents a category of documentation with its articles.
 */
export interface DocCategoryData {
  /** Category identifier */
  id: string
  /** Display title */
  title: string
  /** Category description */
  description: string
  /** URL path for the category */
  path: string
  /** Number of articles in this category */
  articleCount: number
  /** Articles in this category */
  articles: DocArticle[]
  /** Category order for display */
  order?: number
}

/**
 * Documentation structure mapping
 * 
 * Maps folder names to category information for better organization.
 */
const CATEGORY_MAPPING: Record<string, { title: string; description: string; order: number }> = {
  'getting-started': {
    title: 'Getting Started',
    description: 'Learn the basics of LinkShield and get up and running quickly.',
    order: 1
  },
  'user-guides': {
    title: 'User Guides',
    description: 'Step-by-step guides for using LinkShield features.',
    order: 2
  },
  'features': {
    title: 'Features',
    description: 'Deep dive into LinkShield\'s security capabilities and features.',
    order: 3
  },
  'developer': {
    title: 'Developer Documentation',
    description: 'API documentation, integration guides, and developer resources.',
    order: 4
  },
  'authentication': {
    title: 'Authentication',
    description: 'Authentication methods, API keys, and security best practices.',
    order: 5
  }
}

/**
 * Get the absolute path to the docs directory
 */
const getDocsPath = (): string => {
  return path.join(process.cwd(), 'docs')
}

/**
 * Parse markdown content and extract frontmatter
 * 
 * @param filePath - Path to the markdown file
 * @returns Parsed article data
 */
export async function parseMarkdownFile(filePath: string): Promise<DocArticle | null> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    // Extract category from file path
    const relativePath = path.relative(getDocsPath(), filePath)
    const pathParts = relativePath.split(path.sep)
    const category = pathParts.length > 1 ? pathParts[0] : 'general'
    
    // Generate slug from filename
    const filename = path.basename(filePath, '.md')
    const slug = filename.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Extract title from frontmatter or filename
    const title = data.title || filename.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    // Generate description from frontmatter or first paragraph
    let description = data.description || ''
    if (!description) {
      // Extract first paragraph as description
      const firstParagraph = content.split('\n\n')[0]
      if (firstParagraph && !firstParagraph.startsWith('#')) {
        description = firstParagraph.replace(/[#*`]/g, '').trim().substring(0, 150) + '...'
      }
    }
    
    return {
      slug,
      title,
      description,
      category,
      path: relativePath,
      content,
      metadata: {
        ...data,
        title,
        description,
        category
      }
    }
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error)
    return null
  }
}

/**
 * Convert markdown content to HTML
 * 
 * @param content - Raw markdown content
 * @returns HTML string
 */
export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(gfm) // GitHub Flavored Markdown
    .use(html, { sanitize: false })
    .process(content)
  
  return result.toString()
}

/**
 * Get all documentation articles from the docs folder
 * 
 * @returns Array of parsed articles
 */
export async function getAllDocArticles(): Promise<DocArticle[]> {
  const docsPath = getDocsPath()
  const articles: DocArticle[] = []
  
  /**
   * Recursively scan directory for markdown files
   */
  async function scanDirectory(dirPath: string): Promise<void> {
    try {
      const items = fs.readdirSync(dirPath)
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stat = fs.statSync(itemPath)
        
        if (stat.isDirectory()) {
          // Skip hidden directories and node_modules
          if (!item.startsWith('.') && item !== 'node_modules') {
            await scanDirectory(itemPath)
          }
        } else if (stat.isFile() && item.endsWith('.md')) {
          // Skip README files in root docs folder
          if (item === 'README.md' && dirPath === docsPath) {
            continue
          }
          
          const article = await parseMarkdownFile(itemPath)
          if (article) {
            articles.push(article)
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error)
    }
  }
  
  await scanDirectory(docsPath)
  return articles
}

/**
 * Get articles grouped by category
 * 
 * @returns Object with categories as keys and articles as values
 */
export async function getDocumentationByCategory(): Promise<Record<string, DocCategoryData>> {
  const articles = await getAllDocArticles()
  const categories: Record<string, DocCategoryData> = {}
  
  // Group articles by category
  for (const article of articles) {
    const categoryId = article.category
    
    // Skip articles with undefined or null category
    if (!categoryId) {
      console.warn('Article with undefined category:', article.slug, article.path)
      continue
    }
    
    if (!categories[categoryId]) {
      const categoryInfo = CATEGORY_MAPPING[categoryId] || {
        title: categoryId.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `Documentation for ${categoryId}`,
        order: 999
      }
      
      categories[categoryId] = {
        id: categoryId,
        title: categoryInfo.title,
        description: categoryInfo.description,
        path: `/docs/${categoryId}`,
        articleCount: 0,
        articles: [],
        order: categoryInfo.order
      }
    }
    
    categories[categoryId].articles.push(article)
    categories[categoryId].articleCount = categories[categoryId].articles.length
  }
  
  // Sort articles within each category by order or title
  for (const category of Object.values(categories)) {
    category.articles.sort((a, b) => {
      const orderA = a.metadata.order || 999
      const orderB = b.metadata.order || 999
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      return a.title.localeCompare(b.title)
    })
  }
  
  return categories
}

/**
 * Get a specific article by category and slug
 * 
 * @param category - Category identifier
 * @param slug - Article slug
 * @returns Article data with HTML content
 */
export async function getDocArticle(category: string, slug: string): Promise<DocArticle | null> {
  const articles = await getAllDocArticles()
  const article = articles.find(a => a.category === category && a.slug === slug)
  
  if (!article) {
    return null
  }
  
  // Convert markdown to HTML
  article.html = await markdownToHtml(article.content)
  
  return article
}

/**
 * Search articles by query
 * 
 * @param query - Search query
 * @returns Matching articles
 */
export async function searchDocArticles(query: string): Promise<DocArticle[]> {
  if (!query.trim()) {
    return []
  }
  
  const articles = await getAllDocArticles()
  const searchTerm = query.toLowerCase()
  
  return articles.filter(article => {
    return (
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.metadata.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }).slice(0, 20) // Limit results
}

/**
 * Get featured/popular articles
 * 
 * @returns Array of featured articles
 */
export async function getFeaturedArticles(): Promise<DocArticle[]> {
  const articles = await getAllDocArticles()
  
  return articles
    .filter(article => article.metadata.isPopular || article.metadata.isNew)
    .sort((a, b) => {
      // Prioritize popular over new
      if (a.metadata.isPopular && !b.metadata.isPopular) return -1
      if (!a.metadata.isPopular && b.metadata.isPopular) return 1
      
      return a.title.localeCompare(b.title)
    })
    .slice(0, 10)
}
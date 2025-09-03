import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import ZAI from 'z-ai-web-dev-sdk'

// URL validation utilities
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    // Remove trailing slash and normalize
    return urlObj.origin + urlObj.pathname.replace(/\/$/, '') + urlObj.search
  } catch {
    return url
  }
}

export function createUrlHash(url: string): string {
  return crypto.createHash('sha256').update(normalizeUrl(url).toLowerCase()).digest('hex')
}

// Security scoring utilities
export function calculateSecurityScore({ 
  statusCode, 
  sslValid, 
  protocol, 
  responseTime,
  hasSecurityHeaders = false 
}: {
  statusCode: number
  sslValid: boolean
  protocol: string
  responseTime: number
  hasSecurityHeaders?: boolean
}): number {
  let score = 0
  
  // HTTP Status (35 points max)
  if (statusCode >= 200 && statusCode < 300) {
    score += 35 // Success status codes
  } else if (statusCode >= 300 && statusCode < 400) {
    score += 25 // Redirects
  } else if (statusCode === 404) {
    score += 10 // Not found
  } else {
    score += 0 // Other error codes
  }
  
  // SSL/HTTPS (35 points max)
  if (protocol === 'https:') {
    score += 25
    if (sslValid) {
      score += 10
    }
  }
  
  // Security Headers (15 points max)
  if (hasSecurityHeaders) {
    score += 15
  }
  
  // Response Time (15 points max)
  if (responseTime < 1000) {
    score += 15 // Excellent
  } else if (responseTime < 3000) {
    score += 10 // Good
  } else if (responseTime < 5000) {
    score += 5 // Fair
  }
  // No points for slow responses
  
  return Math.min(100, Math.max(0, score))
}

// AI Content Analysis utilities
export async function analyzeContentWithAI(content: string, url: string) {
  try {
    const zai = await ZAI.create()
    
    // Generate content summary
    const summaryPrompt = `
      Analyze the following web content and provide:
      1. A brief summary (2-3 sentences)
      2. Content quality score (0-100)
      3. Readability score (0-100)
      4. Main topics/categories
      5. Estimated reading time
      
      Content: ${content.substring(0, 4000)}
    `
    
    const summaryResponse = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert content analyst. Provide detailed analysis in JSON format.'
        },
        {
          role: 'user',
          content: summaryPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })
    
    const analysisText = summaryResponse.choices[0]?.message?.content || ''
    
    // Parse the response (in a real implementation, you'd want more robust parsing)
    const analysis = {
      summary: analysisText,
      qualityScore: Math.floor(Math.random() * 30) + 70, // Mock score for demo
      readabilityScore: Math.floor(Math.random() * 25) + 65, // Mock score for demo
      topics: extractTopics(content),
      readingTime: Math.ceil(content.split(' ').length / 200) // Rough estimate
    }
    
    return analysis
    
  } catch (error) {
    console.error('AI content analysis error:', error)
    // Return basic analysis if AI fails
    return {
      summary: 'Content analysis unavailable',
      qualityScore: 50,
      readabilityScore: 50,
      topics: extractTopics(content),
      readingTime: Math.ceil(content.split(' ').length / 200)
    }
  }
}

function extractTopics(content: string): string[] {
  // Simple topic extraction based on keyword frequency
  const commonTopics = [
    'technology', 'business', 'health', 'science', 'education',
    'entertainment', 'sports', 'politics', 'travel', 'food',
    'fashion', 'lifestyle', 'finance', 'marketing', 'software'
  ]
  
  const words = content.toLowerCase().split(/\W+/)
  const topicCounts: { [key: string]: number } = {}
  
  commonTopics.forEach(topic => {
    const count = words.filter(word => word.includes(topic)).length
    if (count > 0) {
      topicCounts[topic] = count
    }
  })
  
  return Object.entries(topicCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([topic]) => topic)
}

// Similarity analysis utilities
export async function findSimilarPages(embedding: number[], limit: number = 5) {
  // Mock implementation - in a real app, this would query a vector database
  return Array.from({ length: limit }, (_, i) => ({
    id: uuidv4(),
    url: `https://example${i + 1}.com/similar-page`,
    title: `Similar Page ${i + 1}`,
    similarityScore: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
    similarityType: 'semantic' as const,
    comparisonMetadata: {
      commonTopics: ['technology', 'web development'],
      qualityDifference: Math.floor(Math.random() * 20) - 10
    }
  }))
}

// URL analysis utilities
export async function performURLAnalysis(url: string) {
  const startTime = Date.now()
  
  try {
    const urlObj = new URL(url)
    
    // Make HTTP request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'User-Agent': 'LinkShield/1.0 (+https://linkshield.site)'
      }
    })
    
    clearTimeout(timeoutId)
    
    const responseTime = Date.now() - startTime
    const statusCode = response.status
    
    // Analyze SSL
    let sslValid = false
    if (urlObj.protocol === 'https:') {
      sslValid = true // Simplified for demo
    }
    
    // Check for security headers
    const securityHeaders = {
      'x-content-type-options': response.headers.get('x-content-type-options'),
      'x-frame-options': response.headers.get('x-frame-options'),
      'x-xss-protection': response.headers.get('x-xss-protection'),
      'strict-transport-security': response.headers.get('strict-transport-security'),
      'content-security-policy': response.headers.get('content-security-policy')
    }
    
    const hasSecurityHeaders = Object.values(securityHeaders).some(header => header !== null)
    
    // Calculate security score
    const securityScore = calculateSecurityScore({
      statusCode,
      sslValid,
      protocol: urlObj.protocol,
      responseTime,
      hasSecurityHeaders
    })
    
    // Handle redirects
    let redirectChain = []
    const locationHeader = response.headers.get('location')
    if (locationHeader && [301, 302, 303, 307, 308].includes(statusCode)) {
      redirectChain.push({
        url: locationHeader,
        statusCode: statusCode
      })
    }
    
    // Try to get page content for AI analysis
    let content = ''
    let meta = {}
    try {
      const contentResponse = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'LinkShield/1.0 (+https://linkshield.app)'
        }
      })
      
      if (contentResponse.ok) {
        content = await contentResponse.text()
        // Extract meta information (simplified)
        const titleMatch = content.match(/<title>(.*?)<\/title>/i)
        const descriptionMatch = content.match(/<meta name="description" content="(.*?)"/i)
        
        meta = {
          title: titleMatch ? titleMatch[1] : undefined,
          description: descriptionMatch ? descriptionMatch[1] : undefined
        }
      }
    } catch {
      // Content extraction failed
    }
    
    return {
      statusCode,
      responseTime,
      sslValid,
      securityScore,
      hasSecurityHeaders,
      securityHeaders,
      meta,
      redirectChain: redirectChain.length > 0 ? redirectChain : undefined,
      content: content.substring(0, 5000) // Limit content size
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - URL took too long to respond')
    }
    throw new Error(`Failed to analyze URL: ${error.message}`)
  }
}

// Report generation utilities
export function generateShareableReport(checkData: any, aiAnalysis?: any) {
  return {
    id: checkData.id,
    url: checkData.url,
    analyzedAt: checkData.createdAt,
    securityScore: checkData.securityScore,
    statusCode: checkData.statusCode,
    responseTime: checkData.responseTimeMs,
    sslValid: checkData.sslValid,
    meta: checkData.metaData ? JSON.parse(checkData.metaData) : undefined,
    redirectChain: checkData.redirectChain ? JSON.parse(checkData.redirectChain) : undefined,
    aiInsights: aiAnalysis ? {
      qualityScore: aiAnalysis.qualityMetrics ? JSON.parse(aiAnalysis.qualityMetrics).overallQuality : undefined,
      summary: aiAnalysis.contentSummary,
      topics: aiAnalysis.topicCategories ? JSON.parse(aiAnalysis.topicCategories) : [],
      similarPages: [] // Would be populated from similar_pages table
    } : undefined
  }
}
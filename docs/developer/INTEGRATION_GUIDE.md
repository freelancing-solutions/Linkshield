# LinkShield Integration Guide

This guide provides comprehensive instructions for integrating LinkShield's security and threat detection capabilities into your applications, websites, and workflows.

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Getting Started](#getting-started)
3. [Authentication Patterns](#authentication-patterns)
4. [Common Integration Scenarios](#common-integration-scenarios)
5. [Frontend Integration](#frontend-integration)
6. [Backend Integration](#backend-integration)
7. [Webhook Integration](#webhook-integration)
8. [Browser Extension Integration](#browser-extension-integration)
9. [Mobile App Integration](#mobile-app-integration)
10. [Enterprise Integration](#enterprise-integration)
11. [Testing and Debugging](#testing-and-debugging)
12. [Performance Optimization](#performance-optimization)
13. [Security Best Practices](#security-best-practices)
14. [Troubleshooting](#troubleshooting)

## Integration Overview

LinkShield provides multiple integration methods to suit different use cases:

### Integration Types

| Type | Use Case | Authentication | Complexity |
|------|----------|----------------|------------|
| **REST API** | Server-to-server, web apps | API Key / JWT | Medium |
| **JavaScript SDK** | Frontend applications | JWT | Low |
| **Webhooks** | Real-time notifications | API Key | Medium |
| **Browser Extension** | Browser-based protection | Extension API | Low |
| **Embed Widgets** | Quick integration | Public API | Very Low |

### Key Capabilities

- **URL Security Scanning** - Real-time threat detection
- **AI Content Analysis** - Phishing and malware detection
- **Social Media Protection** - Algorithm health monitoring
- **Community Intelligence** - Crowdsourced threat data
- **Team Collaboration** - Multi-user project management

## Getting Started

### 1. Create Your Account

1. Sign up at [LinkShield Dashboard](https://dashboard.linkshield.com)
2. Verify your email address
3. Choose your subscription plan
4. Access your API credentials

### 2. Generate API Credentials

#### For Server-Side Integration (API Keys)
```bash
curl -X POST https://api.linkshield.site/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "permissions": ["url_check", "ai_analysis", "reports"],
    "expires_at": "2025-12-31T23:59:59Z"
  }'
```

#### For Client-Side Integration (JWT Tokens)
```javascript
// Login to get JWT token
const response = await fetch('https://api.linkshield.site/api/v1/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your@email.com',
    password: 'your_password'
  })
});

const { access_token } = await response.json();
```

### 3. Test Your Integration

```bash
# Test API connectivity
curl -X GET https://api.linkshield.site/api/v1/user/profile \
  -H "X-API-Key: your_api_key"
```

## Authentication Patterns

### Pattern 1: Server-Side API Key Authentication

**Best for:** Backend services, server-to-server communication

```javascript
// Node.js example
const axios = require('axios');

const linkshield = axios.create({
  baseURL: 'https://api.linkshield.site/api/v1',
  headers: {
    'X-API-Key': process.env.LINKSHIELD_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Check URL security
const checkURL = async (url) => {
  try {
    const response = await linkshield.post('/url-check/check', {
      url,
      scan_type: 'SECURITY_REPUTATION_CONTENT'
    });
    return response.data;
  } catch (error) {
    console.error('URL check failed:', error.response?.data);
    throw error;
  }
};
```

### Pattern 2: Client-Side JWT Authentication

**Best for:** Frontend applications, user-specific operations

```javascript
// React example with token management
class LinkShieldClient {
  constructor() {
    this.token = localStorage.getItem('linkshield_token');
    this.baseURL = 'https://api.linkshield.site/api/v1';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Token expired, redirect to login
      this.logout();
      throw new Error('Authentication required');
    }

    return response.json();
  }

  async checkURL(url) {
    return this.request('/url-check/check', {
      method: 'POST',
      body: JSON.stringify({
        url,
        scan_type: 'SECURITY'
      })
    });
  }

  logout() {
    localStorage.removeItem('linkshield_token');
    window.location.href = '/login';
  }
}
```

### Pattern 3: Proxy Authentication

**Best for:** Hiding API keys from frontend, rate limiting

```javascript
// Backend proxy endpoint
app.post('/api/check-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Validate request
    if (!url || !isValidURL(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Call LinkShield API
    const result = await linkshield.post('/url-check/check', {
      url,
      scan_type: 'SECURITY'
    });

    // Return filtered response
    res.json({
      risk_score: result.data.risk_score,
      threat_level: result.data.threat_level,
      is_safe: result.data.risk_score < 30
    });
  } catch (error) {
    res.status(500).json({ error: 'URL check failed' });
  }
});

// Frontend usage
const checkURL = async (url) => {
  const response = await fetch('/api/check-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  return response.json();
};
```

## Common Integration Scenarios

### Scenario 1: E-commerce Platform Protection

**Goal:** Protect customers from malicious links in product descriptions and reviews.

```javascript
// Product review validation
class ReviewValidator {
  constructor(apiKey) {
    this.linkshield = new LinkShieldAPI(apiKey);
  }

  async validateReview(reviewContent) {
    // Extract URLs from review content
    const urls = this.extractURLs(reviewContent);
    const results = [];

    // Check each URL
    for (const url of urls) {
      try {
        const result = await this.linkshield.checkURL(url);
        results.push({
          url,
          risk_score: result.risk_score,
          is_safe: result.risk_score < 30
        });
      } catch (error) {
        console.error(`Failed to check URL ${url}:`, error);
      }
    }

    // Analyze text content for phishing patterns
    const aiAnalysis = await this.linkshield.analyzeContent(reviewContent, [
      'phishing', 'content_quality'
    ]);

    return {
      urls: results,
      content_analysis: aiAnalysis,
      is_approved: this.shouldApproveReview(results, aiAnalysis)
    };
  }

  shouldApproveReview(urlResults, aiAnalysis) {
    // Reject if any URL has high risk
    const hasHighRiskURL = urlResults.some(result => result.risk_score > 70);
    
    // Reject if content has high phishing score
    const hasPhishingContent = aiAnalysis.results.phishing_score > 80;

    return !hasHighRiskURL && !hasPhishingContent;
  }

  extractURLs(text) {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
  }
}

// Usage in review submission
app.post('/api/reviews', async (req, res) => {
  const { productId, content, rating } = req.body;
  
  // Validate review content
  const validator = new ReviewValidator(process.env.LINKSHIELD_API_KEY);
  const validation = await validator.validateReview(content);

  if (!validation.is_approved) {
    return res.status(400).json({
      error: 'Review contains suspicious content or links',
      details: validation
    });
  }

  // Save approved review
  const review = await Review.create({
    productId,
    content,
    rating,
    status: 'approved'
  });

  res.json(review);
});
```

### Scenario 2: Email Security Gateway

**Goal:** Scan emails for malicious links and phishing content before delivery.

```python
import asyncio
import aiohttp
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailSecurityGateway:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.linkshield.site/api/v1'
    
    async def scan_email(self, email_content):
        """Scan email for security threats."""
        # Extract URLs and text content
        urls = self.extract_urls(email_content)
        text_content = self.extract_text(email_content)
        
        # Concurrent scanning
        tasks = []
        
        # Scan URLs
        for url in urls:
            tasks.append(self.scan_url(url))
        
        # Analyze text content
        if text_content:
            tasks.append(self.analyze_content(text_content))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return self.evaluate_email_safety(results)
    
    async def scan_url(self, url):
        """Scan individual URL."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f'{self.base_url}/url-check/check',
                headers={'X-API-Key': self.api_key},
                json={'url': url, 'scan_type': 'SECURITY_REPUTATION_CONTENT'}
            ) as response:
                return await response.json()
    
    async def analyze_content(self, content):
        """Analyze email content with AI."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f'{self.base_url}/ai-analysis/analyze',
                headers={'X-API-Key': self.api_key},
                json={
                    'content': content,
                    'analysis_types': ['phishing', 'manipulation']
                }
            ) as response:
                return await response.json()
    
    def evaluate_email_safety(self, scan_results):
        """Evaluate overall email safety."""
        risk_score = 0
        threats = []
        
        for result in scan_results:
            if isinstance(result, Exception):
                continue
                
            if 'risk_score' in result:
                # URL scan result
                risk_score = max(risk_score, result['risk_score'])
                if result['risk_score'] > 70:
                    threats.append(f"High-risk URL: {result['url']}")
            
            elif 'results' in result:
                # AI analysis result
                phishing_score = result['results'].get('phishing_score', 0)
                risk_score = max(risk_score, phishing_score)
                if phishing_score > 80:
                    threats.append("Phishing content detected")
        
        return {
            'is_safe': risk_score < 50,
            'risk_score': risk_score,
            'threats': threats,
            'action': self.determine_action(risk_score)
        }
    
    def determine_action(self, risk_score):
        """Determine what action to take."""
        if risk_score < 30:
            return 'deliver'
        elif risk_score < 70:
            return 'quarantine'
        else:
            return 'block'

# Usage in email processing pipeline
async def process_incoming_email(email_message):
    gateway = EmailSecurityGateway(os.getenv('LINKSHIELD_API_KEY'))
    
    # Scan email
    scan_result = await gateway.scan_email(email_message)
    
    # Take action based on result
    if scan_result['action'] == 'deliver':
        await deliver_email(email_message)
    elif scan_result['action'] == 'quarantine':
        await quarantine_email(email_message, scan_result)
    else:
        await block_email(email_message, scan_result)
    
    # Log security event
    await log_security_event({
        'email_id': email_message.id,
        'risk_score': scan_result['risk_score'],
        'action': scan_result['action'],
        'threats': scan_result['threats']
    })
```

### Scenario 3: Social Media Management Tool

**Goal:** Monitor social media posts for algorithm health and engagement optimization.

```javascript
// Social media monitoring integration
class SocialMediaMonitor {
  constructor(jwtToken) {
    this.token = jwtToken;
    this.baseURL = 'https://api.linkshield.site/api/v1';
  }

  async connectPlatform(platform, credentials) {
    // Connect social media platform
    const response = await fetch(`${this.baseURL}/social-protection/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        platform,
        credentials
      })
    });

    return response.json();
  }

  async getAlgorithmHealth(platform, timeRange = '7d') {
    const response = await fetch(
      `${this.baseURL}/social-protection/analytics?platform=${platform}&time_range=${timeRange}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    );

    return response.json();
  }

  async analyzePost(postContent, platform) {
    // Analyze post content for optimization
    const response = await fetch(`${this.baseURL}/ai-analysis/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: postContent,
        content_type: 'social_media_post',
        platform,
        analysis_types: ['content_quality', 'engagement_prediction']
      })
    });

    return response.json();
  }

  async generateOptimizationReport(userId, platforms) {
    const reports = {};

    for (const platform of platforms) {
      try {
        const health = await this.getAlgorithmHealth(platform);
        reports[platform] = {
          algorithm_health: health.algorithm_health,
          recommendations: this.generateRecommendations(health),
          trends: health.metrics
        };
      } catch (error) {
        console.error(`Failed to get ${platform} data:`, error);
        reports[platform] = { error: 'Data unavailable' };
      }
    }

    return reports;
  }

  generateRecommendations(healthData) {
    const recommendations = [];
    const { overall_score, visibility_score, engagement_score } = healthData.algorithm_health;

    if (visibility_score < 70) {
      recommendations.push({
        type: 'visibility',
        priority: 'high',
        message: 'Your content visibility is below optimal. Consider posting at peak engagement times.',
        action: 'Adjust posting schedule'
      });
    }

    if (engagement_score < 60) {
      recommendations.push({
        type: 'engagement',
        priority: 'medium',
        message: 'Engagement rates could be improved with more interactive content.',
        action: 'Add polls, questions, or calls-to-action'
      });
    }

    return recommendations;
  }
}

// Dashboard integration
class SocialMediaDashboard {
  constructor(userId) {
    this.userId = userId;
    this.monitor = new SocialMediaMonitor(this.getJWTToken());
  }

  async renderDashboard() {
    const platforms = ['twitter', 'instagram', 'linkedin'];
    const report = await this.monitor.generateOptimizationReport(this.userId, platforms);

    // Render dashboard components
    this.renderAlgorithmHealthCards(report);
    this.renderRecommendations(report);
    this.renderTrendCharts(report);
  }

  renderAlgorithmHealthCards(report) {
    Object.entries(report).forEach(([platform, data]) => {
      if (data.error) return;

      const card = document.createElement('div');
      card.className = 'health-card';
      card.innerHTML = `
        <h3>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
        <div class="score ${this.getScoreClass(data.algorithm_health.overall_score)}">
          ${data.algorithm_health.overall_score}/100
        </div>
        <div class="metrics">
          <span>Visibility: ${data.algorithm_health.visibility_score}</span>
          <span>Engagement: ${data.algorithm_health.engagement_score}</span>
        </div>
      `;

      document.getElementById('health-cards').appendChild(card);
    });
  }

  getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }
}
```

## Frontend Integration

### React Integration

```jsx
// React hook for LinkShield integration
import { useState, useEffect, useCallback } from 'react';

const useLinkShield = (token) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setClient(new LinkShieldClient(token));
    }
  }, [token]);

  const checkURL = useCallback(async (url) => {
    if (!client) throw new Error('LinkShield client not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.checkURL(url);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  const analyzeContent = useCallback(async (content, types = ['phishing']) => {
    if (!client) throw new Error('LinkShield client not initialized');
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.analyzeContent(content, types);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    checkURL,
    analyzeContent,
    loading,
    error,
    isReady: !!client
  };
};

// URL checker component
const URLChecker = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const { checkURL, loading, error } = useLinkShield(useAuthToken());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    try {
      const scanResult = await checkURL(url);
      setResult(scanResult);
    } catch (err) {
      console.error('URL check failed:', err);
    }
  };

  return (
    <div className="url-checker">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to check..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check URL'}
        </button>
      </form>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {result && (
        <div className={`result ${result.threat_level.toLowerCase()}`}>
          <h3>Scan Result</h3>
          <p>Risk Score: {result.risk_score}/100</p>
          <p>Threat Level: {result.threat_level}</p>
          <p>Status: {result.status}</p>
          
          {result.providers && (
            <div className="providers">
              <h4>Security Providers</h4>
              {result.providers.map((provider, index) => (
                <div key={index} className="provider">
                  <strong>{provider.provider}:</strong> {provider.status}
                  {provider.confidence_score && (
                    <span> (Confidence: {provider.confidence_score}%)</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### Vue.js Integration

```vue
<template>
  <div class="linkshield-integration">
    <url-scanner @result="handleScanResult" />
    <content-analyzer @result="handleAnalysisResult" />
    <security-dashboard :data="dashboardData" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { LinkShieldAPI } from '@/services/linkshield';

export default {
  name: 'LinkShieldIntegration',
  setup() {
    const dashboardData = ref(null);
    const linkshield = ref(null);

    onMounted(async () => {
      // Initialize LinkShield client
      const token = localStorage.getItem('auth_token');
      linkshield.value = new LinkShieldAPI(token);
      
      // Load dashboard data
      await loadDashboardData();
    });

    const loadDashboardData = async () => {
      try {
        const data = await linkshield.value.getDashboardOverview();
        dashboardData.value = data;
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    const handleScanResult = (result) => {
      // Handle URL scan result
      console.log('URL scan result:', result);
      
      // Update dashboard if needed
      if (result.threat_level === 'HIGH') {
        loadDashboardData();
      }
    };

    const handleAnalysisResult = (result) => {
      // Handle content analysis result
      console.log('Content analysis result:', result);
    };

    return {
      dashboardData,
      handleScanResult,
      handleAnalysisResult
    };
  }
};
</script>
```

## Backend Integration

### Express.js Middleware

```javascript
// LinkShield security middleware
const createLinkShieldMiddleware = (options = {}) => {
  const {
    apiKey,
    scanUserContent = true,
    scanURLs = true,
    blockHighRisk = true,
    riskThreshold = 70
  } = options;

  const linkshield = new LinkShieldAPI(apiKey);

  return async (req, res, next) => {
    try {
      // Skip scanning for certain routes
      if (options.skipRoutes?.includes(req.path)) {
        return next();
      }

      const scanResults = [];

      // Scan URLs in request body
      if (scanURLs && req.body) {
        const urls = extractURLsFromObject(req.body);
        for (const url of urls) {
          const result = await linkshield.checkURL(url);
          scanResults.push({ type: 'url', url, result });
        }
      }

      // Scan text content
      if (scanUserContent && req.body) {
        const textContent = extractTextFromObject(req.body);
        if (textContent) {
          const result = await linkshield.analyzeContent(textContent);
          scanResults.push({ type: 'content', result });
        }
      }

      // Evaluate results
      const highRiskItems = scanResults.filter(item => {
        const riskScore = item.result.risk_score || 
                         item.result.results?.phishing_score || 0;
        return riskScore > riskThreshold;
      });

      if (blockHighRisk && highRiskItems.length > 0) {
        return res.status(400).json({
          error: 'Content blocked due to security concerns',
          details: highRiskItems.map(item => ({
            type: item.type,
            risk_score: item.result.risk_score || item.result.results?.phishing_score,
            url: item.url
          }))
        });
      }

      // Add scan results to request for logging
      req.linkshieldScan = scanResults;
      next();
    } catch (error) {
      console.error('LinkShield middleware error:', error);
      // Continue processing on error (fail open)
      next();
    }
  };
};

// Usage
const app = express();

app.use('/api/user-content', createLinkShieldMiddleware({
  apiKey: process.env.LINKSHIELD_API_KEY,
  scanUserContent: true,
  scanURLs: true,
  blockHighRisk: true,
  riskThreshold: 70,
  skipRoutes: ['/api/user-content/health']
}));

// Helper functions
function extractURLsFromObject(obj) {
  const urls = [];
  const urlRegex = /https?:\/\/[^\s]+/g;
  
  JSON.stringify(obj).replace(urlRegex, (match) => {
    urls.push(match);
    return match;
  });
  
  return [...new Set(urls)]; // Remove duplicates
}

function extractTextFromObject(obj) {
  const texts = [];
  
  const traverse = (value) => {
    if (typeof value === 'string' && value.length > 10) {
      texts.push(value);
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(traverse);
    }
  };
  
  traverse(obj);
  return texts.join(' ');
}
```

### Django Integration

```python
# Django middleware for LinkShield integration
import json
import re
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from .services import LinkShieldService

class LinkShieldSecurityMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response
        self.linkshield = LinkShieldService()
        self.url_pattern = re.compile(r'https?://[^\s]+')
        
    def process_request(self, request):
        # Skip for certain paths
        skip_paths = ['/admin/', '/api/health/', '/static/']
        if any(request.path.startswith(path) for path in skip_paths):
            return None
            
        # Only scan POST requests with content
        if request.method != 'POST' or not hasattr(request, 'body'):
            return None
            
        try:
            # Parse request body
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST.dict()
                
            # Scan content
            scan_results = self.scan_request_data(data)
            
            # Check for high-risk content
            high_risk_items = [
                item for item in scan_results 
                if item.get('risk_score', 0) > 70
            ]
            
            if high_risk_items:
                return JsonResponse({
                    'error': 'Content blocked due to security concerns',
                    'details': high_risk_items
                }, status=400)
                
            # Store scan results for logging
            request.linkshield_scan = scan_results
            
        except Exception as e:
            # Log error but don't block request
            print(f"LinkShield scan error: {e}")
            
        return None
    
    def scan_request_data(self, data):
        results = []
        
        # Extract and scan URLs
        urls = self.extract_urls(data)
        for url in urls:
            try:
                result = self.linkshield.check_url(url)
                results.append({
                    'type': 'url',
                    'url': url,
                    'risk_score': result.get('risk_score', 0),
                    'threat_level': result.get('threat_level', 'UNKNOWN')
                })
            except Exception as e:
                print(f"Failed to scan URL {url}: {e}")
        
        # Extract and analyze text content
        text_content = self.extract_text(data)
        if text_content:
            try:
                result = self.linkshield.analyze_content(text_content)
                results.append({
                    'type': 'content',
                    'risk_score': result.get('results', {}).get('phishing_score', 0),
                    'analysis': result
                })
            except Exception as e:
                print(f"Failed to analyze content: {e}")
        
        return results
    
    def extract_urls(self, data):
        urls = set()
        data_str = json.dumps(data) if isinstance(data, dict) else str(data)
        urls.update(self.url_pattern.findall(data_str))
        return list(urls)
    
    def extract_text(self, data):
        texts = []
        
        def traverse(obj):
            if isinstance(obj, str) and len(obj) > 10:
                texts.append(obj)
            elif isinstance(obj, dict):
                for value in obj.values():
                    traverse(value)
            elif isinstance(obj, list):
                for item in obj:
                    traverse(item)
        
        traverse(data)
        return ' '.join(texts)

# LinkShield service class
class LinkShieldService:
    def __init__(self):
        self.api_key = settings.LINKSHIELD_API_KEY
        self.base_url = 'https://api.linkshield.site/api/v1'
    
    def check_url(self, url):
        response = requests.post(
            f'{self.base_url}/url-check/check',
            headers={'X-API-Key': self.api_key},
            json={'url': url, 'scan_type': 'SECURITY'}
        )
        response.raise_for_status()
        return response.json()
    
    def analyze_content(self, content):
        response = requests.post(
            f'{self.base_url}/ai-analysis/analyze',
            headers={'X-API-Key': self.api_key},
            json={
                'content': content,
                'analysis_types': ['phishing', 'content_quality']
            }
        )
        response.raise_for_status()
        return response.json()
```

## Webhook Integration

### Setting Up Webhooks

```javascript
// Webhook endpoint setup
app.post('/webhooks/linkshield', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-linkshield-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!verifyWebhookSignature(payload, signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(payload);
  
  // Handle different event types
  switch (event.type) {
    case 'url_check.completed':
      handleURLCheckCompleted(event.data);
      break;
      
    case 'threat.detected':
      handleThreatDetected(event.data);
      break;
      
    case 'report.verified':
      handleReportVerified(event.data);
      break;
      
    case 'subscription.updated':
      handleSubscriptionUpdated(event.data);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.status(200).send('OK');
});

// Webhook signature verification
function verifyWebhookSignature(payload, signature) {
  const crypto = require('crypto');
  const secret = process.env.LINKSHIELD_WEBHOOK_SECRET;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return `sha256=${expectedSignature}` === signature;
}

// Event handlers
async function handleURLCheckCompleted(data) {
  const { check_id, url, risk_score, threat_level } = data;
  
  // Update database
  await URLCheck.findByIdAndUpdate(check_id, {
    status: 'completed',
    risk_score,
    threat_level,
    completed_at: new Date()
  });
  
  // Notify user if high risk
  if (risk_score > 70) {
    await notifyUser({
      type: 'high_risk_url',
      url,
      risk_score,
      check_id
    });
  }
}

async function handleThreatDetected(data) {
  const { url, threat_type, severity, details } = data;
  
  // Log security incident
  await SecurityIncident.create({
    type: 'threat_detected',
    url,
    threat_type,
    severity,
    details,
    detected_at: new Date()
  });
  
  // Alert security team for high severity threats
  if (severity === 'HIGH') {
    await alertSecurityTeam({
      message: `High severity threat detected: ${threat_type}`,
      url,
      details
    });
  }
}
```

### Webhook Event Types

| Event Type | Description | Payload |
|------------|-------------|---------|
| `url_check.completed` | URL scan completed | `{check_id, url, risk_score, threat_level}` |
| `threat.detected` | New threat identified | `{url, threat_type, severity, details}` |
| `report.verified` | Community report verified | `{report_id, url, status, verified_by}` |
| `subscription.updated` | Subscription changed | `{user_id, plan, status, effective_date}` |
| `api_key.expired` | API key expired | `{key_id, name, expired_at}` |
| `quota.exceeded` | Usage quota exceeded | `{user_id, quota_type, limit, usage}` |

## Browser Extension Integration

### Content Script Integration

```javascript
// Content script for browser extension
class LinkShieldContentScript {
  constructor() {
    this.apiKey = null;
    this.scanResults = new Map();
    this.init();
  }

  async init() {
    // Get API key from extension storage
    const result = await chrome.storage.sync.get(['linkshield_api_key']);
    this.apiKey = result.linkshield_api_key;
    
    if (this.apiKey) {
      this.scanPageLinks();
      this.setupLinkMonitoring();
    }
  }

  async scanPageLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    const urls = Array.from(links).map(link => link.href);
    
    // Batch scan URLs
    for (const url of urls) {
      try {
        const result = await this.checkURL(url);
        this.scanResults.set(url, result);
        this.updateLinkAppearance(url, result);
      } catch (error) {
        console.error(`Failed to scan ${url}:`, error);
      }
    }
  }

  setupLinkMonitoring() {
    // Monitor for dynamically added links
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const links = node.querySelectorAll('a[href^="http"]');
            links.forEach(link => this.scanLink(link));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Add click interceptor for real-time warnings
    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && event.target.href) {
        this.handleLinkClick(event);
      }
    });
  }

  async checkURL(url) {
    const response = await fetch('https://api.linkshield.site/api/v1/url-check/check', {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        scan_type: 'SECURITY'
      })
    });

    return response.json();
  }

  updateLinkAppearance(url, scanResult) {
    const links = document.querySelectorAll(`a[href="${url}"]`);
    
    links.forEach(link => {
      // Add visual indicator based on risk level
      link.classList.remove('linkshield-safe', 'linkshield-warning', 'linkshield-danger');
      
      if (scanResult.risk_score < 30) {
        link.classList.add('linkshield-safe');
        link.title = 'LinkShield: Safe link';
      } else if (scanResult.risk_score < 70) {
        link.classList.add('linkshield-warning');
        link.title = `LinkShield: Caution - Risk score: ${scanResult.risk_score}`;
      } else {
        link.classList.add('linkshield-danger');
        link.title = `LinkShield: Dangerous - Risk score: ${scanResult.risk_score}`;
      }
    });
  }

  handleLinkClick(event) {
    const url = event.target.href;
    const scanResult = this.scanResults.get(url);
    
    if (scanResult && scanResult.risk_score > 70) {
      event.preventDefault();
      
      const proceed = confirm(
        `LinkShield Warning: This link has a high risk score (${scanResult.risk_score}/100).\n\n` +
        `Threat Level: ${scanResult.threat_level}\n\n` +
        'Do you want to proceed anyway?'
      );
      
      if (proceed) {
        window.open(url, '_blank');
      }
    }
  }
}

// Initialize content script
new LinkShieldContentScript();
```

### Extension Popup Integration

```javascript
// Extension popup script
class LinkShieldPopup {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadCurrentPageAnalysis();
    this.setupEventListeners();
  }

  async loadCurrentPageAnalysis() {
    // Get current tab URL
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const currentURL = tab.url;

    // Display current page info
    document.getElementById('current-url').textContent = currentURL;

    // Get scan result for current page
    try {
      const result = await this.checkURL(currentURL);
      this.displayPageAnalysis(result);
    } catch (error) {
      this.displayError('Failed to analyze current page');
    }

    // Load recent scan history
    await this.loadScanHistory();
  }

  async checkURL(url) {
    const apiKey = await this.getAPIKey();
    
    const response = await fetch('https://api.linkshield.site/api/v1/url-check/check', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        scan_type: 'SECURITY_REPUTATION_CONTENT'
      })
    });

    return response.json();
  }

  displayPageAnalysis(result) {
    const container = document.getElementById('page-analysis');
    
    container.innerHTML = `
      <div class="analysis-result ${result.threat_level.toLowerCase()}">
        <h3>Page Analysis</h3>
        <div class="risk-score">
          <span class="score">${result.risk_score}</span>
          <span class="label">Risk Score</span>
        </div>
        <div class="threat-level">
          Threat Level: <strong>${result.threat_level}</strong>
        </div>
        ${result.providers ? this.renderProviders(result.providers) : ''}
      </div>
    `;
  }

  renderProviders(providers) {
    return `
      <div class="providers">
        <h4>Security Providers</h4>
        ${providers.map(provider => `
          <div class="provider ${provider.status.toLowerCase()}">
            <span class="name">${provider.provider}</span>
            <span class="status">${provider.status}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  async loadScanHistory() {
    const history = await chrome.storage.local.get(['scan_history']) || [];
    const container = document.getElementById('scan-history');
    
    if (history.scan_history && history.scan_history.length > 0) {
      container.innerHTML = `
        <h3>Recent Scans</h3>
        <div class="history-list">
          ${history.scan_history.slice(0, 5).map(scan => `
            <div class="history-item">
              <div class="url">${this.truncateURL(scan.url)}</div>
              <div class="risk-score ${this.getRiskClass(scan.risk_score)}">
                ${scan.risk_score}
              </div>
              <div class="timestamp">${this.formatTime(scan.timestamp)}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      container.innerHTML = '<p>No recent scans</p>';
    }
  }

  setupEventListeners() {
    // Quick scan button
    document.getElementById('quick-scan').addEventListener('click', async () => {
      const url = document.getElementById('url-input').value;
      if (url) {
        await this.performQuickScan(url);
      }
    });

    // Settings button
    document.getElementById('settings').addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  async performQuickScan(url) {
    const button = document.getElementById('quick-scan');
    button.textContent = 'Scanning...';
    button.disabled = true;

    try {
      const result = await this.checkURL(url);
      
      // Save to history
      await this.saveScanToHistory(url, result);
      
      // Display result
      this.displayQuickScanResult(result);
    } catch (error) {
      this.displayError('Scan failed');
    } finally {
      button.textContent = 'Scan';
      button.disabled = false;
    }
  }

  async saveScanToHistory(url, result) {
    const history = await chrome.storage.local.get(['scan_history']) || { scan_history: [] };
    
    history.scan_history.unshift({
      url,
      risk_score: result.risk_score,
      threat_level: result.threat_level,
      timestamp: Date.now()
    });

    // Keep only last 50 scans
    history.scan_history = history.scan_history.slice(0, 50);
    
    await chrome.storage.local.set(history);
  }

  // Utility methods
  truncateURL(url) {
    return url.length > 40 ? url.substring(0, 40) + '...' : url;
  }

  getRiskClass(score) {
    if (score < 30) return 'safe';
    if (score < 70) return 'warning';
    return 'danger';
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
  }

  async getAPIKey() {
    const result = await chrome.storage.sync.get(['linkshield_api_key']);
    return result.linkshield_api_key;
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new LinkShieldPopup();
});
```

## Mobile App Integration

### React Native Integration

```javascript
// LinkShield service for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

class LinkShieldMobile {
  constructor() {
    this.baseURL = 'https://api.linkshield.site/api/v1';
    this.token = null;
    this.init();
  }

  async init() {
    this.token = await AsyncStorage.getItem('linkshield_token');
  }

  async checkURL(url) {
    const response = await fetch(`${this.baseURL}/url-check/check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        scan_type: 'SECURITY'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async analyzeContent(content) {
    const response = await fetch(`${this.baseURL}/ai-analysis/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content,
        analysis_types: ['phishing', 'content_quality']
      })
    });

    return response.json();
  }
}

// React Native component
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [linkshield, setLinkshield] = useState(null);

  useEffect(() => {
    setLinkshield(new LinkShieldMobile());
  }, []);

  const scanURL = async () => {
    if (!url || !linkshield) return;

    setLoading(true);
    try {
      const scanResult = await linkshield.checkURL(url);
      setResult(scanResult);

      // Show alert for high-risk URLs
      if (scanResult.risk_score > 70) {
        Alert.alert(
          'High Risk URL Detected',
          `This URL has a risk score of ${scanResult.risk_score}/100. Proceed with caution.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to scan URL. Please try again.');
      console.error('URL scan error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return '#4CAF50'; // Green
    if (score < 70) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>URL Security Scanner</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter URL to scan..."
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={scanURL}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Scanning...' : 'Scan URL'}
        </Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Scan Result</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={[styles.score, { color: getRiskColor(result.risk_score) }]}>
              {result.risk_score}/100
            </Text>
            <Text style={styles.scoreLabel}>Risk Score</Text>
          </View>
          
          <Text style={styles.threatLevel}>
            Threat Level: {result.threat_level}
          </Text>
          
          <Text style={styles.status}>
            Status: {result.status}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  result: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 15
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold'
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666'
  },
  threatLevel: {
    fontSize: 16,
    marginBottom: 10
  },
  status: {
    fontSize: 16,
    color: '#666'
  }
});

export default URLScanner;
```

## Enterprise Integration

### Single Sign-On (SSO) Integration

```javascript
// SAML SSO integration
const saml = require('passport-saml');

const samlStrategy = new saml.Strategy({
  entryPoint: 'https://your-idp.com/sso/saml',
  issuer: 'linkshield-app',
  callbackUrl: 'https://your-app.com/auth/saml/callback',
  cert: process.env.SAML_CERT,
  privateCert: process.env.SAML_PRIVATE_CERT
}, async (profile, done) => {
  try {
    // Map SAML attributes to user
    const user = {
      email: profile.email || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      name: profile.displayName || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      department: profile.department,
      role: profile.role
    };

    // Create or update user in LinkShield
    const linkshieldUser = await createOrUpdateLinkShieldUser(user);
    
    // Generate JWT token for LinkShield API
    const token = await generateLinkShieldToken(linkshieldUser);
    
    return done(null, { ...user, linkshield_token: token });
  } catch (error) {
    return done(error);
  }
});

async function createOrUpdateLinkShieldUser(userData) {
  const response = await fetch('https://api.linkshield.site/api/v1/enterprise/users', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.LINKSHIELD_ENTERPRISE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: userData.email,
      full_name: userData.name,
      department: userData.department,
      role: userData.role,
      sso_provider: 'saml'
    })
  });

  return response.json();
}
```

### Active Directory Integration

```powershell
# PowerShell script for AD integration
param(
    [string]$LinkShieldApiKey,
    [string]$ADGroup = "LinkShield-Users"
)

# Import Active Directory module
Import-Module ActiveDirectory

# Get users from specified AD group
$ADUsers = Get-ADGroupMember -Identity $ADGroup | Get-ADUser -Properties EmailAddress, Department, Title

foreach ($User in $ADUsers) {
    $UserData = @{
        email = $User.EmailAddress
        full_name = $User.Name
        department = $User.Department
        title = $User.Title
        ad_username = $User.SamAccountName
        sso_provider = "active_directory"
    }

    # Create user in LinkShield
    $Headers = @{
        "X-API-Key" = $LinkShieldApiKey
        "Content-Type" = "application/json"
    }

    try {
        $Response = Invoke-RestMethod -Uri "https://api.linkshield.site/api/v1/enterprise/users" `
                                    -Method POST `
                                    -Headers $Headers `
                                    -Body ($UserData | ConvertTo-Json)
        
        Write-Host "Created/Updated user: $($User.EmailAddress)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to create user $($User.EmailAddress): $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

### Bulk User Management

```python
# Python script for bulk user management
import csv
import requests
import json
from typing import List, Dict

class LinkShieldEnterpriseManager:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://api.linkshield.site/api/v1'
        self.headers = {
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        }
    
    def bulk_create_users(self, users_file: str) -> Dict:
        """Create users in bulk from CSV file."""
        results = {'success': [], 'failed': []}
        
        with open(users_file, 'r') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                try:
                    user_data = {
                        'email': row['email'],
                        'full_name': row['full_name'],
                        'department': row.get('department', ''),
                        'role': row.get('role', 'USER'),
                        'subscription_plan': row.get('plan', 'professional')
                    }
                    
                    response = requests.post(
                        f'{self.base_url}/enterprise/users',
                        headers=self.headers,
                        json=user_data
                    )
                    
                    if response.status_code in [200, 201]:
                        results['success'].append(row['email'])
                    else:
                        results['failed'].append({
                            'email': row['email'],
                            'error': response.text
                        })
                        
                except Exception as e:
                    results['failed'].append({
                        'email': row.get('email', 'unknown'),
                        'error': str(e)
                    })
        
        return results
    
    def sync_user_permissions(self, permissions_file: str):
        """Sync user permissions from CSV file."""
        with open(permissions_file, 'r') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                user_email = row['email']
                permissions = row['permissions'].split(',')
                
                try:
                    response = requests.put(
                        f'{self.base_url}/enterprise/users/{user_email}/permissions',
                        headers=self.headers,
                        json={'permissions': permissions}
                    )
                    
                    if response.status_code == 200:
                        print(f"Updated permissions for {user_email}")
                    else:
                        print(f"Failed to update {user_email}: {response.text}")
                        
                except Exception as e:
                    print(f"Error updating {user_email}: {e}")
    
    def generate_usage_report(self, start_date: str, end_date: str) -> Dict:
        """Generate usage report for all enterprise users."""
        response = requests.get(
            f'{self.base_url}/enterprise/usage-report',
            headers=self.headers,
            params={
                'start_date': start_date,
                'end_date': end_date,
                'format': 'detailed'
            }
        )
        
        return response.json()

# Usage example
if __name__ == "__main__":
    manager = LinkShieldEnterpriseManager(os.getenv('LINKSHIELD_API_KEY'))
    
    # Bulk create users
    results = manager.bulk_create_users('users.csv')
    print(f"Created {len(results['success'])} users successfully")
    print(f"Failed to create {len(results['failed'])} users")
    
    # Sync permissions
    manager.sync_user_permissions('permissions.csv')
    
    # Generate usage report
    report = manager.generate_usage_report('2024-01-01', '2024-01-31')
    print(f"Total API calls: {report['total_api_calls']}")
    print(f"Total users: {report['total_users']}")
```

## Testing and Debugging

### Unit Testing

```javascript
// Jest tests for LinkShield integration
const { LinkShieldAPI } = require('../src/linkshield');
const nock = require('nock');

describe('LinkShield API Integration', () => {
  let api;
  
  beforeEach(() => {
    api = new LinkShieldAPI('test-api-key');
  });
  
  afterEach(() => {
    nock.cleanAll();
  });

  describe('URL Checking', () => {
    it('should successfully check a safe URL', async () => {
      const mockResponse = {
        check_id: 'check_123',
        url: 'https://example.com',
        risk_score: 15,
        threat_level: 'SAFE',
        status: 'COMPLETED'
      };

      nock('https://api.linkshield.site')
        .post('/api/v1/url-check/check')
        .reply(200, mockResponse);

      const result = await api.checkURL('https://example.com');
      
      expect(result.risk_score).toBe(15);
      expect(result.threat_level).toBe('SAFE');
      expect(result.status).toBe('COMPLETED');
    });

    it('should handle high-risk URLs', async () => {
      const mockResponse = {
        check_id: 'check_456',
        url: 'https://malicious-site.com',
        risk_score: 95,
        threat_level: 'HIGH',
        status: 'COMPLETED'
      };

      nock('https://api.linkshield.site')
        .post('/api/v1/url-check/check')
        .reply(200, mockResponse);

      const result = await api.checkURL('https://malicious-site.com');
      
      expect(result.risk_score).toBe(95);
      expect(result.threat_level).toBe('HIGH');
    });

    it('should handle API errors gracefully', async () => {
      nock('https://api.linkshield.site')
        .post('/api/v1/url-check/check')
        .reply(500, { error: 'Internal server error' });

      await expect(api.checkURL('https://example.com'))
        .rejects.toThrow('Request failed with status code 500');
    });

    it('should handle rate limiting', async () => {
      nock('https://api.linkshield.site')
        .post('/api/v1/url-check/check')
        .reply(429, {
          error: 'rate_limit_exceeded',
          retry_after: 60
        });

      await expect(api.checkURL('https://example.com'))
        .rejects.toThrow('Request failed with status code 429');
    });
  });

  describe('Content Analysis', () => {
    it('should analyze phishing content', async () => {
      const mockResponse = {
        analysis_id: 'analysis_123',
        results: {
          phishing_score: 85,
          content_quality_score: 25,
          overall_risk: 'HIGH',
          confidence: 92
        }
      };

      nock('https://api.linkshield.site')
        .post('/api/v1/ai-analysis/analyze')
        .reply(200, mockResponse);

      const result = await api.analyzeContent('Click here to claim your prize!');
      
      expect(result.results.phishing_score).toBe(85);
      expect(result.results.overall_risk).toBe('HIGH');
    });
  });
});
```

### Integration Testing

```javascript
// Integration tests with real API (use test environment)
describe('LinkShield Integration Tests', () => {
  let api;
  
  beforeAll(() => {
    api = new LinkShieldAPI(process.env.LINKSHIELD_TEST_API_KEY);
  });

  it('should perform end-to-end URL check', async () => {
    const result = await api.checkURL('https://google.com');
    
    expect(result).toHaveProperty('check_id');
    expect(result).toHaveProperty('risk_score');
    expect(result).toHaveProperty('threat_level');
    expect(typeof result.risk_score).toBe('number');
  }, 10000); // 10 second timeout for real API calls
});
```

### Debugging Tools

```javascript
// Debug middleware for API calls
const createDebugMiddleware = (options = {}) => {
  const { logRequests = true, logResponses = true, logErrors = true } = options;
  
  return (req, res, next) => {
    if (logRequests) {
      console.log(`[LinkShield] ${req.method} ${req.url}`, {
        headers: req.headers,
        body: req.body
      });
    }

    const originalSend = res.send;
    res.send = function(data) {
      if (logResponses) {
        console.log(`[LinkShield] Response ${res.statusCode}`, data);
      }
      originalSend.call(this, data);
    };

    const originalNext = next;
    next = function(error) {
      if (error && logErrors) {
        console.error('[LinkShield] Error:', error);
      }
      originalNext.call(this, error);
    };

    next();
  };
};
```

## Performance Optimization

### Caching Strategies

```javascript
// Redis caching for URL scan results
const redis = require('redis');
const client = redis.createClient();

class CachedLinkShieldAPI {
  constructor(apiKey, cacheOptions = {}) {
    this.api = new LinkShieldAPI(apiKey);
    this.cacheTTL = cacheOptions.ttl || 3600; // 1 hour default
    this.cachePrefix = cacheOptions.prefix || 'linkshield:';
  }

  async checkURL(url, scanType = 'SECURITY') {
    const cacheKey = `${this.cachePrefix}url:${Buffer.from(url).toString('base64')}:${scanType}`;
    
    // Try cache first
    try {
      const cached = await client.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    // Fetch from API
    const result = await this.api.checkURL(url, scanType);
    
    // Cache the result (only cache safe results to avoid stale dangerous URLs)
    if (result.risk_score < 50) {
      try {
        await client.setex(cacheKey, this.cacheTTL, JSON.stringify(result));
      } catch (error) {
        console.warn('Cache write error:', error);
      }
    }

    return result;
  }
}
```

### Batch Processing

```javascript
// Batch URL checking for better performance
class BatchLinkShieldAPI {
  constructor(apiKey, batchOptions = {}) {
    this.api = new LinkShieldAPI(apiKey);
    this.batchSize = batchOptions.batchSize || 10;
    this.batchDelay = batchOptions.delay || 100; // ms between batches
  }

  async checkURLsBatch(urls) {
    const results = [];
    
    for (let i = 0; i < urls.length; i += this.batchSize) {
      const batch = urls.slice(i, i + this.batchSize);
      
      // Process batch concurrently
      const batchPromises = batch.map(url => 
        this.api.checkURL(url).catch(error => ({
          url,
          error: error.message
        }))
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Delay between batches to respect rate limits
      if (i + this.batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, this.batchDelay));
      }
    }
    
    return results;
  }
}
```

## Security Best Practices

### API Key Management

```javascript
// Secure API key storage and rotation
class SecureAPIKeyManager {
  constructor() {
    this.keyRotationInterval = 30 * 24 * 60 * 60 * 1000; // 30 days
    this.currentKey = null;
    this.backupKey = null;
  }

  async initializeKeys() {
    // Load keys from secure storage (e.g., AWS Secrets Manager)
    this.currentKey = await this.loadFromSecureStorage('linkshield-api-key-current');
    this.backupKey = await this.loadFromSecureStorage('linkshield-api-key-backup');
    
    // Schedule key rotation
    this.scheduleKeyRotation();
  }

  async rotateKeys() {
    try {
      // Generate new API key
      const newKey = await this.generateNewAPIKey();
      
      // Update keys
      this.backupKey = this.currentKey;
      this.currentKey = newKey;
      
      // Store in secure storage
      await this.storeInSecureStorage('linkshield-api-key-current', this.currentKey);
      await this.storeInSecureStorage('linkshield-api-key-backup', this.backupKey);
      
      console.log('API keys rotated successfully');
    } catch (error) {
      console.error('Key rotation failed:', error);
      // Alert operations team
      await this.alertOpsTeam('LinkShield API key rotation failed', error);
    }
  }

  getActiveKey() {
    return this.currentKey;
  }

  async makeAPICall(endpoint, data) {
    try {
      // Try with current key
      return await this.callAPI(endpoint, data, this.currentKey);
    } catch (error) {
      if (error.status === 401 && this.backupKey) {
        // Fallback to backup key
        console.warn('Current API key failed, trying backup key');
        return await this.callAPI(endpoint, data, this.backupKey);
      }
      throw error;
    }
  }
}
```

### Input Validation

```javascript
// Comprehensive input validation
const validator = require('validator');

class InputValidator {
  static validateURL(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('URL is required and must be a string');
    }

    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true
    })) {
      throw new Error('Invalid URL format');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /<script/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      throw new Error('URL contains suspicious content');
    }

    return true;
  }

  static validateContent(content) {
    if (typeof content !== 'string') {
      throw new Error('Content must be a string');
    }

    if (content.length > 50000) {
      throw new Error('Content too large (max 50KB)');
    }

    // Sanitize content
    return validator.escape(content);
  }

  static validateScanType(scanType) {
    const validTypes = ['SECURITY', 'SECURITY_REPUTATION_CONTENT', 'DEEP'];
    
    if (!validTypes.includes(scanType)) {
      throw new Error(`Invalid scan type. Must be one of: ${validTypes.join(', ')}`);
    }

    return scanType;
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Errors

**Problem:** `401 Unauthorized` responses

**Solutions:**
- Verify API key is correct and active
- Check if API key has required permissions
- Ensure proper header format: `X-API-Key: your_key`
- For JWT tokens, check expiration and refresh if needed

```javascript
// Debug authentication
const debugAuth = async (apiKey) => {
  try {
    const response = await fetch('https://api.linkshield.site/api/v1/user/profile', {
      headers: { 'X-API-Key': apiKey }
    });
    
    if (response.status === 401) {
      console.error('Authentication failed - check API key');
    } else if (response.status === 403) {
      console.error('Insufficient permissions');
    } else {
      console.log('Authentication successful');
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

#### 2. Rate Limiting Issues

**Problem:** `429 Too Many Requests` responses

**Solutions:**
- Implement exponential backoff
- Cache results to reduce API calls
- Upgrade subscription plan for higher limits
- Use batch processing for multiple URLs

#### 3. Timeout Issues

**Problem:** Requests timing out

**Solutions:**
- Increase timeout values
- Implement retry logic
- Use asynchronous processing for large batches
- Check network connectivity

```javascript
// Robust request with retry
const makeRobustRequest = async (url, options, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response.json();
      } else if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};
```

### Debugging Checklist

1. **API Credentials**
   - [ ] API key is valid and active
   - [ ] Correct authentication method used
   - [ ] Proper headers included

2. **Request Format**
   - [ ] Content-Type header set correctly
   - [ ] Request body is valid JSON
   - [ ] Required parameters included

3. **Network Issues**
   - [ ] Internet connectivity working
   - [ ] Firewall not blocking requests
   - [ ] Correct API endpoint URL

4. **Rate Limits**
   - [ ] Not exceeding rate limits
   - [ ] Proper retry logic implemented
   - [ ] Caching to reduce API calls

5. **Error Handling**
   - [ ] Proper error handling implemented
   - [ ] Logging for debugging
   - [ ] Graceful degradation on failures

### Support Resources

- **API Status Page:** [status.linkshield.com](https://status.linkshield.com)
- **Developer Documentation:** [docs.linkshield.com](https://docs.linkshield.com)
- **Community Forum:** [community.linkshield.com](https://community.linkshield.com)
- **Support Email:** api-support@linkshield.com
- **GitHub Issues:** [github.com/linkshield/api-issues](https://github.com/linkshield/api-issues)

---

## Conclusion

This integration guide provides comprehensive examples and patterns for integrating LinkShield into your applications. Remember to:

1. **Start simple** - Begin with basic URL checking and expand functionality
2. **Handle errors gracefully** - Implement proper error handling and fallbacks
3. **Respect rate limits** - Use caching and batch processing appropriately
4. **Keep security in mind** - Validate inputs and secure API credentials
5. **Monitor performance** - Track API usage and optimize as needed

For additional help or custom integration requirements, contact our support team at api-support@linkshield.com.

---

*Last updated: January 2024*
*For the most current information, visit [docs.linkshield.com](https://docs.linkshield.com)*
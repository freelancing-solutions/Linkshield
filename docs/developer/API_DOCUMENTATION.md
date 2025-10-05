# LinkShield API Documentation

The LinkShield API provides comprehensive security analysis, threat detection, and social media monitoring capabilities. This documentation covers all available endpoints, authentication methods, and integration patterns.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
6. [Request/Response Formats](#requestresponse-formats)
7. [Code Examples](#code-examples)
8. [Best Practices](#best-practices)
9. [SDKs and Libraries](#sdks-and-libraries)

## API Overview

**Base URL:** `https://api.linkshield.site/api/v1`

**API Version:** v1

**Content Type:** `application/json`

**Response Format:** JSON

The LinkShield API is organized around REST principles with predictable resource-oriented URLs. It uses standard HTTP response codes and authentication methods.

### Key Features
- **URL Security Analysis** - Comprehensive threat detection and reputation checking
- **AI-Powered Content Analysis** - Advanced phishing and malware detection
- **Social Media Protection** - Algorithm health monitoring and visibility analysis
- **Community Reports** - Crowdsourced threat intelligence
- **Real-time Monitoring** - Automated alerts and notifications
- **Team Collaboration** - Multi-user project management

## Authentication

LinkShield API supports two authentication methods:

### 1. Bearer Token Authentication (Recommended)

Used for user-specific operations and dashboard access.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

**Getting a Token:**
```bash
curl -X POST https://api.linkshield.site/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_password",
    "device_info": {
      "browser": "Chrome/120.0",
      "os": "Windows 10"
    }
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "subscription_plan": {
      "name": "professional",
      "display_name": "Professional"
    }
  },
  "session_id": "session_456"
}
```

### 2. API Key Authentication

Used for server-to-server integrations and automated systems.

```http
X-API-Key: YOUR_API_KEY
```

**Creating API Keys:**
API keys can be created through the dashboard or via the API:

```bash
curl -X POST https://api.linkshield.site/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Integration",
    "permissions": ["url_check", "ai_analysis"],
    "expires_at": "2024-12-31T23:59:59Z"
  }'
```

### Token Expiration and Refresh

JWT tokens expire after 1 hour. Implement token refresh logic:

```javascript
// Check if token is expired
const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return Date.now() >= payload.exp * 1000;
};

// Refresh token before expiration
if (isTokenExpired(currentToken)) {
  const newToken = await refreshToken();
  // Update stored token
}
```

## Rate Limiting

API requests are rate-limited based on your subscription plan:

| Plan | Requests/Hour | Burst Limit |
|------|---------------|-------------|
| Free | 100 | 10 |
| Starter | 1,000 | 50 |
| Professional | 10,000 | 200 |
| Business | 50,000 | 500 |
| Enterprise | Unlimited | 1,000 |

### Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 3600
```

### Handling Rate Limits

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "rate_limit_exceeded",
  "message": "API rate limit exceeded",
  "retry_after": 3600,
  "limit": 1000,
  "remaining": 0,
  "reset_at": "2024-01-01T12:00:00Z"
}
```

**Best Practice:** Implement exponential backoff:

```javascript
const makeRequestWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-RateLimit-Retry-After');
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};
```

## Error Handling

The API uses conventional HTTP response codes:

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Temporary service issue |

### Error Response Format

```json
{
  "error": "validation_error",
  "message": "The request contains invalid parameters",
  "details": {
    "url": ["URL is required and must be valid"],
    "scan_type": ["Must be one of: SECURITY, SECURITY_REPUTATION_CONTENT, DEEP"]
  },
  "request_id": "req_123456789",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Common Error Types

- `authentication_error` - Invalid or missing authentication
- `authorization_error` - Insufficient permissions
- `validation_error` - Invalid request parameters
- `rate_limit_exceeded` - Too many requests
- `resource_not_found` - Requested resource doesn't exist
- `service_unavailable` - Temporary service issue
- `quota_exceeded` - Usage limits exceeded

## API Endpoints

### Authentication Endpoints

#### POST /user/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "full_name": "John Doe",
  "company": "Acme Corp",
  "accept_terms": true,
  "marketing_consent": false
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful. Please check your email for verification.",
  "user_id": "user_123"
}
```

#### POST /user/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "remember_me": true,
  "device_info": {
    "browser": "Chrome/120.0",
    "os": "Windows 10",
    "screen_resolution": "1920x1080"
  }
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "full_name": "John Doe",
    "subscription_plan": {
      "name": "professional",
      "display_name": "Professional"
    }
  },
  "session_id": "session_456"
}
```

#### POST /user/logout
Logout current user session.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`

#### POST /user/verify-email
Verify email address with token.

**Request:**
```json
{
  "token": "verification_token_here"
}
```

#### GET /user/profile
Get current user profile.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "company": "Acme Corp",
  "role": "USER",
  "subscription_plan": {
    "name": "professional",
    "display_name": "Professional",
    "limits": {
      "url_checks_per_day": 1000,
      "api_calls_per_day": 10000
    }
  },
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### URL Checking Endpoints

#### POST /url-check/check
Analyze a URL for security threats.

**Headers:** `Authorization: Bearer TOKEN` or `X-API-Key: API_KEY`

**Request:**
```json
{
  "url": "https://example.com",
  "scan_type": "SECURITY_REPUTATION_CONTENT",
  "include_broken_links": true
}
```

**Scan Types:**
- `SECURITY` - Basic security scan
- `SECURITY_REPUTATION_CONTENT` - Security + reputation + content analysis
- `DEEP` - Comprehensive analysis including broken links

**Response:** `200 OK`
```json
{
  "check_id": "check_123456",
  "url": "https://example.com",
  "risk_score": 15,
  "threat_level": "SAFE",
  "scan_type": "SECURITY_REPUTATION_CONTENT",
  "status": "COMPLETED",
  "scanned_at": "2024-01-01T12:00:00Z",
  "providers": [
    {
      "provider": "VirusTotal",
      "status": "CLEAN",
      "details": "No threats detected",
      "confidence_score": 95,
      "checked_at": "2024-01-01T12:00:00Z"
    }
  ],
  "reputation": {
    "domain_age": 2555,
    "trust_score": 85,
    "category": "Technology",
    "popularity_rank": 1000
  },
  "content_analysis": {
    "has_forms": false,
    "external_links": 5,
    "suspicious_keywords": [],
    "ssl_certificate": {
      "valid": true,
      "issuer": "Let's Encrypt",
      "expires_at": "2024-06-01T00:00:00Z"
    }
  }
}
```

#### GET /url-check/reputation/{domain}
Get domain reputation information.

**Headers:** `Authorization: Bearer TOKEN` or `X-API-Key: API_KEY`

**Response:** `200 OK`
```json
{
  "domain": "example.com",
  "trust_score": 85,
  "category": "Technology",
  "domain_age": 2555,
  "popularity_rank": 1000,
  "ssl_grade": "A+",
  "security_flags": [],
  "last_updated": "2024-01-01T12:00:00Z"
}
```

### AI Analysis Endpoints

#### POST /ai-analysis/analyze
Analyze content using AI for threats and quality.

**Headers:** `Authorization: Bearer TOKEN` or `X-API-Key: API_KEY`

**Request:**
```json
{
  "content": "Check out this amazing deal! Click here to claim your prize!",
  "content_type": "text",
  "url": "https://suspicious-site.com",
  "analysis_types": ["phishing", "content_quality", "manipulation"]
}
```

**Response:** `200 OK`
```json
{
  "analysis_id": "analysis_123",
  "content_hash": "sha256_hash",
  "results": {
    "phishing_score": 85,
    "content_quality_score": 25,
    "manipulation_score": 90,
    "overall_risk": "HIGH",
    "confidence": 92
  },
  "threats_detected": [
    {
      "type": "phishing",
      "description": "Contains typical phishing language patterns",
      "confidence": 88,
      "indicators": ["urgency", "prize_claim", "suspicious_link"]
    }
  ],
  "analyzed_at": "2024-01-01T12:00:00Z"
}
```

### Social Protection Endpoints

#### GET /social-protection/extension/status
Get browser extension connection status.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`
```json
{
  "status": "CONNECTED",
  "version": "1.2.3",
  "last_seen": "2024-01-01T12:00:00Z",
  "platforms_connected": ["twitter", "instagram"],
  "features_enabled": ["visibility_monitoring", "engagement_tracking"]
}
```

#### GET /social-protection/analytics
Get social media analytics data.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `time_range` - `24h`, `7d`, `30d`, `90d`
- `platform` - `twitter`, `instagram`, `facebook`, `linkedin`

**Response:** `200 OK`
```json
{
  "time_range": "7d",
  "algorithm_health": {
    "overall_score": 78,
    "visibility_score": 82,
    "engagement_score": 74,
    "penalty_risk": "LOW"
  },
  "metrics": {
    "posts_analyzed": 45,
    "visibility_changes": [
      {
        "date": "2024-01-01",
        "score": 85,
        "change": "+5"
      }
    ],
    "engagement_trends": {
      "likes": 1250,
      "comments": 89,
      "shares": 34
    }
  }
}
```

### Community Reports Endpoints

#### POST /reports
Submit a new community report.

**Headers:** `Authorization: Bearer TOKEN`

**Request:**
```json
{
  "url": "https://suspicious-site.com",
  "report_type": "phishing",
  "description": "Fake PayPal login page attempting to steal credentials",
  "evidence": [
    {
      "type": "screenshot",
      "url": "https://storage.linkshield.com/evidence/screenshot_123.png"
    }
  ],
  "threat_level": "HIGH",
  "visibility": "public"
}
```

**Response:** `201 Created`
```json
{
  "report_id": "report_123",
  "status": "submitted",
  "submitted_at": "2024-01-01T12:00:00Z",
  "estimated_review_time": "24-48 hours"
}
```

#### GET /reports
List community reports.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Results per page (default: 20, max: 100)
- `type` - Filter by report type
- `status` - Filter by status (`submitted`, `verified`, `rejected`)
- `sort` - Sort by (`created_at`, `votes`, `threat_level`)

**Response:** `200 OK`
```json
{
  "reports": [
    {
      "id": "report_123",
      "url": "https://suspicious-site.com",
      "type": "phishing",
      "threat_level": "HIGH",
      "status": "verified",
      "votes": {
        "helpful": 15,
        "not_helpful": 2
      },
      "submitted_at": "2024-01-01T12:00:00Z",
      "verified_at": "2024-01-02T08:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Dashboard Endpoints

#### GET /dashboard/overview
Get dashboard overview statistics.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`
```json
{
  "stats": {
    "total_scans": 1250,
    "threats_blocked": 45,
    "active_projects": 8,
    "team_members": 5
  },
  "recent_activity": [
    {
      "type": "url_check",
      "url": "https://example.com",
      "result": "safe",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ],
  "alerts": [
    {
      "id": "alert_123",
      "type": "threat_detected",
      "message": "High-risk URL detected in project monitoring",
      "severity": "high",
      "created_at": "2024-01-01T11:30:00Z"
    }
  ]
}
```

### Subscription Endpoints

#### GET /subscriptions
Get user subscriptions.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`
```json
[
  {
    "id": "sub_123",
    "plan": {
      "name": "professional",
      "display_name": "Professional",
      "monthly_price": 29.99,
      "limits": {
        "url_checks_per_day": 1000,
        "api_calls_per_day": 10000
      }
    },
    "status": "ACTIVE",
    "current_period_start": "2024-01-01T00:00:00Z",
    "current_period_end": "2024-02-01T00:00:00Z",
    "cancel_at_period_end": false
  }
]
```

#### GET /subscriptions/{id}/usage
Get subscription usage statistics.

**Headers:** `Authorization: Bearer TOKEN`

**Response:** `200 OK`
```json
{
  "subscription_id": "sub_123",
  "current_period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-02-01T00:00:00Z",
    "days_remaining": 15
  },
  "usage": {
    "url_checks": 450,
    "ai_analyses": 120,
    "api_calls": 2500
  },
  "limits": {
    "url_checks": 1000,
    "ai_analyses": 500,
    "api_calls": 10000
  },
  "percentage_used": {
    "url_checks": 45,
    "ai_analyses": 24,
    "api_calls": 25
  }
}
```

## Request/Response Formats

### Content Types
- **Request:** `application/json`
- **Response:** `application/json`
- **File Uploads:** `multipart/form-data`

### Date Formats
All timestamps use ISO 8601 format: `2024-01-01T12:00:00Z`

### Pagination
List endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### Filtering and Sorting
Many endpoints support filtering and sorting:

```
GET /reports?type=phishing&status=verified&sort=created_at&order=desc
```

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

class LinkShieldAPI {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: 'https://api.linkshield.site/api/v1',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async checkURL(url, scanType = 'SECURITY') {
    try {
      const response = await this.client.post('/url-check/check', {
        url,
        scan_type: scanType
      });
      return response.data;
    } catch (error) {
      console.error('URL check failed:', error.response?.data);
      throw error;
    }
  }

  async analyzeContent(content, analysisTypes = ['phishing']) {
    const response = await this.client.post('/ai-analysis/analyze', {
      content,
      analysis_types: analysisTypes
    });
    return response.data;
  }
}

// Usage
const api = new LinkShieldAPI('your_api_key');

// Check a URL
const result = await api.checkURL('https://example.com', 'DEEP');
console.log('Risk score:', result.risk_score);

// Analyze content
const analysis = await api.analyzeContent('Suspicious email content');
console.log('Phishing score:', analysis.results.phishing_score);
```

### Python

```python
import requests
import json
from typing import Dict, Any, Optional

class LinkShieldAPI:
    def __init__(self, api_key: str):
        self.base_url = 'https://api.linkshield.site/api/v1'
        self.headers = {
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        }
    
    def check_url(self, url: str, scan_type: str = 'SECURITY') -> Dict[str, Any]:
        """Check a URL for security threats."""
        response = requests.post(
            f'{self.base_url}/url-check/check',
            headers=self.headers,
            json={
                'url': url,
                'scan_type': scan_type
            }
        )
        response.raise_for_status()
        return response.json()
    
    def analyze_content(self, content: str, analysis_types: list = None) -> Dict[str, Any]:
        """Analyze content using AI."""
        if analysis_types is None:
            analysis_types = ['phishing']
        
        response = requests.post(
            f'{self.base_url}/ai-analysis/analyze',
            headers=self.headers,
            json={
                'content': content,
                'analysis_types': analysis_types
            }
        )
        response.raise_for_status()
        return response.json()

# Usage
api = LinkShieldAPI('your_api_key')

# Check URL
result = api.check_url('https://example.com', 'DEEP')
print(f"Risk score: {result['risk_score']}")

# Analyze content
analysis = api.analyze_content('Suspicious email content')
print(f"Phishing score: {analysis['results']['phishing_score']}")
```

### cURL Examples

```bash
# Check a URL
curl -X POST https://api.linkshield.site/api/v1/url-check/check \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "scan_type": "SECURITY_REPUTATION_CONTENT"
  }'

# Get user profile
curl -X GET https://api.linkshield.site/api/v1/user/profile \
  -H "Authorization: Bearer your_jwt_token"

# Submit a report
curl -X POST https://api.linkshield.site/api/v1/reports \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://suspicious-site.com",
    "report_type": "phishing",
    "description": "Fake login page",
    "threat_level": "HIGH"
  }'
```

## Best Practices

### 1. Authentication Management
- **Store tokens securely** - Never expose API keys in client-side code
- **Implement token refresh** - Handle token expiration gracefully
- **Use environment variables** - Store credentials in environment variables
- **Rotate API keys regularly** - Update keys periodically for security

### 2. Error Handling
- **Check response status** - Always verify HTTP status codes
- **Handle rate limits** - Implement exponential backoff for 429 responses
- **Log errors appropriately** - Log errors without exposing sensitive data
- **Provide user feedback** - Show meaningful error messages to users

### 3. Performance Optimization
- **Cache responses** - Cache non-sensitive data to reduce API calls
- **Use batch operations** - Combine multiple requests when possible
- **Implement pagination** - Handle large datasets efficiently
- **Monitor usage** - Track API usage to optimize performance

### 4. Security Considerations
- **Validate input** - Sanitize all user input before API calls
- **Use HTTPS only** - Never make API calls over HTTP
- **Implement request signing** - Add request signatures for sensitive operations
- **Monitor for anomalies** - Watch for unusual API usage patterns

### 5. Integration Patterns
- **Webhook integration** - Use webhooks for real-time notifications
- **Asynchronous processing** - Handle long-running operations asynchronously
- **Graceful degradation** - Continue operation when API is unavailable
- **Circuit breaker pattern** - Prevent cascading failures

## SDKs and Libraries

### Official SDKs

#### JavaScript/TypeScript SDK
```bash
npm install @linkshield/sdk
```

```javascript
import { LinkShield } from '@linkshield/sdk';

const client = new LinkShield({
  apiKey: 'your_api_key',
  environment: 'production' // or 'sandbox'
});

const result = await client.urlCheck.scan('https://example.com');
```

#### Python SDK (Coming Soon)
```bash
pip install linkshield-python
```

### Community Libraries
- **PHP SDK** - Community-maintained PHP library
- **Ruby Gem** - Community-maintained Ruby library
- **Go Package** - Community-maintained Go package

### Building Your Own Client

When building a custom client library:

1. **Handle authentication** - Support both JWT and API key auth
2. **Implement retry logic** - Handle rate limits and temporary failures
3. **Support pagination** - Handle paginated responses automatically
4. **Provide type definitions** - Include TypeScript definitions
5. **Add request/response logging** - Support debugging and monitoring

---

## Support and Resources

### Documentation
- **[Integration Guide](INTEGRATION_GUIDE.md)** - Detailed integration patterns
- **[Feature Documentation](../features/)** - Feature-specific guides
- **[User Guides](../user-guides/)** - End-user documentation

### Community
- **Developer Forum** - Community discussions and support
- **GitHub Repository** - SDK source code and issues
- **Stack Overflow** - Tag questions with `linkshield-api`

### Support Channels
- **Email Support** - api-support@linkshield.com
- **Documentation Issues** - Report documentation problems
- **Feature Requests** - Request new API features

---

*Last updated: January 2024*
*API Version: v1*
*For the most current information, visit [docs.linkshield.com](https://docs.linkshield.com)*
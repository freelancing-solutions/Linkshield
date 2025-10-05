# How to Manage API Keys

API keys are essential for integrating LinkShield's security capabilities into your applications, scripts, and third-party tools. This guide covers everything you need to know about creating, managing, and securing your API keys.

## Table of Contents

1. [API Key Overview](#api-key-overview)
2. [Creating API Keys](#creating-api-keys)
3. [API Key Types and Permissions](#api-key-types-and-permissions)
4. [Managing Existing Keys](#managing-existing-keys)
5. [Security Best Practices](#security-best-practices)
6. [Using API Keys](#using-api-keys)
7. [Rate Limits and Usage](#rate-limits-and-usage)
8. [Monitoring API Usage](#monitoring-api-usage)
9. [Troubleshooting](#troubleshooting)
10. [API Key Rotation](#api-key-rotation)

---

## API Key Overview

### What are API Keys?

API keys are unique identifiers that authenticate your applications when making requests to LinkShield's API. They serve as both identification and authorization, ensuring that only authorized users can access your account's data and features.

### Why Use API Keys?

**Benefits of API Integration:**
- **Automation** - Integrate security scanning into your workflows
- **Bulk Operations** - Process multiple URLs or content simultaneously
- **Real-time Protection** - Build custom security solutions
- **Data Integration** - Connect LinkShield with your existing tools
- **Custom Applications** - Develop tailored security applications

### API Key vs Other Authentication

**API Key Authentication:**
- ✅ Simple to implement
- ✅ Perfect for server-to-server communication
- ✅ Long-lived credentials
- ✅ Fine-grained permissions

**JWT Token Authentication:**
- ✅ Better for user-facing applications
- ✅ Short-lived and automatically refreshed
- ✅ Includes user context
- ❌ More complex implementation

---

## Creating API Keys

### Step-by-Step Creation Process

1. **Access API Key Management**
   - Log in to your LinkShield dashboard
   - Navigate to **Profile Settings** → **API Keys**
   - Click **"Create New API Key"**

2. **Configure Key Settings**
   - **Key Name** - Descriptive name for identification
   - **Description** - Optional details about the key's purpose
   - **Permissions** - Select specific API access levels
   - **Expiration** - Set automatic expiration date (optional)
   - **IP Restrictions** - Limit access to specific IP addresses (optional)

3. **Generate and Secure Key**
   - Click **"Generate Key"**
   - **Copy the key immediately** - it won't be shown again
   - Store the key securely in your password manager
   - Test the key with a simple API call

### Key Naming Best Practices

**Descriptive Names:**
- `production-web-scanner` - Production website integration
- `dev-testing-environment` - Development and testing
- `mobile-app-ios` - iOS mobile application
- `backup-automation-script` - Automated backup processes
- `team-shared-analytics` - Shared team analytics tool

**Avoid Generic Names:**
- ❌ `api-key-1`
- ❌ `test`
- ❌ `my-key`
- ❌ `temp`

### Initial Key Configuration

**Required Information:**
- **Key Name** - Unique identifier within your account
- **Purpose Description** - What the key will be used for
- **Permission Level** - Scope of API access needed

**Optional Security Settings:**
- **IP Whitelist** - Restrict to specific IP addresses
- **Expiration Date** - Automatic key deactivation
- **Usage Limits** - Custom rate limiting
- **Webhook URLs** - Notification endpoints for key events

---

## API Key Types and Permissions

### Permission Levels

**Read-Only Access:**
- View scan results and history
- Access account information
- Retrieve analytics and reports
- Check subscription status

**Standard Access:**
- All read-only permissions
- Perform URL scans
- Submit content for AI analysis
- Create and manage projects
- Generate reports

**Full Access:**
- All standard permissions
- Manage account settings
- Create and delete API keys
- Manage team members
- Access billing information

**Admin Access:**
- All full access permissions
- Manage organization settings
- Access audit logs
- Configure enterprise features
- Manage security policies

### Granular Permissions

**URL Scanning:**
- `url:scan` - Perform URL security scans
- `url:bulk` - Bulk URL scanning capabilities
- `url:history` - Access scan history and results

**AI Analysis:**
- `ai:analyze` - Submit content for AI analysis
- `ai:results` - Retrieve analysis results
- `ai:models` - Access different AI models

**Social Protection:**
- `social:monitor` - Monitor social media accounts
- `social:alerts` - Receive social media alerts
- `social:analytics` - Access social media analytics

**Account Management:**
- `account:read` - View account information
- `account:write` - Modify account settings
- `billing:read` - View billing information
- `team:manage` - Manage team members

### Subscription-Based Limitations

**Free Tier:**
- Maximum 2 API keys
- Read-only and basic scanning permissions only
- 100 API calls per day
- No IP restrictions or advanced features

**Pro Tier:**
- Maximum 5 API keys
- Standard access permissions
- 10,000 API calls per day
- Basic IP restrictions

**Business Tier:**
- Maximum 20 API keys
- Full access permissions
- 100,000 API calls per day
- Advanced security features

**Enterprise Tier:**
- Unlimited API keys
- Admin access permissions
- Custom rate limits
- Advanced security and compliance features

---

## Managing Existing Keys

### API Key Dashboard

The API Key management dashboard provides:

**Key Overview:**
- **Active Keys** - Currently valid and usable keys
- **Expired Keys** - Keys that have reached expiration date
- **Revoked Keys** - Manually disabled keys
- **Usage Statistics** - Recent activity and usage patterns

**Key Details:**
- **Creation Date** - When the key was generated
- **Last Used** - Most recent API call timestamp
- **Usage Count** - Total number of API calls made
- **Permission Scope** - Current access levels
- **Security Settings** - IP restrictions and other limitations

### Editing API Keys

**Modifiable Settings:**
- **Key Name** - Update descriptive name
- **Description** - Change purpose description
- **Permissions** - Modify access levels (restrictions apply)
- **IP Restrictions** - Add or remove IP address limitations
- **Expiration Date** - Extend or set expiration

**Non-Modifiable Settings:**
- **Key Value** - The actual API key string cannot be changed
- **Creation Date** - Historical timestamp is immutable
- **Usage History** - Past usage statistics are preserved

### Key Status Management

**Active Keys:**
- ✅ **Active** - Key is valid and can make API calls
- ⏸️ **Suspended** - Temporarily disabled, can be reactivated
- ❌ **Revoked** - Permanently disabled, cannot be reactivated
- ⏰ **Expired** - Reached expiration date, can be renewed

**Status Actions:**
- **Suspend Key** - Temporarily disable without deletion
- **Reactivate Key** - Re-enable suspended key
- **Revoke Key** - Permanently disable key
- **Extend Expiration** - Update expiration date
- **Delete Key** - Remove key from account (irreversible)

---

## Security Best Practices

### Key Storage and Handling

**Secure Storage:**
- **Use Environment Variables** - Store keys in environment variables, not code
- **Password Managers** - Use dedicated password management tools
- **Encrypted Storage** - Encrypt keys when storing in databases
- **Access Controls** - Limit who can access stored keys

**Never Store Keys In:**
- ❌ Source code repositories
- ❌ Configuration files committed to version control
- ❌ Client-side JavaScript
- ❌ Public documentation or wikis
- ❌ Unencrypted databases
- ❌ Log files or error messages

### Code Implementation Security

**Environment Variables Example:**
```bash
# .env file (never commit to version control)
LINKSHIELD_API_KEY=your_api_key_here
LINKSHIELD_BASE_URL=https://api.linkshield.site
```

**Secure Code Implementation:**
```javascript
// Good: Using environment variables
const apiKey = process.env.LINKSHIELD_API_KEY;

// Bad: Hardcoded in source code
const apiKey = 'ls_1234567890abcdef'; // Never do this!

// Good: Proper error handling without exposing keys
try {
  const response = await fetch(apiUrl, {
    headers: { 'X-API-Key': apiKey }
  });
} catch (error) {
  console.error('API request failed:', error.message); // Don't log the key
}
```

### Network Security

**HTTPS Only:**
- Always use HTTPS endpoints for API calls
- Never send API keys over unencrypted connections
- Verify SSL certificates in production

**IP Restrictions:**
- Limit API key usage to specific IP addresses
- Use VPN or fixed IP addresses for server applications
- Regularly review and update IP whitelists

**Request Headers:**
```javascript
// Correct header format
headers: {
  'X-API-Key': 'your_api_key_here',
  'Content-Type': 'application/json',
  'User-Agent': 'YourApp/1.0'
}
```

### Access Control

**Principle of Least Privilege:**
- Grant only the minimum permissions required
- Use separate keys for different applications
- Regularly review and reduce permissions

**Key Segregation:**
- **Production Keys** - Separate keys for live environments
- **Development Keys** - Different keys for testing
- **Team Keys** - Individual keys for team members
- **Service Keys** - Dedicated keys for automated services

---

## Using API Keys

### Authentication Methods

**Header Authentication (Recommended):**
```javascript
const response = await fetch('https://api.linkshield.site/api/v1/url-check', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    scan_type: 'SECURITY'
  })
});
```

**Query Parameter (Not Recommended):**
```javascript
// Avoid this method - keys may be logged
const url = 'https://api.linkshield.site/api/v1/url-check?api_key=your_key';
```

### Common API Operations

**URL Scanning:**
```javascript
async function scanURL(url, scanType = 'SECURITY') {
  try {
    const response = await fetch('https://api.linkshield.site/api/v1/url-check', {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.LINKSHIELD_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        scan_type: scanType
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('URL scan failed:', error.message);
    throw error;
  }
}
```

**AI Content Analysis:**
```javascript
async function analyzeContent(content, analysisType = 'PHISHING') {
  const response = await fetch('https://api.linkshield.site/api/v1/ai-analysis/analyze', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.LINKSHIELD_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: content,
      analysis_type: analysisType
    })
  });

  return await response.json();
}
```

**Bulk Operations:**
```javascript
async function bulkScanURLs(urls) {
  const response = await fetch('https://api.linkshield.site/api/v1/url-check/bulk', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.LINKSHIELD_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urls: urls,
      scan_type: 'SECURITY'
    })
  });

  return await response.json();
}
```

### Error Handling

**Common HTTP Status Codes:**
- **200** - Success
- **400** - Bad Request (invalid parameters)
- **401** - Unauthorized (invalid or missing API key)
- **403** - Forbidden (insufficient permissions)
- **429** - Too Many Requests (rate limit exceeded)
- **500** - Internal Server Error

**Robust Error Handling:**
```javascript
async function makeAPIRequest(endpoint, data) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.LINKSHIELD_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        attempt++;
        continue;
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}
```

---

## Rate Limits and Usage

### Understanding Rate Limits

**Rate Limit Structure:**
- **Requests per minute** - Short-term burst protection
- **Requests per hour** - Medium-term usage control
- **Requests per day** - Daily usage quotas
- **Concurrent requests** - Simultaneous request limits

**Subscription-Based Limits:**

**Free Tier:**
- 10 requests per minute
- 100 requests per hour
- 1,000 requests per day
- 2 concurrent requests

**Pro Tier:**
- 60 requests per minute
- 1,000 requests per hour
- 10,000 requests per day
- 5 concurrent requests

**Business Tier:**
- 300 requests per minute
- 5,000 requests per hour
- 100,000 requests per day
- 20 concurrent requests

**Enterprise Tier:**
- Custom limits based on agreement
- Dedicated infrastructure available
- Burst capacity for peak usage

### Rate Limit Headers

**Response Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

**Header Meanings:**
- `X-RateLimit-Limit` - Total requests allowed in current window
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Unix timestamp when limit resets
- `X-RateLimit-Retry-After` - Seconds to wait before retrying (when rate limited)

### Optimizing API Usage

**Efficient Request Patterns:**
- **Batch Requests** - Combine multiple operations
- **Caching** - Store results to avoid duplicate requests
- **Conditional Requests** - Use ETags and If-Modified-Since headers
- **Pagination** - Request data in smaller chunks

**Request Optimization Example:**
```javascript
class LinkShieldAPIClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.cache = new Map();
    this.cacheTTL = options.cacheTTL || 300000; // 5 minutes
    this.requestQueue = [];
    this.processing = false;
  }

  async scanURL(url, useCache = true) {
    const cacheKey = `url:${url}`;
    
    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
    }

    // Make API request
    const result = await this.makeRequest('/api/v1/url-check', {
      url: url,
      scan_type: 'SECURITY'
    });

    // Cache result
    if (useCache) {
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    }

    return result;
  }

  async makeRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ endpoint, data, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.requestQueue.length > 0) {
      const { endpoint, data, resolve, reject } = this.requestQueue.shift();

      try {
        const response = await fetch(`https://api.linkshield.site${endpoint}`, {
          method: 'POST',
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.status === 429) {
          // Rate limited - put request back and wait
          this.requestQueue.unshift({ endpoint, data, resolve, reject });
          const retryAfter = response.headers.get('Retry-After') || 60;
          await new Promise(r => setTimeout(r, retryAfter * 1000));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        resolve(result);

        // Small delay between requests to avoid hitting rate limits
        await new Promise(r => setTimeout(r, 100));
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}
```

---

## Monitoring API Usage

### Usage Dashboard

The API usage dashboard provides:

**Real-time Metrics:**
- **Current Usage** - Requests made in current period
- **Remaining Quota** - Available requests before limit
- **Rate Limit Status** - Current rate limiting state
- **Error Rates** - Failed request percentages

**Historical Analytics:**
- **Usage Trends** - Daily, weekly, monthly usage patterns
- **Peak Usage Times** - Identify high-traffic periods
- **Error Analysis** - Common error types and frequencies
- **Performance Metrics** - Response times and success rates

### Usage Alerts

**Alert Types:**
- **Quota Warnings** - When approaching usage limits
- **Rate Limit Alerts** - When hitting rate limits frequently
- **Error Rate Alerts** - When error rates exceed thresholds
- **Unusual Activity** - Unexpected usage patterns

**Alert Configuration:**
- **Threshold Settings** - Customize alert triggers
- **Notification Channels** - Email, SMS, webhook notifications
- **Alert Frequency** - Immediate, hourly, or daily summaries
- **Team Notifications** - Share alerts with team members

### Usage Optimization

**Identifying Inefficiencies:**
- **Duplicate Requests** - Same URLs scanned multiple times
- **Unnecessary Calls** - Requests that could be cached
- **Error Patterns** - Repeated failed requests
- **Timing Issues** - Requests during high-traffic periods

**Optimization Strategies:**
- **Implement Caching** - Reduce redundant API calls
- **Batch Processing** - Combine multiple operations
- **Error Handling** - Proper retry logic with backoff
- **Load Distribution** - Spread requests across time periods

---

## Troubleshooting

### Common API Key Issues

**401 Unauthorized Errors:**

**Possible Causes:**
- Invalid or expired API key
- Incorrect header format
- Key revoked or suspended
- Account subscription expired

**Solutions:**
1. **Verify Key Format** - Ensure key is copied correctly
2. **Check Key Status** - Confirm key is active in dashboard
3. **Review Headers** - Use correct `X-API-Key` header
4. **Test with cURL** - Isolate application-specific issues

```bash
# Test API key with cURL
curl -X POST https://api.linkshield.site/api/v1/url-check \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com", "scan_type": "SECURITY"}'
```

**403 Forbidden Errors:**

**Possible Causes:**
- Insufficient permissions for requested operation
- IP address not in whitelist
- Subscription tier doesn't include feature
- Account suspended or restricted

**Solutions:**
1. **Check Permissions** - Verify key has required access level
2. **Review IP Restrictions** - Ensure request comes from allowed IP
3. **Upgrade Subscription** - Access higher-tier features
4. **Contact Support** - Resolve account restrictions

**429 Rate Limit Errors:**

**Immediate Actions:**
1. **Implement Backoff** - Wait before retrying requests
2. **Check Usage** - Review current quota consumption
3. **Optimize Requests** - Reduce unnecessary API calls
4. **Upgrade Plan** - Increase rate limits if needed

**Long-term Solutions:**
- **Caching Strategy** - Store results to reduce requests
- **Request Batching** - Combine multiple operations
- **Load Balancing** - Distribute requests over time
- **Multiple Keys** - Use different keys for different services

### Debugging API Requests

**Request Debugging Checklist:**

1. **Verify Endpoint URL** - Ensure correct API endpoint
2. **Check HTTP Method** - Use correct method (GET, POST, etc.)
3. **Validate Headers** - Include all required headers
4. **Inspect Request Body** - Ensure valid JSON format
5. **Review Response** - Analyze error messages and status codes

**Debug Logging Example:**
```javascript
class DebugAPIClient {
  constructor(apiKey, debug = false) {
    this.apiKey = apiKey;
    this.debug = debug;
  }

  async makeRequest(endpoint, data) {
    const url = `https://api.linkshield.site${endpoint}`;
    const options = {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    if (this.debug) {
      console.log('API Request:', {
        url,
        method: options.method,
        headers: { ...options.headers, 'X-API-Key': '[REDACTED]' },
        body: options.body
      });
    }

    try {
      const response = await fetch(url, options);
      
      if (this.debug) {
        console.log('API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
      }

      const result = await response.json();
      
      if (this.debug) {
        console.log('Response Body:', result);
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return result;
    } catch (error) {
      if (this.debug) {
        console.error('API Request Failed:', error);
      }
      throw error;
    }
  }
}
```

### Performance Issues

**Slow Response Times:**

**Diagnostic Steps:**
1. **Network Latency** - Test from different locations
2. **Request Size** - Reduce payload size if possible
3. **Server Load** - Check API status page
4. **Client Performance** - Profile application performance

**Optimization Techniques:**
- **Connection Pooling** - Reuse HTTP connections
- **Compression** - Enable gzip compression
- **CDN Usage** - Use geographically closer endpoints
- **Async Processing** - Don't block on API responses

**Timeout Configuration:**
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

try {
  const response = await fetch(apiUrl, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  return await response.json();
} catch (error) {
  clearTimeout(timeoutId);
  if (error.name === 'AbortError') {
    throw new Error('Request timeout');
  }
  throw error;
}
```

---

## API Key Rotation

### Why Rotate API Keys?

**Security Benefits:**
- **Limit Exposure Window** - Reduce impact of compromised keys
- **Compliance Requirements** - Meet security policy requirements
- **Access Control** - Remove access for departed team members
- **Incident Response** - Quickly revoke potentially compromised keys

**Recommended Rotation Schedule:**
- **High-Security Environments** - Every 30-60 days
- **Standard Environments** - Every 90-180 days
- **Development Keys** - Every 6-12 months
- **Emergency Rotation** - Immediately upon suspected compromise

### Rotation Process

**Preparation Phase:**
1. **Inventory Current Keys** - Document all active API keys
2. **Identify Dependencies** - Map keys to applications and services
3. **Plan Rotation Schedule** - Coordinate with development teams
4. **Prepare New Keys** - Generate replacement keys with same permissions

**Rotation Phase:**
1. **Generate New Key** - Create replacement with identical permissions
2. **Update Applications** - Deploy new key to all dependent systems
3. **Test Functionality** - Verify all integrations work with new key
4. **Monitor Usage** - Ensure new key is being used correctly
5. **Revoke Old Key** - Disable old key after successful transition

**Verification Phase:**
1. **Confirm Zero Usage** - Verify old key has no remaining usage
2. **Test Error Handling** - Ensure applications handle key changes gracefully
3. **Update Documentation** - Record rotation in security logs
4. **Schedule Next Rotation** - Plan future rotation dates

### Automated Rotation

**Rotation Script Example:**
```javascript
class APIKeyRotator {
  constructor(linkshieldClient, keyManager) {
    this.client = linkshieldClient;
    this.keyManager = keyManager;
  }

  async rotateKey(keyId, applications) {
    try {
      // Step 1: Generate new key
      console.log('Generating new API key...');
      const newKey = await this.client.createAPIKey({
        name: `rotated-${Date.now()}`,
        permissions: await this.getKeyPermissions(keyId),
        expiration: this.calculateExpiration()
      });

      // Step 2: Update applications
      console.log('Updating applications...');
      for (const app of applications) {
        await this.updateApplicationKey(app, newKey.key);
        await this.testApplicationHealth(app);
      }

      // Step 3: Monitor transition
      console.log('Monitoring key usage...');
      await this.monitorKeyTransition(keyId, newKey.id, 300000); // 5 minutes

      // Step 4: Revoke old key
      console.log('Revoking old key...');
      await this.client.revokeAPIKey(keyId);

      // Step 5: Cleanup and logging
      await this.logRotationEvent(keyId, newKey.id);
      console.log('Key rotation completed successfully');

      return newKey;
    } catch (error) {
      console.error('Key rotation failed:', error);
      await this.rollbackRotation(keyId, applications);
      throw error;
    }
  }

  async monitorKeyTransition(oldKeyId, newKeyId, duration) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < duration) {
      const oldKeyUsage = await this.client.getKeyUsage(oldKeyId, '5m');
      const newKeyUsage = await this.client.getKeyUsage(newKeyId, '5m');
      
      console.log(`Old key usage: ${oldKeyUsage.count}, New key usage: ${newKeyUsage.count}`);
      
      if (oldKeyUsage.count === 0 && newKeyUsage.count > 0) {
        console.log('Transition successful - old key no longer in use');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    }
    
    throw new Error('Key transition did not complete within expected timeframe');
  }

  async updateApplicationKey(application, newKey) {
    // Implementation depends on your deployment system
    // Examples: Kubernetes secrets, AWS Parameter Store, etc.
    switch (application.type) {
      case 'kubernetes':
        await this.updateKubernetesSecret(application.namespace, application.secret, newKey);
        break;
      case 'aws-lambda':
        await this.updateLambdaEnvironment(application.functionName, 'LINKSHIELD_API_KEY', newKey);
        break;
      case 'docker':
        await this.updateDockerEnvironment(application.containerId, 'LINKSHIELD_API_KEY', newKey);
        break;
      default:
        throw new Error(`Unsupported application type: ${application.type}`);
    }
  }
}
```

### Zero-Downtime Rotation

**Overlapping Key Strategy:**
1. **Generate New Key** - Create replacement before revoking old key
2. **Gradual Migration** - Update applications one by one
3. **Monitoring Period** - Allow both keys to work simultaneously
4. **Verification** - Confirm all traffic moved to new key
5. **Old Key Revocation** - Disable old key only after full migration

**Blue-Green Deployment:**
```javascript
class BlueGreenKeyRotation {
  constructor(client) {
    this.client = client;
    this.activeKey = null;
    this.standbyKey = null;
  }

  async initializeKeys() {
    // Create two identical keys
    this.activeKey = await this.client.createAPIKey({
      name: 'production-active',
      permissions: ['url:scan', 'ai:analyze']
    });
    
    this.standbyKey = await this.client.createAPIKey({
      name: 'production-standby',
      permissions: ['url:scan', 'ai:analyze']
    });
  }

  async performRotation() {
    // Switch active and standby keys
    const oldActive = this.activeKey;
    this.activeKey = this.standbyKey;
    
    // Update all applications to use new active key
    await this.updateAllApplications(this.activeKey.key);
    
    // Generate new standby key
    this.standbyKey = await this.client.createAPIKey({
      name: 'production-standby-new',
      permissions: ['url:scan', 'ai:analyze']
    });
    
    // Revoke old active key after grace period
    setTimeout(async () => {
      await this.client.revokeAPIKey(oldActive.id);
    }, 300000); // 5 minute grace period
  }
}
```

---

## Related Documentation

- **[API Documentation](../developer/API_DOCUMENTATION.md)** - Complete API reference
- **[Integration Guide](../developer/INTEGRATION_GUIDE.md)** - Implementation examples
- **[How to Use Dashboard](HOW_TO_USE_DASHBOARD.md)** - Dashboard navigation guide
- **[Troubleshooting FAQ](TROUBLESHOOTING_FAQ.md)** - Common issues and solutions

---

*Last updated: January 2024*
*For the most current API features and documentation, visit [docs.linkshield.com](https://docs.linkshield.com)*
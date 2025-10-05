# URL Checking Feature Guide

The URL Checking feature is LinkShield's core security analysis tool that helps you identify potentially dangerous websites before visiting them. This comprehensive guide covers everything from basic URL scanning to advanced bulk analysis and historical tracking.

## 🔍 Feature Overview

### What is URL Checking?

URL checking is the process of analyzing web addresses to determine their safety and legitimacy. LinkShield examines URLs through multiple security providers, reputation databases, and proprietary analysis engines to provide comprehensive threat assessment.

### Key Benefits

- **Multi-Provider Analysis**: Combines results from Google Safe Browsing, VirusTotal, URLVoid, and proprietary engines
- **Real-Time Scanning**: Get instant security assessments for any publicly accessible URL
- **Historical Tracking**: Keep records of all your scans for pattern analysis and reporting
- **Bulk Processing**: Analyze multiple URLs simultaneously for efficiency
- **Detailed Reporting**: Comprehensive results with provider-specific findings and confidence scores

## 🚀 Getting Started

### Basic URL Check (Anonymous Users)

1. **Visit the Homepage**: Navigate to [LinkShield](https://www.linkshield.site)
2. **Enter URL**: Type or paste the URL you want to check
3. **Select Scan Type**: Choose "Quick Scan" (only option for anonymous users)
4. **Click "Check URL Security"**: Wait 5-10 seconds for results
5. **Review Results**: See risk score, threat level, and basic provider results

### Advanced URL Check (Registered Users)

1. **Sign In**: Log into your LinkShield account
2. **Access Full Features**: All scan types and advanced features become available
3. **Choose Scan Depth**: Select from Quick, Comprehensive, or Deep scan
4. **View Detailed Results**: Access complete provider breakdowns and historical data
5. **Save to History**: All scans are automatically saved to your account

## 📊 Scan Types Comparison

| Feature | Quick Scan | Comprehensive Scan | Deep Scan |
|---------|------------|-------------------|-----------|
| **Duration** | 5-10 seconds | 15-30 seconds | 30-60 seconds |
| **Availability** | All users | Registered users | Pro+ users |
| **Security Providers** | Google Safe Browsing, VirusTotal (basic) | All Quick + URLVoid, reputation analysis | All Comprehensive + custom analysis |
| **Domain Reputation** | ❌ | ✅ | ✅ |
| **Content Analysis** | ❌ | ✅ | ✅ |
| **Broken Links Detection** | ❌ | ❌ | ✅ |
| **SSL Certificate Check** | ❌ | ✅ | ✅ |
| **Page Structure Analysis** | ❌ | ❌ | ✅ |
| **Resource Loading Check** | ❌ | ❌ | ✅ |

### Quick Scan
**Best for**: Email links, suspicious URLs, quick safety verification
- Basic threat detection using primary security databases
- Identifies known malicious URLs and phishing attempts
- Fastest option for immediate safety decisions

### Comprehensive Scan
**Best for**: Business websites, partner verification, thorough due diligence
- All Quick scan features plus domain reputation analysis
- Content quality assessment and SSL certificate validation
- Balanced approach between speed and thoroughness

### Deep Scan
**Best for**: Website maintenance, SEO audits, quality assurance
- Complete website health analysis including broken links
- Page structure and resource loading verification
- Most thorough option for comprehensive website assessment

## 📈 Understanding Results

### Risk Score (0-100)

The risk score is a comprehensive numerical assessment combining multiple factors:

- **0-20**: **SAFE** 🟢 - Very low risk, generally safe to visit
- **21-50**: **LOW RISK** 🟡 - Minor concerns, proceed with normal caution
- **51-70**: **MODERATE RISK** 🟠 - Significant concerns, avoid if possible
- **71-90**: **HIGH RISK** 🔴 - Dangerous, strong recommendation to avoid
- **91-100**: **CRITICAL RISK** ⚫ - Extremely dangerous, do not visit

### Threat Levels

#### SAFE 🟢
- No significant threats detected across all providers
- Domain has good reputation and clean history
- SSL certificate is valid and properly configured
- Content appears legitimate and professional

#### SUSPICIOUS 🟡
- Mixed signals from security providers
- Domain may be new or have limited reputation data
- Some concerning indicators but not definitively malicious
- Requires user judgment and additional verification

#### MALICIOUS 🔴
- Active threats detected by one or more providers
- Known phishing, malware, or scam indicators
- Domain flagged in threat intelligence databases
- Strong recommendation to avoid visiting

### Provider Results Breakdown

#### Google Safe Browsing
- **Clean**: No threats detected in Google's database
- **Malicious**: Site flagged for malware, phishing, or unwanted software
- **Suspicious**: Site exhibits concerning behavior patterns

#### VirusTotal
- **Detection Ratio**: Number of engines flagging the URL (e.g., "3/89")
- **Categories**: Specific threat types identified (phishing, malware, etc.)
- **Community Score**: User-submitted threat intelligence

#### URLVoid
- **Blacklist Status**: Presence on security blacklists
- **Domain Age**: How long the domain has been registered
- **Reputation Score**: Overall domain trustworthiness rating

#### LinkShield AI
- **Phishing Detection**: Machine learning analysis for brand impersonation
- **Content Quality**: Assessment of website legitimacy and professionalism
- **Behavioral Analysis**: Suspicious patterns and manipulation tactics

## 🔧 Advanced Features (Registered Users)

### URL Check History

Access your complete scanning history with powerful filtering and search capabilities:

#### Viewing History
1. **Navigate to History**: Go to Dashboard → URL History
2. **Browse Results**: View all your past scans in chronological order
3. **Filter Results**: Use filters to find specific scans
4. **Export Data**: Download your history for external analysis

#### Available Filters
- **Domain**: Filter by specific domains or subdomains
- **Threat Level**: Show only Safe, Suspicious, or Malicious results
- **Date Range**: Specify time periods for analysis
- **Scan Type**: Filter by Quick, Comprehensive, or Deep scans
- **Status**: Show completed, failed, or pending scans

#### History Table Columns
- **URL**: The checked web address (clickable for details)
- **Domain**: Extracted domain name
- **Threat Level**: Color-coded safety assessment
- **Risk Score**: Numerical risk rating (0-100)
- **Scan Type**: Type of analysis performed
- **Date**: When the scan was completed
- **Actions**: View details, re-scan, or export individual results

### Detailed Scan Results

Click on any URL in your history to access comprehensive scan details:

#### Overview Section
- **URL Information**: Full URL, domain, and subdomain breakdown
- **Scan Metadata**: Scan type, completion time, and processing duration
- **Overall Assessment**: Risk score, threat level, and summary

#### Security Provider Results
Expandable accordion sections for each provider:

**Google Safe Browsing**
- Threat categories detected
- Last database update time
- Specific threat indicators

**VirusTotal Analysis**
- Individual antivirus engine results
- Community comments and votes
- Historical detection timeline

**URLVoid Reputation**
- Blacklist presence across multiple databases
- Domain registration information
- Reputation scoring details

**LinkShield AI Analysis**
- Phishing probability score
- Content quality assessment
- Manipulation tactic detection

#### Broken Links Analysis (Deep Scan Only)
- **Link Inventory**: All links found on the page
- **Status Codes**: HTTP response codes for each link
- **Error Details**: Specific error messages for broken links
- **Link Depth**: How many clicks deep each link was found
- **Fix Recommendations**: Suggestions for resolving broken links

### Bulk URL Analysis

Analyze multiple URLs simultaneously for efficient security assessment:

#### Getting Started with Bulk Analysis
1. **Access Feature**: Navigate to Dashboard → Bulk Analysis
2. **Choose Input Method**: Text input or file upload
3. **Submit URLs**: Process up to your plan limit
4. **Monitor Progress**: Real-time progress tracking
5. **Review Results**: Comprehensive summary and individual results

#### Input Methods

**Text Input**
- Enter one URL per line in the text area
- Supports up to your plan's bulk limit
- Real-time URL validation as you type
- Copy/paste friendly for quick analysis

**File Upload**
- Supported formats: .txt, .csv
- Maximum file size: 1MB
- One URL per line format
- Automatic duplicate detection and removal

#### Plan Limits
- **Free Plan**: 10 URLs per batch
- **Pro Plan**: 50 URLs per batch  
- **Enterprise Plan**: 100 URLs per batch

#### Results Summary
- **Total URLs**: Number of URLs processed
- **Safe**: URLs with no significant threats
- **Suspicious**: URLs requiring caution
- **Malicious**: URLs identified as dangerous
- **Errors**: URLs that couldn't be processed

#### Individual Results Table
- **URL**: The analyzed web address
- **Threat Level**: Color-coded safety assessment
- **Risk Score**: Numerical rating (0-100)
- **Actions**: View detailed results or re-scan

### Domain Reputation Lookup

Get comprehensive reputation information for any domain:

#### How to Use
1. **Access Feature**: Go to Tools → Domain Reputation
2. **Enter Domain**: Type the domain name (e.g., "example.com")
3. **View Results**: Comprehensive reputation analysis
4. **Historical Data**: Reputation changes over time

#### Reputation Metrics
- **Trust Score**: Overall domain trustworthiness (0-100)
- **Age**: Domain registration date and age
- **Popularity**: Traffic ranking and visitor statistics
- **Security History**: Past security incidents or flags
- **Community Reports**: User-submitted reputation data

#### Historical Analysis
- **Reputation Timeline**: Changes in trust score over time
- **Incident History**: Security events and their impact
- **Trend Analysis**: Improving or declining reputation patterns

### Usage Statistics and Analytics

Track your URL checking patterns and optimize your security workflow:

#### Statistics Dashboard
- **Total Checks**: Lifetime and period-specific scan counts
- **Threat Distribution**: Breakdown by threat levels
- **Scan Type Usage**: Quick vs. Comprehensive vs. Deep scan usage
- **Time Series**: Daily/weekly/monthly scanning patterns

#### Plan Usage Tracking
- **Current Usage**: Scans used vs. plan limits
- **Usage Trends**: Historical consumption patterns
- **Limit Warnings**: Notifications when approaching limits
- **Upgrade Recommendations**: Suggestions for plan optimization

#### Export and Reporting
- **Data Export**: Download usage statistics as CSV or JSON
- **Custom Reports**: Generate reports for specific time periods
- **Team Analytics**: Usage patterns across team members (Enterprise)

## 📤 Export and Integration

### Data Export Options

#### Export Formats
- **CSV**: Spreadsheet-compatible format for analysis
- **JSON**: Structured data for programmatic processing
- **PDF**: Formatted reports for presentations

#### Export Scope
- **Individual Scans**: Export specific scan results
- **Filtered History**: Export based on search criteria
- **Complete History**: Full account scanning history
- **Usage Statistics**: Analytics and usage data

#### Automated Exports
- **Scheduled Reports**: Regular exports via email
- **Webhook Integration**: Real-time data push to external systems
- **API Access**: Programmatic data retrieval

### API Integration

For developers and automated systems:

#### Authentication
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.linkshield.com/v1/url-check/check
```

#### Basic URL Check
```bash
curl -X POST https://api.linkshield.com/v1/url-check/check \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "scan_type": "SECURITY"
  }'
```

#### Bulk Analysis
```bash
curl -X POST https://api.linkshield.com/v1/url-check/bulk-check \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example1.com",
      "https://example2.com",
      "https://example3.com"
    ]
  }'
```

## 🎯 Best Practices

### When to Use Each Scan Type

#### Quick Scan
- **Email Links**: Verify links from unknown senders
- **Social Media**: Check suspicious social media links
- **Urgent Verification**: When you need immediate results
- **High Volume**: When checking many URLs quickly

#### Comprehensive Scan
- **Business Partners**: Verify partner and vendor websites
- **Online Shopping**: Check e-commerce sites before purchasing
- **Research**: Verify sources for important research
- **Due Diligence**: Thorough verification for business decisions

#### Deep Scan
- **Website Audits**: Complete health check of your own sites
- **SEO Analysis**: Identify broken links affecting search rankings
- **Quality Assurance**: Pre-launch website verification
- **Maintenance**: Regular health monitoring of important sites

### Security Best Practices

#### Before Visiting URLs
1. **Always Scan First**: Never visit suspicious URLs without checking
2. **Check Multiple Sources**: Use different scan types for important decisions
3. **Verify Context**: Consider where you found the URL
4. **Trust Your Instincts**: If something feels wrong, investigate further

#### Interpreting Results
1. **Consider All Factors**: Don't rely solely on risk score
2. **Check Provider Details**: Review individual provider findings
3. **Look for Patterns**: Multiple red flags indicate higher risk
4. **Stay Updated**: Threat landscapes change rapidly

#### Ongoing Monitoring
1. **Regular Rescans**: Periodically recheck important URLs
2. **Monitor History**: Look for patterns in your scanning activity
3. **Set Alerts**: Use notifications for critical threat detections
4. **Share Intelligence**: Report new threats to help the community

## 🚨 Common Use Cases

### Email Security
- **Phishing Protection**: Scan links before clicking
- **Attachment URLs**: Verify download links in emails
- **Sender Verification**: Check legitimacy of sender domains

### Social Media Safety
- **Link Verification**: Check shared links before visiting
- **Profile Verification**: Verify legitimacy of social profiles
- **Advertisement Safety**: Check promoted content links

### Business Operations
- **Vendor Verification**: Check partner and supplier websites
- **Customer Protection**: Verify links before sharing with customers
- **Brand Protection**: Monitor for impersonation attempts

### Website Management
- **Pre-Launch Checks**: Verify new websites before going live
- **Maintenance Monitoring**: Regular health checks for existing sites
- **SEO Optimization**: Identify and fix broken links

### Research and Investigation
- **Source Verification**: Check credibility of information sources
- **Threat Intelligence**: Investigate suspicious domains
- **Competitive Analysis**: Monitor competitor website health

## ⚠️ Limitations and Considerations

### Technical Limitations
- **Public URLs Only**: Cannot scan private or internal URLs
- **Real-Time Analysis**: Results reflect current state, not future changes
- **Provider Dependency**: Results depend on third-party security providers
- **Rate Limits**: Usage restrictions based on subscription plans

### Interpretation Guidelines
- **False Positives**: Legitimate sites may occasionally be flagged
- **False Negatives**: New threats may not be immediately detected
- **Context Matters**: Consider the source and purpose of URLs
- **Professional Judgment**: Use results as guidance, not absolute truth

## 🆘 Troubleshooting

### Common Issues

#### "Invalid URL Format"
- **Cause**: URL doesn't meet format requirements
- **Solution**: Ensure URL includes protocol (http:// or https://)
- **Examples**: 
  - ❌ `example.com`
  - ✅ `https://example.com`

#### "URL Not Accessible"
- **Cause**: Website is down or blocks automated scanning
- **Solution**: Try again later or verify URL manually
- **Note**: Some sites block security scanners

#### "Rate Limit Exceeded"
- **Cause**: Too many requests in a short time period
- **Solution**: Wait for the specified retry time or upgrade plan
- **Prevention**: Spread out scanning activities

#### "Scan Timeout"
- **Cause**: Website took too long to respond
- **Solution**: Try a Quick scan instead of Deep scan
- **Note**: Some sites are naturally slow to respond

### Getting Help

#### Self-Service Resources
- **FAQ Section**: Common questions and answers
- **Video Tutorials**: Step-by-step guidance
- **Community Forum**: User discussions and tips
- **Knowledge Base**: Comprehensive help articles

#### Support Channels
- **Email Support**: support@linkshield.com
- **Live Chat**: Available during business hours (Pro+ plans)
- **Priority Support**: Faster response times (Enterprise plans)
- **Phone Support**: Direct access (Ultimate plan)

---

## 📚 Related Documentation

- **[Getting Started Guide](../getting-started/QUICK_START.md)** - Basic LinkShield usage
- **[Key Concepts](../getting-started/KEY_CONCEPTS.md)** - Fundamental terminology
- **[API Reference](../api/API_REFERENCE.md)** - Developer documentation
- **[Subscription Plans](../subscription/PLANS.md)** - Feature comparison and pricing

**Need more help?** Contact our support team at [support@linkshield.com](mailto:support@linkshield.com) or visit our [community forum](https://community.linkshield.com).
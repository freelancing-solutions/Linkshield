# Key Concepts

Understanding these fundamental concepts will help you get the most out of LinkShield's security features. This guide explains the terminology, scoring systems, and core principles behind our platform.

## 🔍 URL Security Analysis

### What is URL Checking?
URL checking is the process of analyzing a web address (URL) to determine if it's safe to visit. LinkShield examines multiple factors including known threat databases, website reputation, content analysis, and behavioral patterns to assess security risks.

### Scan Types

LinkShield offers three levels of URL analysis, each providing different depths of investigation:

#### Quick Scan
- **Purpose**: Fast security verification for immediate safety decisions
- **Duration**: 5-10 seconds
- **Coverage**: Basic threat detection using primary security databases
- **Providers**: Google Safe Browsing, VirusTotal (basic check)
- **Best for**: Suspicious email links, quick safety verification
- **Available to**: All users (including anonymous)

#### Comprehensive Scan
- **Purpose**: Detailed security and reputation analysis
- **Duration**: 15-30 seconds
- **Coverage**: Security threats + domain reputation + content quality
- **Providers**: Google Safe Browsing, VirusTotal, URLVoid, proprietary analysis
- **Best for**: Business websites, thorough due diligence
- **Available to**: Registered users

#### Deep Scan
- **Purpose**: Complete website analysis including technical health
- **Duration**: 30-60 seconds
- **Coverage**: All security checks + broken links + performance analysis
- **Providers**: All security providers + technical analysis tools
- **Best for**: Website audits, comprehensive security assessment
- **Available to**: Registered users

### Security Providers

LinkShield integrates with multiple security intelligence sources:

- **Google Safe Browsing**: Google's threat detection database
- **VirusTotal**: Aggregated antivirus and security scanner results
- **URLVoid**: Domain reputation and blacklist checking
- **LinkShield AI**: Proprietary machine learning threat detection
- **Community Reports**: User-submitted threat intelligence

## 📊 Risk Assessment

### Risk Score (0-100 Scale)

The risk score is a comprehensive numerical assessment of a URL's safety:

- **0-20**: **SAFE** - Very low risk, generally safe to visit
- **21-50**: **LOW RISK** - Minor concerns, proceed with caution
- **51-70**: **MODERATE RISK** - Significant concerns, avoid if possible
- **71-90**: **HIGH RISK** - Dangerous, strong recommendation to avoid
- **91-100**: **CRITICAL RISK** - Extremely dangerous, do not visit

**How it's calculated:**
- Security provider results (40% weight)
- Domain reputation analysis (25% weight)
- Content quality assessment (20% weight)
- Community reports and feedback (15% weight)

### Threat Levels

#### SAFE 🟢
- **Risk Score**: 0-30
- **Meaning**: No significant threats detected
- **Action**: Safe to visit with normal precautions
- **Examples**: Legitimate business websites, established news sites

#### SUSPICIOUS 🟡
- **Risk Score**: 31-70
- **Meaning**: Potential risks or concerning indicators found
- **Action**: Proceed with caution, verify legitimacy
- **Examples**: New domains, sites with mixed reputation signals

#### MALICIOUS 🔴
- **Risk Score**: 71-100
- **Meaning**: Active threats or malicious content detected
- **Action**: Do not visit, report if encountered
- **Examples**: Phishing sites, malware distribution, known scams

## 🛡️ Social Protection

### Algorithm Health Monitoring
Social Protection tracks how social media algorithms interact with your content and accounts:

#### Visibility Score
- **Range**: 0-100%
- **Meaning**: How often your content appears in feeds and search results
- **Factors**: Reach, impressions, algorithmic promotion/suppression

#### Engagement Health
- **Metrics**: Likes, shares, comments relative to follower count
- **Trends**: Tracking engagement patterns over time
- **Anomalies**: Sudden drops that may indicate algorithmic penalties

#### Shadow Ban Detection
- **Definition**: Algorithmic suppression without explicit notification
- **Indicators**: Reduced reach, limited discoverability, engagement drops
- **Monitoring**: Continuous tracking of visibility metrics

### Social Media Penalties
- **Soft Penalties**: Reduced reach and visibility
- **Hard Penalties**: Content removal or account restrictions
- **Algorithmic Penalties**: Invisible suppression of content distribution

## 🤖 AI-Powered Analysis

### Phishing Detection
Advanced machine learning models analyze websites for phishing indicators:

- **Visual Similarity**: Comparison with legitimate sites (brand impersonation)
- **Content Analysis**: Suspicious language patterns and urgency tactics
- **Form Analysis**: Credential harvesting attempts
- **URL Patterns**: Suspicious domain structures and typosquatting

### Content Quality Assessment
AI evaluation of website trustworthiness and legitimacy:

- **Content Authenticity**: Original vs. copied/scraped content
- **Professional Quality**: Design, grammar, and presentation standards
- **Information Accuracy**: Fact-checking and source verification
- **User Experience**: Navigation, functionality, and accessibility

### Manipulation Tactics Detection
Identification of psychological manipulation and social engineering:

- **Urgency Tactics**: "Limited time" and pressure techniques
- **Authority Impersonation**: Fake credentials and endorsements
- **Social Proof Manipulation**: Fake reviews and testimonials
- **Fear Appeals**: Scare tactics and threat-based messaging

## 📈 Community Intelligence

### Community Reports
User-submitted threat intelligence that enhances our security database:

#### Report Types
- **Phishing Attempts**: User-identified phishing sites
- **Scam Websites**: Fraudulent or deceptive sites
- **Malware Distribution**: Sites hosting malicious software
- **False Positives**: Legitimate sites incorrectly flagged

#### Verification Process
- **Community Voting**: Other users verify or dispute reports
- **Expert Review**: Security analysts validate high-impact reports
- **Automated Verification**: AI systems cross-reference with known data
- **Reputation Scoring**: Reporter credibility affects report weight

#### Contributing to Community Security
- **Report Threats**: Submit suspicious sites you encounter
- **Verify Reports**: Vote on other users' submissions
- **Provide Context**: Add details about threats you've experienced
- **Build Reputation**: Accurate reporting increases your influence

## 📁 Project Management

### Projects
Organizational containers for grouping related URLs and monitoring activities:

#### Project Types
- **Website Monitoring**: Track your own sites for security issues
- **Competitor Analysis**: Monitor industry websites for threats
- **Client Security**: Manage security for multiple clients
- **Research Projects**: Organize threat intelligence gathering

#### Project Features
- **URL Organization**: Group related URLs for easier management
- **Scheduled Scanning**: Automatic periodic security checks
- **Team Collaboration**: Share projects with team members
- **Custom Alerts**: Notifications for specific threat types

### URL History and Tracking
- **Scan History**: Complete record of all URL checks performed
- **Result Comparison**: Track changes in risk scores over time
- **Export Functionality**: Download results for reporting and analysis
- **Filtering and Search**: Find specific scans and results quickly

## 🔑 API and Developer Concepts

### API Keys
Secure tokens that provide programmatic access to LinkShield services:

#### Key Types
- **Read-Only**: Access to scan results and historical data
- **Full Access**: Ability to initiate scans and manage projects
- **Webhook Keys**: Special keys for receiving real-time notifications

#### Authentication
- **Bearer Token**: Include API key in Authorization header
- **Rate Limiting**: Requests per minute/hour based on subscription
- **Scope Control**: Keys can be limited to specific features

### Rate Limits
Usage restrictions based on subscription tier and API usage:

#### Limit Types
- **Requests per Minute**: Short-term burst protection
- **Requests per Hour**: Medium-term usage control
- **Monthly Quotas**: Long-term subscription limits
- **Concurrent Requests**: Simultaneous request limitations

#### Best Practices
- **Implement Backoff**: Respect rate limit headers
- **Cache Results**: Avoid redundant API calls
- **Batch Requests**: Use bulk endpoints when available
- **Monitor Usage**: Track consumption against limits

## 💳 Subscription and Usage

### Plan Tiers
LinkShield offers multiple subscription levels with different feature sets:

#### Free Tier
- **Daily Scans**: Limited number of URL checks
- **Scan Types**: Quick scans only
- **Features**: Basic security analysis
- **Support**: Community forum access

#### Pro Tiers (Basic, Pro, Business)
- **Increased Limits**: Higher daily/monthly scan quotas
- **Advanced Features**: Comprehensive and Deep scans
- **API Access**: Programmatic integration capabilities
- **Priority Support**: Faster response times

#### Enterprise Tiers (Enterprise, Ultimate)
- **Unlimited Scanning**: No daily or monthly limits
- **Premium Features**: Advanced analytics and reporting
- **Custom Integration**: Tailored solutions and consulting
- **Dedicated Support**: Direct access to security experts

### Usage Tracking
- **Real-time Monitoring**: Current usage against plan limits
- **Historical Analytics**: Usage patterns and trends over time
- **Overage Alerts**: Notifications when approaching limits
- **Upgrade Recommendations**: Suggestions for plan optimization

## 🔒 Security and Privacy

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based permissions and authentication
- **Data Retention**: Configurable retention policies
- **Privacy Compliance**: GDPR, CCPA, and other privacy regulations

### Threat Intelligence
- **Real-time Updates**: Continuous threat database updates
- **Global Coverage**: Worldwide threat intelligence sources
- **Collaborative Security**: Community-driven threat sharing
- **Expert Analysis**: Professional security researcher insights

---

## 📚 Related Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get started with LinkShield
- **[URL Checking Guide](../features/URL_CHECKING.md)** - Detailed scanning documentation
- **[API Reference](../api/API_REFERENCE.md)** - Complete developer documentation
- **[Subscription Plans](../subscription/PLANS.md)** - Feature and pricing comparison

**Questions about these concepts?** Visit our [FAQ](../support/FAQ.md) or contact [support@linkshield.com](mailto:support@linkshield.com).
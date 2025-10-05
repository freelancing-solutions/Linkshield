# LinkShield Homepage - User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [URL Checking](#url-checking)
3. [Scan Types](#scan-types)
4. [Understanding Results](#understanding-results)
5. [Social Protection](#social-protection)
6. [Account Features](#account-features)
7. [FAQ](#faq)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### For Anonymous Users

You can start using LinkShield immediately without creating an account:

1. Visit the homepage at `https://www.linkshield.site`
2. Enter a URL in the checker
3. Click "Check URL" to scan
4. View your results instantly

**Limitations for anonymous users:**
- 10 scans per hour
- Quick scan only
- Limited result details
- No scan history

### For Registered Users

Create a free account to unlock more features:

1. Click "Sign Up Free" on the homepage
2. Enter your email and create a password
3. Verify your email address
4. Start using advanced features

**Benefits of registration:**
- 100 scans per hour
- All scan types (Quick, Comprehensive, Deep)
- Full result details
- Scan history
- Social Protection features
- API access

## URL Checking

### How to Check a URL

1. **Enter the URL**
   - Type or paste the URL in the input field
   - Format: `https://example.com` or `http://example.com`
   - Maximum length: 2048 characters

2. **Select Scan Type** (registered users only)
   - Quick: Fast security check (5-10 seconds)
   - Comprehensive: Security + reputation + content (15-30 seconds)
   - Deep: Full analysis with broken links (30-60 seconds)

3. **Click "Check URL"**
   - Wait for the scan to complete
   - Results will appear below

### URL Requirements

✅ **Valid URLs:**
- `https://example.com`
- `http://subdomain.example.com`
- `https://example.com/path/to/page`
- `https://example.com?query=param`

❌ **Invalid URLs:**
- `example.com` (missing protocol)
- `not a url` (invalid format)
- URLs longer than 2048 characters

## Scan Types

### Quick Scan (Free)

**What it checks:**
- Basic security threats
- Known malicious URLs
- Phishing attempts

**Providers:**
- Google Safe Browsing
- VirusTotal (basic)

**Time:** 5-10 seconds

**Best for:**
- Quick safety checks
- Suspicious links
- Email links

### Comprehensive Scan (Registered)

**What it checks:**
- All Quick scan checks
- Domain reputation
- Content analysis
- SSL certificate validation

**Providers:**
- Google Safe Browsing
- VirusTotal (full)
- URLVoid
- Custom reputation engine

**Time:** 15-30 seconds

**Best for:**
- Thorough analysis
- Business websites
- Partner verification

### Deep Scan (Pro+)

**What it checks:**
- All Comprehensive scan checks
- Broken links detection
- Page structure analysis
- Resource loading issues

**Providers:**
- All Comprehensive providers
- Custom link crawler

**Time:** 30-60 seconds

**Best for:**
- Website maintenance
- SEO audits
- Quality assurance

## Understanding Results

### Risk Score (0-100)

The risk score indicates the overall safety of the URL:

- **0-30 (Green):** Safe - No threats detected
- **31-70 (Yellow):** Suspicious - Potential risks found
- **71-100 (Red):** Dangerous - Confirmed threats

### Threat Level

- **Safe:** No security threats detected
- **Suspicious:** Potential threats or unusual patterns
- **Malicious:** Confirmed malware, phishing, or other threats

### Provider Results

Each security provider gives their assessment:

- **Clean:** No threats found
- **Malicious:** Threats detected
- **Suspicious:** Potential threats
- **Error:** Unable to scan
- **Pending:** Scan in progress

### Domain Reputation

Shows the historical safety of the domain:

- **Trusted:** Well-established, safe domain
- **Neutral:** No significant history
- **Suspicious:** Some negative reports
- **Malicious:** Known for threats

**Factors:**
- Domain age
- SSL certificate validity
- Blacklist status
- Historical scan results

### Broken Links (Deep Scan)

Lists any broken links found on the page:

- **URL:** The broken link
- **Status Code:** HTTP error code (404, 500, etc.)
- **Error:** Description of the issue

## Social Protection

### Extension Status

**What it shows:**
- Connection status (Connected/Disconnected)
- Last activity timestamp
- Protection statistics (blocked content, warnings)

**Actions:**
- Install Extension: Download browser extension
- View Analytics: See detailed protection stats
- Update Extension: Get latest version

### Algorithm Health

Monitor your social media account health:

**Metrics:**
- **Visibility Score:** How often your content appears
- **Engagement Score:** How users interact with your content
- **Penalties:** Detected algorithm penalties

**Trend Indicators:**
- ↑ Improving
- → Stable
- ↓ Declining

### Social Account Analysis

Analyze your social media profiles:

**Supported Platforms:**
- Twitter/X
- Instagram
- Facebook
- LinkedIn

**Analysis Types:**

1. **Visibility Analysis**
   - Impressions
   - Reach
   - Visibility rate
   - Recommendations

2. **Engagement Analysis**
   - Likes
   - Comments
   - Shares
   - Engagement rate
   - Recommendations

3. **Penalty Detection**
   - Shadow bans
   - Content restrictions
   - Reach limitations
   - Severity levels
   - Recommendations

**How to use:**
1. Select your platform
2. Enter your profile URL
3. Click analysis type
4. Wait for results
5. Review recommendations

## Account Features

### Quick Actions

Fast access to common features:

- **Scan History:** View all your URL checks
- **Bulk URL Check:** Check multiple URLs at once
- **AI Analysis:** Analyze content with AI
- **View Reports:** Community security reports
- **API Keys:** Manage your API keys
- **Settings:** Account preferences

### Subscription Plans

**Free Plan:**
- 100 URL checks/hour
- Quick & Comprehensive scans
- Basic Social Protection
- Scan history (30 days)

**Pro Plan:**
- 1,000 URL checks/hour
- All scan types (including Deep)
- Advanced Social Protection
- Unlimited scan history
- API access (10,000 calls/month)
- Priority support

**Enterprise Plan:**
- Unlimited URL checks
- Custom scan configurations
- Team management
- Advanced API access
- Dedicated support
- Custom integrations

### Scan History

View and manage your past scans:

- **Filter by:** Date, status, threat level
- **Search:** Find specific URLs
- **Export:** Download scan results
- **Re-scan:** Check URL again
- **Share:** Share results with team

## FAQ

### General Questions

**Q: Is LinkShield free to use?**
A: Yes! We offer a free plan with 100 URL checks per hour. Premium plans are available for advanced features.

**Q: Do I need an account?**
A: No, you can use basic URL checking without an account. However, creating an account unlocks more features.

**Q: How accurate are the scans?**
A: We use multiple security providers (Google Safe Browsing, VirusTotal, URLVoid) to ensure high accuracy.

**Q: Can I check private/internal URLs?**
A: No, URLs must be publicly accessible for scanning.

### Scanning Questions

**Q: How long does a scan take?**
A: Quick scans take 5-10 seconds, Comprehensive scans take 15-30 seconds, and Deep scans take 30-60 seconds.

**Q: Why did my scan fail?**
A: Common reasons include:
- Invalid URL format
- URL not accessible
- Network timeout
- Rate limit exceeded

**Q: Can I scan the same URL multiple times?**
A: Yes, but results are cached for 5 minutes to improve performance.

**Q: What's the difference between scan types?**
A: See the [Scan Types](#scan-types) section for detailed comparisons.

### Social Protection Questions

**Q: What is Social Protection?**
A: Social Protection monitors your social media accounts for algorithm changes, penalties, and engagement issues.

**Q: Which platforms are supported?**
A: Currently: Twitter/X, Instagram, Facebook, and LinkedIn.

**Q: How often should I run analyses?**
A: We recommend weekly analyses to track trends and catch issues early.

**Q: What are shadow bans?**
A: Shadow bans are when your content is hidden from others without notification. Our penalty detection can identify these.

### Account Questions

**Q: How do I upgrade my plan?**
A: Click "Upgrade" on your subscription card or visit the Subscriptions page.

**Q: Can I cancel anytime?**
A: Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.

**Q: Do you offer refunds?**
A: Yes, we offer a 30-day money-back guarantee for all paid plans.

**Q: How do I delete my account?**
A: Go to Settings > Account > Delete Account. Note: This action is permanent.

## Troubleshooting

### Common Issues

#### "Invalid URL format"

**Problem:** The URL you entered is not valid.

**Solution:**
- Ensure URL starts with `http://` or `https://`
- Check for typos
- Remove special characters
- Verify URL is under 2048 characters

#### "Rate limit exceeded"

**Problem:** You've reached your hourly scan limit.

**Solution:**
- Wait for the rate limit to reset (shown in the notice)
- Sign up for a free account (100 scans/hour)
- Upgrade to Pro for more scans

#### "Scan timeout"

**Problem:** The scan took too long to complete.

**Solution:**
- Try again (the website might be slow)
- Use a Quick scan instead of Deep scan
- Check if the URL is accessible

#### "Network error"

**Problem:** Unable to connect to our servers.

**Solution:**
- Check your internet connection
- Try refreshing the page
- Clear your browser cache
- Try a different browser

#### "Extension not connected"

**Problem:** Browser extension is not installed or disconnected.

**Solution:**
- Install the LinkShield browser extension
- Ensure extension is enabled
- Refresh the page
- Check extension permissions

### Getting Help

If you're still experiencing issues:

1. **Check Status Page:** `https://status.linkshield.site`
2. **Contact Support:** `support@linkshield.site`
3. **Community Forum:** `https://community.linkshield.site`
4. **Documentation:** `https://docs.linkshield.site`

### Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Not Supported:**
- Internet Explorer
- Browsers with JavaScript disabled

### Performance Tips

1. **Use Quick scans** for faster results
2. **Enable caching** in your browser
3. **Close unnecessary tabs** to free up memory
4. **Update your browser** to the latest version
5. **Clear cache** if experiencing issues

## Best Practices

### For URL Checking

1. **Always check suspicious links** before clicking
2. **Use Comprehensive scans** for important websites
3. **Save important scans** to your history
4. **Share results** with your team
5. **Re-scan periodically** for updated information

### For Social Protection

1. **Run weekly analyses** to track trends
2. **Act on recommendations** promptly
3. **Monitor penalty alerts** closely
4. **Compare across platforms** for insights
5. **Keep extension updated** for best protection

### For Security

1. **Never share your API keys** publicly
2. **Use strong passwords** for your account
3. **Enable two-factor authentication** (coming soon)
4. **Review active sessions** regularly
5. **Report suspicious activity** immediately

## Updates and Changes

This guide is regularly updated. Last updated: January 2025

For the latest information, visit our documentation at `https://docs.linkshield.site`

## Feedback

We value your feedback! Help us improve:

- **Feature Requests:** `feedback@linkshield.site`
- **Bug Reports:** `bugs@linkshield.site`
- **General Feedback:** `hello@linkshield.site`

Thank you for using LinkShield! 🛡️

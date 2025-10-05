# How to Check URLs with LinkShield

This guide provides step-by-step instructions for checking URLs using LinkShield's various scanning methods. Whether you're a new user or looking to maximize your security analysis, this guide covers everything from quick anonymous checks to comprehensive deep scans.

## 🚀 Quick Start: Anonymous URL Check

Perfect for first-time users or quick security checks without creating an account.

### Step 1: Access the URL Checker
1. Visit [LinkShield.com](https://linkshield.com)
2. You'll see the URL checker prominently displayed on the homepage
3. No account creation required for basic checks

### Step 2: Enter the URL
1. **Paste or type the URL** in the input field
2. **Ensure the URL is complete** (includes `http://` or `https://`)
3. **Examples of valid URLs:**
   - `https://example.com`
   - `http://suspicious-site.net/login`
   - `https://subdomain.example.org/path`

### Step 3: Select Quick Scan
1. **Quick Scan** is automatically selected for anonymous users
2. This provides basic security analysis using multiple providers
3. Results typically available in 5-15 seconds

### Step 4: Click "Check URL"
1. Click the **"Check URL"** button
2. Wait for the analysis to complete
3. A progress indicator will show the scan status

### Step 5: Review Results
1. **Risk Score**: Overall security rating (0-100)
2. **Threat Level**: Safe, Low Risk, Medium Risk, High Risk, or Dangerous
3. **Provider Results**: Individual assessments from security providers
4. **Recommendations**: Suggested actions based on the analysis

---

## 🔐 Comprehensive URL Check (Registered Users)

For registered users who need detailed analysis and want to save results.

### Prerequisites
- **LinkShield account** (free registration available)
- **Logged in** to your account

### Step 1: Access Your Dashboard
1. **Log in** to your LinkShield account
2. Navigate to **Dashboard** → **URL Checker**
3. Or use the enhanced URL checker on the homepage

### Step 2: Enter the URL
1. **Paste the URL** in the input field
2. **Verify the URL format** is correct
3. The system will validate the URL format automatically

### Step 3: Select Comprehensive Scan
1. Choose **"Comprehensive Scan"** from the scan type dropdown
2. This includes:
   - All Quick Scan providers
   - Additional security databases
   - Content analysis
   - Reputation scoring
   - Historical data

### Step 4: Configure Options (Optional)
1. **Save to History**: Keep results for future reference
2. **Add to Project**: Organize scans by project or client
3. **Set Monitoring**: Enable ongoing monitoring for changes

### Step 5: Run the Scan
1. Click **"Check URL"**
2. **Estimated time**: 15-30 seconds for comprehensive analysis
3. **Progress tracking**: Real-time updates on scan progress

### Step 6: Analyze Detailed Results
1. **Expanded Risk Assessment**: Detailed breakdown of risk factors
2. **Provider Details**: Individual results from each security service
3. **Content Analysis**: Page content and structure evaluation
4. **Historical Data**: Previous scan results and changes over time
5. **Recommendations**: Specific actions based on comprehensive analysis

---

## 🔍 Deep URL Check with Broken Links (Pro+ Users)

The most thorough analysis available, including broken link detection and site health assessment.

### Prerequisites
- **Pro, Business, or Enterprise plan**
- **Logged in** to your account

### Step 1: Access Advanced Features
1. **Navigate to Dashboard** → **URL Checker**
2. **Pro features** will be available in the scan options
3. Look for the **"Deep Scan"** option

### Step 2: Configure Deep Scan
1. **Select "Deep Scan"** from scan type dropdown
2. **Enable broken link detection** (checkbox option)
3. **Set crawl depth** (1-3 levels recommended)
4. **Choose analysis scope**:
   - Single page only
   - Include linked pages
   - Full site analysis (for domains you own)

### Step 3: Advanced Options
1. **Custom User Agent**: Specify browser identification
2. **Follow Redirects**: Track redirect chains
3. **JavaScript Rendering**: Enable for dynamic content
4. **Mobile Analysis**: Include mobile-specific checks

### Step 4: Run Deep Analysis
1. Click **"Start Deep Scan"**
2. **Estimated time**: 1-5 minutes depending on scope
3. **Real-time progress**: Watch as different components are analyzed

### Step 5: Review Comprehensive Results
1. **Security Analysis**: All previous scan data plus advanced threats
2. **Broken Links Report**: List of non-functional links found
3. **Site Health Score**: Overall website quality assessment
4. **Performance Metrics**: Load times and optimization suggestions
5. **SEO Analysis**: Search engine optimization insights
6. **Accessibility Check**: Web accessibility compliance

---

## 📊 Bulk URL Analysis

Analyze multiple URLs simultaneously for efficiency and comprehensive coverage.

### Prerequisites
- **Basic plan or higher** (Free plan: 1 URL at a time)
- **Logged in** to your account

### Step 1: Access Bulk Analysis
1. **Dashboard** → **Bulk URL Checker**
2. Or click **"Bulk Analysis"** from the main URL checker

### Step 2: Prepare Your URL List
1. **Format options**:
   - One URL per line
   - CSV file upload
   - Text file upload
2. **Maximum URLs per batch**:
   - Basic: 10 URLs
   - Pro: 100 URLs
   - Business: 500 URLs
   - Enterprise: 1,000 URLs

### Step 3: Upload or Paste URLs
1. **Paste URLs** directly into the text area
2. **Upload file** using the file selector
3. **Validate format** - system will highlight any formatting issues

### Step 4: Configure Batch Settings
1. **Scan Type**: Quick, Comprehensive, or Deep (based on your plan)
2. **Save Results**: Choose whether to save to history
3. **Project Assignment**: Assign all results to a specific project
4. **Priority Level**: Normal or High (affects processing order)

### Step 5: Start Batch Analysis
1. Click **"Start Batch Analysis"**
2. **Monitor progress** with the real-time progress bar
3. **Estimated completion time** shown based on queue and scan type

### Step 6: Review Batch Results
1. **Summary Dashboard**: Overview of all results
2. **Individual Results**: Click any URL for detailed analysis
3. **Export Options**: Download results as CSV, PDF, or JSON
4. **Filter Results**: View only threats, safe URLs, or specific risk levels

---

## 📈 Understanding Scan Results

### Risk Score Interpretation
- **0-20**: ✅ **Safe** - No known threats detected
- **21-40**: 🟡 **Low Risk** - Minor concerns, generally safe
- **41-60**: 🟠 **Medium Risk** - Caution advised, investigate further
- **61-80**: 🔴 **High Risk** - Significant threats detected
- **81-100**: ⛔ **Dangerous** - Immediate threat, avoid completely

### Provider Results Breakdown

#### Google Safe Browsing
- **Clean**: No threats in Google's database
- **Malware**: Site distributes malicious software
- **Phishing**: Site attempts to steal credentials
- **Unwanted Software**: Site promotes unwanted downloads

#### VirusTotal
- **Detection Ratio**: Number of engines detecting threats (e.g., 3/70)
- **Categories**: Malware, phishing, suspicious, clean
- **Last Analysis**: When the URL was last scanned

#### URLVoid
- **Reputation Score**: Based on multiple blacklist databases
- **Blacklist Status**: Which security vendors flag the site
- **Domain Age**: How long the domain has been registered

#### LinkShield AI
- **Phishing Score**: AI-powered phishing detection (0-100)
- **Content Quality**: Assessment of page content legitimacy
- **Behavioral Analysis**: Suspicious patterns in site behavior

### Threat Level Indicators

#### 🟢 Safe
- All providers report clean
- No suspicious patterns detected
- Established domain with good reputation

#### 🟡 Low Risk
- Minor flags from some providers
- Potentially unwanted content
- New domain or limited history

#### 🟠 Medium Risk
- Multiple providers show concerns
- Suspicious content patterns
- Mixed reputation signals

#### 🔴 High Risk
- Clear threat indicators
- Multiple security violations
- Active malicious behavior

#### ⛔ Dangerous
- Confirmed malicious activity
- Immediate threat to users
- Blocked by multiple providers

---

## 💾 Saving URLs to History

### Automatic Saving (Registered Users)
1. **All scans automatically saved** when logged in
2. **Access via Dashboard** → **URL History**
3. **Organized by date** and scan type

### Manual Save Options
1. **Save Individual Results**: Click "Save to History" on results page
2. **Add Notes**: Include context or observations
3. **Tag URLs**: Organize with custom tags
4. **Project Assignment**: Group related URLs

### History Management
1. **Search History**: Find previous scans by URL, date, or tags
2. **Filter Results**: View by risk level, scan type, or project
3. **Export History**: Download your scan history
4. **Delete Entries**: Remove unwanted history items

---

## 🔄 Re-scanning URLs

### When to Re-scan
- **Suspicious results** that seem incorrect
- **Website changes** since last scan
- **New threat intelligence** available
- **Different scan type** needed for more detail

### How to Re-scan
1. **From History**: Click "Re-scan" next to any previous result
2. **From Results Page**: Click "Scan Again" button
3. **Bulk Re-scan**: Select multiple URLs from history for re-analysis

### Re-scan Options
1. **Same Scan Type**: Use identical settings as previous scan
2. **Upgrade Scan**: Use more comprehensive scan type
3. **Fresh Analysis**: Clear cache and perform completely new scan

---

## 📤 Exporting Scan Results

### Export Formats Available

#### PDF Report
- **Professional format** for sharing with stakeholders
- **Includes charts and graphs** for visual analysis
- **Executive summary** with key findings
- **Detailed technical appendix**

#### CSV Data
- **Spreadsheet-compatible** format
- **All scan data** in structured columns
- **Easy filtering and sorting** in Excel or Google Sheets
- **Bulk analysis friendly**

#### JSON Data
- **Developer-friendly** format
- **Complete API response** data
- **Easy integration** with other tools
- **Programmatic processing**

### Export Process
1. **Select Results**: Choose individual URLs or bulk results
2. **Choose Format**: PDF, CSV, or JSON
3. **Configure Options**: Include/exclude specific data fields
4. **Generate Export**: Click "Export" and wait for processing
5. **Download File**: Save to your device

### Export Options
- **Include Screenshots**: Add visual evidence to reports
- **Filter by Risk Level**: Export only threats or safe URLs
- **Date Range**: Export results from specific time periods
- **Custom Fields**: Include notes, tags, and project information

---

## 👥 Sharing Scan Results with Team

### Team Sharing Features (Business+ Plans)

#### Share Individual Results
1. **Click "Share"** on any scan result
2. **Choose recipients** from your team
3. **Add message** with context or instructions
4. **Set permissions**: View-only or allow re-scanning

#### Project-Based Sharing
1. **Assign URLs to projects** during scanning
2. **Team members** automatically see project results
3. **Role-based access** controls what team members can do
4. **Collaborative notes** and discussions on results

### External Sharing
1. **Generate shareable links** for specific results
2. **Password protection** for sensitive reports
3. **Expiration dates** for temporary access
4. **View-only access** for external stakeholders

---

## ⚡ Setting Up Automated Monitoring

### Monitoring Benefits
- **Continuous protection** for important URLs
- **Immediate alerts** when threats are detected
- **Trend tracking** over time
- **Proactive security** management

### Setting Up Monitoring
1. **From scan results**: Click "Enable Monitoring"
2. **Choose frequency**: Hourly, daily, weekly, or monthly
3. **Set alert thresholds**: When to notify you of changes
4. **Configure notifications**: Email, SMS, or dashboard alerts

### Monitoring Configuration
1. **Scan Type**: Choose monitoring scan depth
2. **Alert Conditions**:
   - Risk score increases
   - New threats detected
   - Site becomes unavailable
   - Content changes significantly
3. **Notification Preferences**:
   - Immediate alerts for high-risk changes
   - Daily summaries for routine monitoring
   - Weekly reports for trend analysis

### Managing Monitored URLs
1. **Dashboard** → **Monitoring** → **Active Monitors**
2. **View monitoring status** and recent alerts
3. **Modify settings** or pause monitoring
4. **Review monitoring history** and trends

---

## 🎯 Best Practices for Different Scenarios

### Checking Email Links
1. **Copy the full URL** from the email (right-click → Copy Link)
2. **Use Comprehensive Scan** for detailed analysis
3. **Check sender reputation** in addition to URL
4. **Look for URL shorteners** that might hide the real destination
5. **Be extra cautious** with urgent or threatening language

### Verifying Partner Websites
1. **Use Deep Scan** for thorough analysis
2. **Enable monitoring** for ongoing verification
3. **Document results** for compliance purposes
4. **Share results** with relevant team members
5. **Set up regular re-scanning** schedule

### Auditing Your Own Website
1. **Use Deep Scan with broken link detection**
2. **Scan all major pages** and entry points
3. **Monitor continuously** for security changes
4. **Address any issues** immediately
5. **Document security posture** for stakeholders

### Investigating Suspicious Domains
1. **Start with Quick Scan** for initial assessment
2. **Upgrade to Comprehensive** if threats detected
3. **Check domain reputation** and registration details
4. **Look for similar domains** that might be related
5. **Report findings** to community if confirmed malicious

---

## ❌ Common Mistakes to Avoid

### URL Format Issues
- **Missing protocol**: Always include `http://` or `https://`
- **Incomplete URLs**: Ensure the full path is included
- **Special characters**: Be careful with URLs containing spaces or symbols
- **Shortened URLs**: Consider expanding before scanning

### Scan Type Selection
- **Over-scanning**: Don't use Deep Scan for simple checks
- **Under-scanning**: Use Comprehensive for important security decisions
- **Wrong context**: Match scan type to your security needs
- **Ignoring limits**: Be aware of your plan's scanning limits

### Result Interpretation
- **Single provider focus**: Consider all provider results, not just one
- **Ignoring context**: Consider the source and purpose of the URL
- **False sense of security**: "Safe" doesn't mean "perfect"
- **Overreacting**: Low risk doesn't always mean immediate danger

### Security Practices
- **Visiting suspicious URLs**: Don't visit URLs that scan as dangerous
- **Sharing credentials**: Never enter passwords on suspicious sites
- **Ignoring warnings**: Take security alerts seriously
- **Delayed action**: Address high-risk findings immediately

---

## 💡 Tips for Faster Scanning

### Optimize Your Workflow
1. **Use bulk scanning** for multiple URLs
2. **Set up monitoring** instead of manual re-scanning
3. **Save frequently scanned URLs** to favorites
4. **Use projects** to organize related scans

### Plan Selection
1. **Upgrade your plan** for faster processing
2. **Higher plans get priority** in the scanning queue
3. **More concurrent scans** available with paid plans
4. **Advanced features** save time on complex analysis

### Technical Tips
1. **Use direct URLs** instead of redirects when possible
2. **Scan during off-peak hours** for faster processing
3. **Clear browser cache** if experiencing issues
4. **Use wired internet** for more reliable connections

### Batch Processing
1. **Prepare URL lists** in advance
2. **Use consistent formatting** to avoid errors
3. **Group similar URLs** for easier analysis
4. **Schedule large batches** during low-usage periods

---

## 🆘 Troubleshooting Common Issues

### Scan Failures
**Problem**: URL scan fails or times out
**Solutions**:
- Verify the URL is accessible and correctly formatted
- Try again in a few minutes (temporary server issues)
- Use a different scan type (Quick instead of Deep)
- Contact support if the issue persists

### Slow Results
**Problem**: Scans taking longer than expected
**Solutions**:
- Check your internet connection
- Try during off-peak hours
- Upgrade to a higher plan for priority processing
- Use Quick Scan for faster results

### Unexpected Results
**Problem**: Results don't match your expectations
**Solutions**:
- Try a different scan type for more detail
- Check multiple providers' individual results
- Re-scan the URL to confirm results
- Consider that the site may have changed recently

### Access Issues
**Problem**: Can't access certain features
**Solutions**:
- Verify you're logged in to your account
- Check your plan limits and upgrade if needed
- Clear browser cache and cookies
- Try a different browser or incognito mode

---

## 📚 Related Guides

- **[Getting Started Guide](../getting-started/QUICK_START.md)** - Basic LinkShield setup
- **[Key Concepts](../getting-started/KEY_CONCEPTS.md)** - Understanding security terminology
- **[URL Checking Feature Guide](../features/URL_CHECKING.md)** - Comprehensive feature documentation
- **[How to Monitor Social Media](HOW_TO_MONITOR_SOCIAL_MEDIA.md)** - Social media protection
- **[How to Use AI Analysis](HOW_TO_USE_AI_ANALYSIS.md)** - AI-powered content analysis

**Need help?** Contact our support team at [support@linkshield.com](mailto:support@linkshield.com) or visit our [community forum](https://community.linkshield.com) for additional assistance with URL checking.
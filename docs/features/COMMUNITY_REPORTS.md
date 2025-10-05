# Community Reports Feature Guide

Community Reports is LinkShield's collaborative threat intelligence system that harnesses the collective knowledge of our global user community to identify, verify, and respond to emerging security threats. This comprehensive guide covers everything from submitting your first report to understanding the moderation process.

## 🌐 Feature Overview

### What are Community Reports?

Community Reports represent a crowdsourced approach to cybersecurity, where users from around the world contribute threat intelligence by reporting suspicious websites, phishing attempts, malware distribution sites, and other security concerns. This collaborative system creates a real-time, global threat intelligence network that benefits all LinkShield users.

### Key Benefits

- **Real-Time Threat Intelligence**: Immediate awareness of emerging threats from the community
- **Global Coverage**: Worldwide network of users identifying regional and international threats
- **Rapid Response**: Quick identification and verification of new threats
- **Collective Knowledge**: Leverage the expertise and experience of thousands of users
- **Verified Intelligence**: Community voting and expert moderation ensure report quality
- **Threat Trends**: Identify patterns and campaigns through aggregated reports

### How It Works

1. **Community Reporting**: Users submit reports about suspicious or malicious content
2. **Community Voting**: Other users vote on report accuracy and helpfulness
3. **Expert Moderation**: Security analysts review and verify high-impact reports
4. **Intelligence Integration**: Verified reports enhance LinkShield's threat detection
5. **Global Protection**: All users benefit from improved threat identification

## 📝 Report Types

### PHISHING 🎣
**Phishing or Social Engineering Attempts**

Reports for websites attempting to steal credentials, personal information, or deceive users through impersonation.

#### Common Examples:
- Fake login pages mimicking legitimate services
- Brand impersonation websites
- Credential harvesting forms
- Social engineering schemes
- Business email compromise attempts

#### Evidence Requirements:
- Screenshots of the suspicious page
- URL of the phishing site
- Description of the impersonated brand or service
- Any received emails or messages directing to the site

### MALWARE 🦠
**Malware Distribution Sites**

Reports for websites hosting, distributing, or attempting to install malicious software.

#### Common Examples:
- Drive-by download sites
- Fake software download pages
- Exploit kits and malicious scripts
- Trojan distribution networks
- Ransomware delivery sites

#### Evidence Requirements:
- URL of the malicious site
- Description of the malware behavior
- Screenshots of download prompts or warnings
- Antivirus detection results if available

### SPAM 📧
**Spam or Unwanted Content**

Reports for websites promoting spam, unwanted marketing, or deceptive advertising practices.

#### Common Examples:
- Aggressive pop-up advertising
- Deceptive marketing schemes
- Unwanted subscription services
- Misleading promotional content
- Spam email landing pages

#### Evidence Requirements:
- URL of the spam content
- Screenshots of unwanted content
- Description of deceptive practices
- Evidence of unwanted redirects or pop-ups

### SCAM 💰
**Fraudulent Websites**

Reports for websites involved in financial fraud, fake services, or deceptive business practices.

#### Common Examples:
- Fake online stores
- Investment scams and Ponzi schemes
- Cryptocurrency fraud
- Romance scams
- Tech support scams

#### Evidence Requirements:
- URL of the fraudulent site
- Screenshots of deceptive claims
- Evidence of fake products or services
- Financial transaction details (if applicable)

### INAPPROPRIATE 🚫
**Offensive or Harmful Content**

Reports for websites containing content that violates community standards or poses harm to users.

#### Common Examples:
- Hate speech and discriminatory content
- Violent or disturbing material
- Content harmful to minors
- Harassment or doxxing sites
- Extremist content

#### Evidence Requirements:
- URL of the inappropriate content
- Screenshots of offensive material
- Description of policy violations
- Context about potential harm

### COPYRIGHT 📄
**Copyright Infringement**

Reports for websites illegally distributing copyrighted material or violating intellectual property rights.

#### Common Examples:
- Pirated software distribution
- Illegal movie and music streaming
- Counterfeit product sales
- Trademark infringement
- Stolen content republication

#### Evidence Requirements:
- URL of the infringing content
- Evidence of original copyright ownership
- Screenshots of infringing material
- DMCA takedown notices (if applicable)

### OTHER ❓
**Other Security Violations**

Reports for security issues that don't fit into the above categories but pose risks to users.

#### Common Examples:
- Privacy violations
- Data breaches
- Suspicious redirects
- Broken security implementations
- Unusual or concerning behavior

#### Evidence Requirements:
- URL of the concerning site
- Detailed description of the issue
- Screenshots or technical evidence
- Explanation of potential risks

## 📤 Submitting Security Reports

### Required Information

#### Essential Fields
- **URL**: The complete URL of the reported site (required)
- **Report Type**: Select the most appropriate category from the list above
- **Description**: Detailed explanation of the threat or issue (minimum 50 characters)
- **Evidence**: Supporting documentation, screenshots, or technical details

#### Optional but Helpful
- **Tags**: Relevant keywords for categorization and search
- **Severity**: Your assessment of the threat level
- **Affected Platforms**: Browsers, devices, or systems impacted
- **Geographic Region**: Location-specific threats or restrictions

### Using Report Templates

LinkShield provides pre-formatted templates to help you submit comprehensive reports:

#### Phishing Report Template
```
**Impersonated Brand:** [Brand Name]
**Suspicious Elements:** 
- Fake login form
- Misspelled domain
- Urgent language

**Evidence:**
- Screenshot of fake page
- Comparison with legitimate site
- Email or message directing to site

**Additional Notes:** [Any other relevant information]
```

#### Malware Report Template
```
**Malware Type:** [Trojan/Virus/Ransomware/etc.]
**Distribution Method:** [Drive-by download/Email attachment/etc.]
**Affected Systems:** [Windows/Mac/Mobile/etc.]

**Evidence:**
- Antivirus detection results
- Behavioral analysis
- Network traffic analysis

**Additional Notes:** [Technical details or IOCs]
```

### Step-by-Step Submission Process

1. **Access Report Form**: Navigate to Dashboard → Community Reports → Submit Report
2. **Enter URL**: Paste the complete URL of the suspicious site
3. **Select Report Type**: Choose the most appropriate category
4. **Provide Description**: Write a detailed explanation of the threat
5. **Upload Evidence**: Add screenshots, documents, or other supporting materials
6. **Add Tags**: Include relevant keywords for categorization
7. **Review Submission**: Double-check all information for accuracy
8. **Submit Report**: Click "Submit Report" to add it to the community queue

### Evidence Best Practices

#### Screenshots
- **Full Page Captures**: Include complete page screenshots when possible
- **Highlight Suspicious Elements**: Use annotations to point out concerning features
- **Multiple Views**: Capture different pages or states of the site
- **Browser Information**: Include browser and timestamp information

#### Technical Evidence
- **Network Analysis**: Wireshark captures or network logs
- **Source Code**: Relevant HTML, JavaScript, or other code snippets
- **Headers and Metadata**: HTTP headers, WHOIS information, DNS records
- **Behavioral Analysis**: Descriptions of site behavior and user interactions

## 🔍 Browsing Community Reports

### Report Discovery

#### Main Reports Feed
- **Latest Reports**: Most recently submitted reports
- **Trending Reports**: Reports receiving significant community attention
- **Verified Reports**: Reports confirmed by moderation team
- **High Priority**: Critical threats requiring immediate attention

#### Search and Filtering

**Filter Options:**
- **Report Type**: Filter by PHISHING, MALWARE, SPAM, SCAM, etc.
- **Status**: Active, Under Review, Verified, Dismissed
- **Priority**: Critical, High, Medium, Low
- **Domain**: Filter by specific domains or domain patterns
- **Tags**: Search by user-assigned tags
- **Date Range**: Reports from specific time periods
- **Geographic Region**: Location-based filtering
- **Reporter**: Reports from specific users (if public)

**Search Functionality:**
- **Keyword Search**: Search report descriptions and titles
- **URL Search**: Find reports for specific URLs or domains
- **Tag Search**: Search by community-assigned tags
- **Advanced Search**: Combine multiple criteria for precise results

### Pagination and Navigation

#### Results Display
- **List View**: Compact view showing essential report information
- **Card View**: Detailed view with thumbnails and extended descriptions
- **Table View**: Sortable columns for technical analysis
- **Map View**: Geographic distribution of reports (when location data available)

#### Sorting Options
- **Newest First**: Most recently submitted reports
- **Oldest First**: Historical reports and trends
- **Most Voted**: Reports with highest community engagement
- **Highest Priority**: Critical threats first
- **Most Verified**: Reports with strongest community consensus

## 📋 Report Details and Information

### Report Information Display

#### Basic Information
- **Report ID**: Unique identifier for tracking and reference
- **Submission Date**: When the report was first submitted
- **Reporter**: Username or anonymous indicator
- **Report Type**: Category classification
- **Status**: Current moderation and verification status
- **Priority Level**: Community and moderator-assigned priority

#### Threat Details
- **URL**: Complete URL of the reported site
- **Description**: Detailed explanation of the threat
- **Evidence**: Screenshots, documents, and supporting materials
- **Tags**: Community-assigned keywords and categories
- **Technical Details**: IOCs, network information, and analysis data

#### Community Engagement
- **Vote Counts**: Helpful vs. Not Helpful vote tallies
- **Comments**: Community discussion and additional information
- **Similar Reports**: Related reports and threat patterns
- **Follow-up Reports**: Updates and additional findings

### Vote Counts and Breakdown

#### Voting System
- **Helpful Votes**: Community members who found the report accurate and useful
- **Not Helpful Votes**: Community members who questioned report accuracy
- **Vote Ratio**: Percentage breakdown of community consensus
- **Voter Reputation**: Weighted voting based on reporter credibility

#### Vote Analysis
- **Consensus Level**: Strong, moderate, or weak community agreement
- **Expert Votes**: Votes from verified security professionals
- **Geographic Distribution**: Regional voting patterns
- **Temporal Trends**: How voting patterns change over time

### Moderation Status

#### Status Categories

**PENDING** ⏳
- **Description**: Report submitted and awaiting initial review
- **Timeline**: Typically reviewed within 24-48 hours
- **Community Action**: Available for voting and discussion

**UNDER_REVIEW** 🔍
- **Description**: Report being actively investigated by moderation team
- **Timeline**: 2-7 days depending on complexity
- **Community Action**: Voting continues, additional evidence welcomed

**VERIFIED** ✅
- **Description**: Report confirmed as accurate by moderation team
- **Impact**: Integrated into LinkShield threat intelligence
- **Community Action**: Continues to accept votes and comments

**DISMISSED** ❌
- **Description**: Report determined to be inaccurate or duplicate
- **Reason**: Explanation provided for dismissal decision
- **Community Action**: Archived but available for reference

**DUPLICATE** 🔄
- **Description**: Report covers same threat as existing report
- **Reference**: Link to original report
- **Community Action**: Votes and comments merged with original

## 🗳️ Voting on Reports

### Voting System

#### Vote Types
- **Helpful**: Report is accurate, well-documented, and useful
- **Not Helpful**: Report is inaccurate, poorly documented, or misleading

#### Voting Criteria
- **Accuracy**: Is the reported threat real and correctly identified?
- **Evidence Quality**: Are screenshots and documentation sufficient?
- **Description Clarity**: Is the threat clearly explained?
- **Relevance**: Is this a significant security concern?
- **Uniqueness**: Does this report add new information?

### Voting Process

1. **Review Report**: Carefully read the report description and examine evidence
2. **Verify Claims**: Check the reported URL and validate threat claims
3. **Assess Quality**: Evaluate the completeness and accuracy of information
4. **Cast Vote**: Select "Helpful" or "Not Helpful" based on your assessment
5. **Add Comment**: Optionally provide additional context or information
6. **Track Impact**: Monitor how your vote contributes to community consensus

### Voting Best Practices

#### Before Voting
- **Visit the URL**: Safely examine the reported site (use caution)
- **Cross-Reference**: Check other security sources and databases
- **Review Evidence**: Examine all provided screenshots and documentation
- **Consider Context**: Understand the threat landscape and current campaigns

#### Quality Voting
- **Be Objective**: Base votes on evidence, not personal opinions
- **Provide Feedback**: Comment on why you voted a certain way
- **Update Votes**: Change votes if new evidence emerges
- **Report Issues**: Flag inappropriate or spam reports

## 📊 Report Statistics and Trends

### Community Statistics

#### Overall Metrics
- **Total Reports**: Cumulative reports submitted by the community
- **Active Reports**: Reports currently under investigation
- **Verified Reports**: Reports confirmed by moderation
- **Community Participation**: Number of active reporters and voters

#### Report Type Distribution
- **Phishing Reports**: Percentage and trends over time
- **Malware Reports**: Distribution and seasonal patterns
- **Scam Reports**: Geographic and temporal trends
- **Other Categories**: Breakdown of all report types

### Threat Intelligence Trends

#### Emerging Threats
- **New Attack Vectors**: Recently identified threat methods
- **Campaign Tracking**: Coordinated attack campaigns
- **Geographic Hotspots**: Regions with high threat activity
- **Temporal Patterns**: Seasonal and time-based threat trends

#### Community Impact
- **Threat Prevention**: Estimated threats blocked through community reports
- **Response Time**: Average time from report to verification
- **Accuracy Rates**: Community reporting accuracy statistics
- **Global Coverage**: Geographic distribution of reporting activity

### Personal Statistics

#### Your Reporting Activity
- **Reports Submitted**: Total number of reports you've contributed
- **Verification Rate**: Percentage of your reports that were verified
- **Community Impact**: How many users benefited from your reports
- **Reputation Score**: Your credibility rating within the community

#### Voting Activity
- **Votes Cast**: Total number of votes on community reports
- **Voting Accuracy**: How often your votes align with final moderation decisions
- **Helpful Contributions**: Comments and additional evidence provided
- **Community Recognition**: Acknowledgments from other users

## 🛡️ Moderation Process and Transparency

### Moderation Team

#### Team Composition
- **Security Analysts**: Professional cybersecurity experts
- **Community Moderators**: Experienced community members with elevated privileges
- **Automated Systems**: AI-powered initial screening and duplicate detection
- **External Experts**: Specialists for complex or specialized threats

#### Moderation Criteria
- **Threat Validity**: Is the reported threat real and active?
- **Evidence Quality**: Is sufficient evidence provided to support claims?
- **Impact Assessment**: What is the potential harm to users?
- **Duplicate Check**: Has this threat already been reported?
- **Community Consensus**: What does community voting indicate?

### Moderation Process

#### Initial Screening (0-24 hours)
1. **Automated Analysis**: AI systems check for obvious spam or duplicates
2. **Basic Validation**: Verify URL accessibility and basic threat indicators
3. **Priority Assignment**: Assign priority based on threat severity
4. **Community Release**: Make report available for community voting

#### Community Review (1-7 days)
1. **Community Voting**: Users vote on report accuracy and helpfulness
2. **Evidence Gathering**: Additional evidence and context from community
3. **Discussion**: Community comments and analysis
4. **Expert Input**: Security professionals provide technical analysis

#### Final Moderation (2-14 days)
1. **Expert Review**: Security analysts examine all evidence
2. **Verification Testing**: Independent verification of reported threats
3. **Decision Making**: Final determination on report status
4. **Integration**: Verified threats integrated into LinkShield systems

### Transparency Measures

#### Public Information
- **Moderation Guidelines**: Clear criteria for report evaluation
- **Decision Explanations**: Reasons provided for verification or dismissal
- **Appeal Process**: Mechanism for challenging moderation decisions
- **Statistics**: Regular publication of moderation statistics and trends

#### Community Feedback
- **Moderation Reviews**: Community feedback on moderation decisions
- **Process Improvements**: Regular updates to moderation procedures
- **Community Input**: User suggestions for improving the system
- **Transparency Reports**: Quarterly reports on moderation activities

## 💡 Best Practices for Reporting

### Quality Reporting Guidelines

#### Before Submitting
- **Verify the Threat**: Ensure the reported site is actually malicious
- **Check for Duplicates**: Search existing reports to avoid duplicates
- **Gather Evidence**: Collect comprehensive documentation
- **Choose Correct Category**: Select the most appropriate report type

#### Writing Effective Reports
- **Be Specific**: Provide detailed, factual descriptions
- **Include Context**: Explain how you discovered the threat
- **Document Everything**: Provide screenshots and technical details
- **Use Clear Language**: Write descriptions that others can understand

#### Evidence Collection
- **Multiple Screenshots**: Capture different aspects of the threat
- **Technical Details**: Include URLs, IP addresses, and other IOCs
- **Behavioral Description**: Explain what the malicious site does
- **Impact Assessment**: Describe potential harm to users

### Common Mistakes to Avoid

#### Poor Quality Reports
- **Vague Descriptions**: "This site looks suspicious" without details
- **Missing Evidence**: Reports without screenshots or documentation
- **Wrong Categories**: Misclassifying the type of threat
- **Duplicate Submissions**: Not checking for existing reports

#### False Positives
- **Legitimate Sites**: Reporting legitimate websites due to misunderstanding
- **Personal Disputes**: Using reports to target sites for non-security reasons
- **Outdated Information**: Reporting threats that have already been resolved
- **Insufficient Investigation**: Not properly verifying threats before reporting

### Building Community Reputation

#### Positive Contributions
- **Accurate Reports**: Submit well-researched, verified threats
- **Quality Evidence**: Provide comprehensive documentation
- **Helpful Voting**: Vote accurately on other community reports
- **Constructive Comments**: Add valuable insights to report discussions

#### Community Engagement
- **Regular Participation**: Consistently contribute to community security
- **Knowledge Sharing**: Share expertise and experience with others
- **Mentoring**: Help new users understand the reporting process
- **Feedback**: Provide constructive feedback on community processes

## 🔧 API Integration

### Developer Access

#### Authentication
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.linkshield.com/v1/community-reports
```

#### Submit Report Endpoint
```bash
curl -X POST https://api.linkshield.com/v1/community-reports \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://suspicious-site.com",
    "report_type": "PHISHING",
    "description": "Fake login page impersonating major bank",
    "evidence": ["screenshot1.png", "screenshot2.png"],
    "tags": ["banking", "credential-theft", "phishing"]
  }'
```

#### Browse Reports Endpoint
```bash
curl -X GET "https://api.linkshield.com/v1/community-reports?type=PHISHING&status=VERIFIED&limit=50" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Vote on Report Endpoint
```bash
curl -X POST https://api.linkshield.com/v1/community-reports/{report_id}/vote \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "vote": "helpful",
    "comment": "Confirmed phishing site, excellent documentation"
  }'
```

### Rate Limits and Usage

#### API Rate Limits
- **Free Plan**: 20 submissions per hour, 100 votes per hour
- **Pro Plan**: 100 submissions per hour, 500 votes per hour
- **Business Plan**: 500 submissions per hour, 2,000 votes per hour
- **Enterprise Plan**: Custom limits based on requirements

#### Best Practices
- **Batch Operations**: Group related API calls when possible
- **Caching**: Store frequently accessed report data locally
- **Error Handling**: Implement robust error handling for rate limits
- **Monitoring**: Track API usage against plan limits

### Response Formats

#### Report Submission Response
```json
{
  "report_id": "cr_12345",
  "status": "pending",
  "submission_time": "2024-01-15T10:30:00Z",
  "estimated_review_time": "24-48 hours",
  "community_voting_enabled": true,
  "priority": "medium"
}
```

#### Report Details Response
```json
{
  "report_id": "cr_12345",
  "url": "https://suspicious-site.com",
  "report_type": "PHISHING",
  "status": "verified",
  "priority": "high",
  "submission_time": "2024-01-15T10:30:00Z",
  "verification_time": "2024-01-16T14:22:00Z",
  "votes": {
    "helpful": 47,
    "not_helpful": 3,
    "total": 50
  },
  "moderation": {
    "status": "verified",
    "moderator_notes": "Confirmed phishing site targeting banking credentials",
    "verification_confidence": 0.95
  }
}
```

## 🚨 Crisis Response and Urgent Reports

### High-Priority Threat Reporting

#### Critical Threat Indicators
- **Active Widespread Campaigns**: Threats affecting many users
- **Zero-Day Exploits**: Previously unknown vulnerabilities
- **Nation-State Attacks**: Advanced persistent threats
- **Critical Infrastructure**: Threats to essential services
- **Mass Data Breaches**: Large-scale data exposure incidents

#### Expedited Processing
- **Fast-Track Review**: Priority processing within 2-4 hours
- **Expert Analysis**: Immediate security analyst attention
- **Community Alerts**: Rapid notification to community members
- **Integration**: Immediate integration into LinkShield protection systems

### Emergency Reporting Process

1. **Mark as Critical**: Use the "Critical Priority" flag when submitting
2. **Provide Justification**: Explain why the threat requires urgent attention
3. **Include Comprehensive Evidence**: Provide all available documentation
4. **Contact Support**: For truly critical threats, also contact support directly
5. **Monitor Response**: Track the expedited review process

## 🆘 Troubleshooting and Support

### Common Issues

#### Report Submission Problems
- **Upload Failures**: Issues uploading evidence files
- **Form Validation**: Required field errors or format issues
- **Duplicate Detection**: System flagging legitimate reports as duplicates
- **Category Selection**: Uncertainty about appropriate report type

#### Voting and Interaction Issues
- **Vote Not Registering**: Technical issues with voting system
- **Comment Posting**: Problems adding comments to reports
- **Notification Issues**: Not receiving updates on report status
- **Search Problems**: Difficulty finding specific reports

### Getting Help

#### Self-Service Resources
- **FAQ Section**: Common questions about community reporting
- **Video Tutorials**: Step-by-step guides for reporting and voting
- **Community Guidelines**: Detailed rules and best practices
- **Technical Documentation**: API guides and integration help

#### Support Channels
- **Community Forum**: Peer support and discussion
- **Email Support**: [reports@linkshield.com](mailto:reports@linkshield.com)
- **Live Chat**: Available for paid plan users
- **Priority Support**: Dedicated support for Business and Enterprise plans

#### Reporting Issues
- **Bug Reports**: Technical issues with the reporting system
- **Moderation Appeals**: Challenging moderation decisions
- **User Conduct**: Reporting inappropriate behavior
- **Feature Requests**: Suggestions for improving the system

---

## 📚 Related Documentation

- **[Getting Started Guide](../getting-started/QUICK_START.md)** - Basic LinkShield setup and first steps
- **[Key Concepts](../getting-started/KEY_CONCEPTS.md)** - Understanding community intelligence terminology
- **[URL Checking Guide](URL_CHECKING.md)** - Traditional URL security analysis
- **[AI Analysis Guide](AI_ANALYSIS.md)** - AI-powered content analysis
- **[API Reference](../api/API_REFERENCE.md)** - Complete developer documentation

**Need assistance?** Contact our support team at [support@linkshield.com](mailto:support@linkshield.com) or visit our [community forum](https://community.linkshield.com) for help with Community Reports features.
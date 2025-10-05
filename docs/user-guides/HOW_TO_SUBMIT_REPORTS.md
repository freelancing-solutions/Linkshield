# How to Submit Community Reports

Community reports are a vital part of LinkShield's security ecosystem. By submitting reports about suspicious URLs, phishing attempts, malware, and other threats, you help protect the entire community. This guide will walk you through the process of submitting effective security reports.

## Table of Contents

1. [When to Submit a Report](#when-to-submit-a-report)
2. [Report Types](#report-types)
3. [Before You Submit](#before-you-submit)
4. [Gathering Evidence](#gathering-evidence)
5. [Submitting Your Report](#submitting-your-report)
6. [Writing Effective Descriptions](#writing-effective-descriptions)
7. [Tracking Your Report](#tracking-your-report)
8. [Report Moderation Process](#report-moderation-process)
9. [Voting on Reports](#voting-on-reports)
10. [Best Practices](#best-practices)
11. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
12. [Getting Help](#getting-help)

## When to Submit a Report

Submit a community report when you encounter:

### Immediate Threats
- **Phishing websites** attempting to steal credentials
- **Malware downloads** or infected files
- **Scam websites** requesting money or personal information
- **Fake login pages** mimicking legitimate services

### Suspicious Content
- **Suspicious URLs** with unusual behavior
- **Spam campaigns** targeting users
- **Inappropriate content** violating community standards
- **Copyright infringement** of protected material

### Urgent Situations
- **Active attacks** targeting users
- **Data breaches** exposing personal information
- **Financial fraud** schemes
- **Identity theft** attempts

## Report Types

Choose the most appropriate report type for your submission:

### 🎣 Phishing
For websites attempting to steal login credentials, personal information, or financial data.

**Examples:**
- Fake banking login pages
- Counterfeit social media login forms
- Fraudulent payment processors
- Credential harvesting sites

### 🦠 Malware
For websites hosting or distributing malicious software.

**Examples:**
- Drive-by download sites
- Infected file repositories
- Trojan distribution points
- Ransomware delivery sites

### 📧 Spam
For unsolicited bulk messages or promotional content.

**Examples:**
- Mass email campaigns
- Comment spam
- Social media spam
- Unwanted promotional content

### 💰 Scam
For fraudulent schemes designed to steal money or valuables.

**Examples:**
- Investment fraud
- Romance scams
- Tech support scams
- Cryptocurrency fraud

### 🚫 Inappropriate Content
For content violating community standards.

**Examples:**
- Hate speech
- Harassment
- Adult content in inappropriate contexts
- Violence or threats

### ©️ Copyright Infringement
For unauthorized use of copyrighted material.

**Examples:**
- Pirated software distribution
- Unauthorized media streaming
- Stolen content republication
- Trademark violations

### 🔍 Other
For threats that don't fit other categories.

**Examples:**
- Privacy violations
- Terms of service violations
- Suspicious behavior
- Emerging threat types

## Before You Submit

### Check for Existing Reports
1. **Search existing reports** to avoid duplicates
2. **Review similar submissions** for additional context
3. **Check report status** to see if the threat is already being addressed

### Verify the Threat
1. **Confirm the suspicious behavior** you're reporting
2. **Test from multiple devices** if possible
3. **Document the threat** with screenshots and details
4. **Note the time and date** of your discovery

### Gather Required Information
- **URL or content location**
- **Threat description**
- **Evidence files** (screenshots, headers, etc.)
- **Impact assessment**
- **Discovery details**

## Gathering Evidence

Strong evidence makes your report more credible and actionable.

### Screenshots
**What to capture:**
- Full browser window showing the suspicious content
- URL bar clearly visible
- Any error messages or warnings
- Suspicious forms or input fields
- Download prompts or malware warnings

**Best practices:**
- Use high resolution (1920x1080 or higher)
- Capture multiple angles of the threat
- Include timestamps when possible
- Highlight suspicious elements with annotations

### URL Information
**Essential details:**
- Complete URL including parameters
- Redirect chain if applicable
- Domain registration information
- IP address and hosting details
- SSL certificate information

**Tools to use:**
- Browser developer tools
- URL analysis services
- WHOIS lookup tools
- DNS investigation tools

### Email Headers
For email-based threats, include:
- **Full email headers** showing routing information
- **Sender authentication** results (SPF, DKIM, DMARC)
- **Received timestamps** and server information
- **Message-ID** and other unique identifiers

### Network Evidence
For advanced threats:
- **Network traffic** captures (if safe to obtain)
- **DNS queries** and responses
- **HTTP request/response** details
- **Certificate information**

### Transaction Details
For financial scams:
- **Payment requests** and methods
- **Account information** requested
- **Transaction amounts** and currencies
- **Communication records**

## Submitting Your Report

### Step 1: Access the Report Form
1. Navigate to **Community Reports** in your dashboard
2. Click **"Submit New Report"**
3. Choose the appropriate **report type**

### Step 2: Fill Out Basic Information
```
Report Type: [Select from dropdown]
URL/Content: [Enter the suspicious URL or content location]
Threat Level: [Low/Medium/High/Critical]
Discovery Date: [When you first noticed the threat]
```

### Step 3: Provide Detailed Description
Write a clear, comprehensive description including:
- **What you observed** that seemed suspicious
- **How you discovered** the threat
- **What actions** the threat attempts to perform
- **Who might be targeted** by this threat
- **Any additional context** that might be relevant

### Step 4: Upload Evidence
- **Screenshots** (PNG, JPG, up to 10MB each)
- **Email files** (.eml, .msg format)
- **Network captures** (.pcap, .har files)
- **Documents** (PDF, TXT for additional context)

### Step 5: Set Report Visibility
- **Public**: Visible to all community members
- **Verified Users Only**: Visible to verified community members
- **Private**: Visible only to moderators (for sensitive reports)

### Step 6: Review and Submit
1. **Review all information** for accuracy
2. **Check evidence uploads** are complete
3. **Verify contact information** for follow-up
4. **Submit the report**

## Writing Effective Descriptions

### Structure Your Description
```markdown
## Summary
Brief overview of the threat in 1-2 sentences.

## Discovery
How and when you found this threat.

## Threat Details
Specific actions the threat performs or attempts.

## Evidence
Description of attached evidence files.

## Impact
Who is affected and how serious the threat is.

## Additional Notes
Any other relevant information.
```

### Use Clear Language
- **Be specific** rather than vague
- **Use technical terms** appropriately
- **Explain acronyms** and technical concepts
- **Write for a general audience** while including technical details

### Include Context
- **Timeline** of events
- **Related threats** or campaigns
- **Affected platforms** or services
- **Geographic targeting** if applicable

### Example Description
```
## Summary
Phishing website impersonating PayPal login page to steal user credentials.

## Discovery
Discovered on January 15, 2024, through a suspicious email claiming account suspension.

## Threat Details
The site presents a convincing PayPal login form that captures usernames and passwords. After submission, users are redirected to the legitimate PayPal site, making the attack less obvious.

## Evidence
- Screenshot showing fake login page
- Email header showing suspicious sender
- Network analysis showing data transmission to unknown server

## Impact
Targets PayPal users globally, potentially affecting millions of users who might receive similar phishing emails.

## Additional Notes
The domain was registered 3 days ago and uses a similar-looking URL (paypaI.com with capital i instead of l).
```

## Tracking Your Report

### Report Status Indicators
- **📝 Submitted**: Report received and queued for review
- **👀 Under Review**: Moderators are investigating
- **✅ Verified**: Threat confirmed and added to database
- **❌ Rejected**: Report doesn't meet criteria or is duplicate
- **🔄 Needs More Info**: Additional evidence or details required
- **⚠️ Escalated**: High-priority threat requiring immediate attention

### Notifications
You'll receive notifications for:
- **Status changes** on your reports
- **Moderator comments** or questions
- **Community votes** on your reports
- **Verification results**

### Report Dashboard
Access your report history:
1. Go to **Community Reports** → **My Reports**
2. View **status updates** and **community feedback**
3. **Respond to moderator** requests for additional information
4. **Track verification** progress

## Report Moderation Process

### Initial Review (24-48 hours)
- **Automated screening** for obvious spam or duplicates
- **Basic validation** of evidence and information
- **Priority assignment** based on threat level

### Expert Analysis (2-7 days)
- **Technical verification** of the reported threat
- **Evidence validation** and additional research
- **Impact assessment** and risk scoring

### Community Validation
- **Peer review** by verified community members
- **Voting on report** accuracy and usefulness
- **Additional evidence** from other users

### Final Decision
- **Verification status** assigned
- **Database integration** for verified threats
- **Feedback provided** to reporter

## Voting on Reports

Help improve report quality by voting on submissions:

### How to Vote
1. Browse **Community Reports** → **Recent Submissions**
2. Review the **report details** and evidence
3. Cast your vote: **👍 Helpful** or **👎 Not Helpful**
4. Optionally **add comments** with additional insights

### Voting Guidelines
**Vote "Helpful" for reports that:**
- Provide clear, actionable threat information
- Include sufficient evidence
- Are well-documented and detailed
- Identify genuine security threats

**Vote "Not Helpful" for reports that:**
- Lack sufficient evidence
- Are duplicates of existing reports
- Contain inaccurate information
- Don't represent actual threats

### Building Reputation
- **Quality reports** earn positive community votes
- **Helpful voting** increases your community standing
- **Expert contributors** gain additional privileges
- **Top reporters** receive recognition and rewards

## Best Practices

### Quality Over Quantity
- **Submit fewer, high-quality reports** rather than many low-quality ones
- **Research thoroughly** before submitting
- **Provide comprehensive evidence** for each report
- **Follow up** on requests for additional information

### Be Specific and Detailed
- **Include exact URLs** and timestamps
- **Describe specific behaviors** rather than general suspicions
- **Provide step-by-step** reproduction instructions
- **Document the full attack** chain when possible

### Collaborate with the Community
- **Respond to comments** and questions on your reports
- **Vote on other reports** to help with validation
- **Share additional evidence** when you find it
- **Learn from feedback** to improve future reports

### Stay Updated
- **Follow threat trends** and emerging attack patterns
- **Learn from verified reports** to understand what makes good submissions
- **Participate in community discussions** about security threats
- **Update your knowledge** of new threat types

### Protect Privacy
- **Redact personal information** from screenshots
- **Avoid sharing sensitive data** in public reports
- **Use private reports** for sensitive discoveries
- **Respect victim privacy** when reporting incidents

## Common Mistakes to Avoid

### Insufficient Evidence
❌ **Don't submit reports with:**
- Only a URL without context
- Blurry or incomplete screenshots
- Vague descriptions of suspicious behavior
- No supporting documentation

✅ **Do provide:**
- Multiple forms of evidence
- Clear, high-quality screenshots
- Detailed descriptions
- Relevant technical information

### Duplicate Reports
❌ **Avoid:**
- Submitting reports for already-known threats
- Creating multiple reports for the same URL
- Ignoring existing community discussions

✅ **Instead:**
- Search existing reports first
- Add evidence to existing reports when possible
- Reference related reports in your submission

### Emotional or Biased Language
❌ **Don't use:**
- Inflammatory language
- Personal opinions as facts
- Unsubstantiated claims
- Emotional appeals

✅ **Use:**
- Objective, factual descriptions
- Technical evidence
- Neutral language
- Professional tone

### Incomplete Information
❌ **Avoid submitting reports with:**
- Missing URLs or locations
- No description of the threat
- Incomplete evidence
- No contact information

✅ **Always include:**
- Complete threat details
- All relevant evidence
- Clear descriptions
- Contact information for follow-up

## Getting Help

### Documentation Resources
- **[Community Reports Feature Guide](../features/COMMUNITY_REPORTS.md)** - Comprehensive feature overview
- **[Getting Started Guide](../getting-started/QUICK_START.md)** - Basic platform introduction
- **[FAQ Section](#)** - Common questions and answers

### Community Support
- **Community Forums** - Discuss reports with other users
- **Expert Reviewers** - Get feedback from security professionals
- **Moderator Support** - Direct assistance with report issues

### Contact Support
For urgent threats or technical issues:
- **Email**: security@linkshield.com
- **Emergency Hotline**: Available for critical threats
- **Support Ticket**: Through your dashboard

### Reporting Bugs
If you encounter technical issues with the reporting system:
1. **Document the problem** with screenshots
2. **Note your browser** and operating system
3. **Describe the steps** that led to the issue
4. **Submit a support ticket** with all details

---

## Related Documentation

- **[Community Reports Feature](../features/COMMUNITY_REPORTS.md)** - Complete feature overview
- **[How to Check URLs](HOW_TO_CHECK_URLS.md)** - URL analysis guide
- **[How to Use AI Analysis](HOW_TO_USE_AI_ANALYSIS.md)** - AI-powered threat detection
- **[Getting Started](../getting-started/QUICK_START.md)** - Platform basics

---

*Last updated: January 2024*
*For the most current information, visit [docs.linkshield.com](https://docs.linkshield.com)*
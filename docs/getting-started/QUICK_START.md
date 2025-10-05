# Quick Start Guide

Get up and running with LinkShield in just 5 minutes! This guide will walk you through the essential steps to start protecting yourself from online threats.

## 🚀 5-Minute Setup

### Step 1: Check Your First URL (No Account Required)

You can start using LinkShield immediately without creating an account:

1. **Visit the Homepage**: Go to [linkshield.com](https://linkshield.com)
2. **Enter a URL**: Paste any suspicious link into the URL checker
3. **Click "Check URL"**: Get instant security analysis
4. **Review Results**: See the risk score, threat level, and detailed analysis

**Example URLs to try:**
- `https://google.com` (should be SAFE)
- `https://example-phishing-site.com` (educational example)
- Any suspicious link you've received via email or social media

**What you'll see:**
- **Risk Score**: 0-100 scale (0 = safe, 100 = dangerous)
- **Threat Level**: SAFE, SUSPICIOUS, or MALICIOUS
- **Provider Results**: Analysis from multiple security engines
- **Detailed Report**: Breakdown of potential threats found

### Step 2: Create Your Account (Recommended)

Creating an account unlocks additional features and higher usage limits:

1. **Click "Sign Up"** in the top navigation
2. **Enter your details**:
   - Email address
   - Secure password
   - Full name
3. **Verify your email**: Check your inbox and click the verification link
4. **Complete your profile**: Add any additional information

**Benefits of having an account:**
- Higher daily scan limits
- Scan history and saved results
- Project organization and management
- Access to dashboard analytics
- API key generation for developers

### Step 3: Explore the Dashboard

Once logged in, you'll have access to the comprehensive dashboard:

1. **Navigate to Dashboard**: Click "Dashboard" in the main navigation
2. **Overview Section**: See your recent scans and account statistics
3. **Projects**: Organize your URLs into logical groups
4. **History**: Review all your previous URL scans
5. **Settings**: Customize your account preferences

**Key dashboard features:**
- **Recent Activity**: Your latest URL scans and results
- **Usage Statistics**: Track your monthly scan usage
- **Quick Actions**: Fast access to common tasks
- **Notifications**: Important security alerts and updates

### Step 4: Set Up Browser Extension (Optional)

For real-time protection while browsing:

1. **Visit Extension Page**: Go to Dashboard → Integrations → Browser Extension
2. **Choose Your Browser**: Chrome, Firefox, Safari, or Edge
3. **Install Extension**: Follow the browser-specific installation steps
4. **Configure Settings**: Set your protection preferences
5. **Test Protection**: Visit a test URL to confirm it's working

**Extension benefits:**
- **Real-time scanning**: Automatic URL checking as you browse
- **Warning notifications**: Immediate alerts for dangerous sites
- **One-click reporting**: Report suspicious sites to the community
- **Seamless integration**: Works with your existing browsing habits

### Step 5: Make Your First API Call (Developers)

If you're a developer looking to integrate LinkShield:

1. **Generate API Key**: Dashboard → Settings → API Keys → "Create New Key"
2. **Copy your key**: Save it securely (it won't be shown again)
3. **Test the API**: Use the example below
4. **Read the docs**: Visit [API Documentation](../api/API_REFERENCE.md) for complete reference

**Quick API test:**
```bash
curl -X POST https://api.linkshield.site/api/v1/url/check \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 📋 Quick Reference Checklist

### For New Users
- [ ] Check first URL without account
- [ ] Create and verify account
- [ ] Explore dashboard features
- [ ] Set up browser extension
- [ ] Join community forum

### For Developers
- [ ] Create account and verify email
- [ ] Generate API key
- [ ] Test API endpoint
- [ ] Read API documentation
- [ ] Set up webhook notifications (optional)

### For Teams/Organizations
- [ ] Create organization account
- [ ] Invite team members
- [ ] Set up shared projects
- [ ] Configure team permissions
- [ ] Integrate with existing security tools

## 🎯 Common First Tasks

### Check a Suspicious Email Link
1. **Don't click the link** in the email
2. **Copy the URL** (right-click → "Copy link address")
3. **Paste into LinkShield** URL checker
4. **Review the analysis** before deciding whether to visit

### Monitor Your Website
1. **Create a new project** in the dashboard
2. **Add your website URLs** to the project
3. **Set up monitoring** for regular security checks
4. **Configure alerts** for any security issues found

### Bulk Check Multiple URLs
1. **Go to Dashboard** → URL Checker → Bulk Analysis
2. **Upload a CSV file** or paste multiple URLs
3. **Start the analysis** and wait for results
4. **Export the report** for your records

### Set Up Team Collaboration
1. **Upgrade to a team plan** if needed
2. **Invite team members** via email
3. **Create shared projects** for team URLs
4. **Set permissions** for different team roles

## 🔧 Troubleshooting Common Issues

### "URL Not Accessible" Error
- **Check the URL format**: Ensure it includes `http://` or `https://`
- **Verify the URL exists**: Try visiting it in a private browser window
- **Check for typos**: Common cause of accessibility errors

### Slow Scan Results
- **Choose Quick Scan**: For faster results with basic analysis
- **Check system status**: Visit [status.linkshield.com](https://status.linkshield.com)
- **Try again later**: High traffic periods may cause delays

### Can't Create Account
- **Check email format**: Ensure valid email address
- **Password requirements**: Must be at least 8 characters with mixed case
- **Email verification**: Check spam folder for verification email

### Browser Extension Not Working
- **Refresh the page**: After installing the extension
- **Check permissions**: Ensure extension has necessary permissions
- **Update browser**: Use the latest version of your browser
- **Reinstall extension**: Remove and reinstall if issues persist

## 📚 Next Steps

Now that you're up and running, explore these areas:

### Learn More About Features
- **[URL Checking](../features/URL_CHECKING.md)**: Deep dive into security analysis
- **[Social Protection](../features/SOCIAL_PROTECTION.md)**: Monitor social media algorithm health
- **[AI Analysis](../features/AI_ANALYSIS.md)**: Advanced threat detection capabilities
- **[Community Reports](../features/COMMUNITY_REPORTS.md)**: Leverage crowd-sourced intelligence

### Advanced Usage
- **[Projects Guide](../features/PROJECTS.md)**: Organize and manage your URLs
- **[API Integration](../api/API_REFERENCE.md)**: Automate security checks
- **[Webhooks Setup](../integrations/WEBHOOKS.md)**: Real-time notifications
- **[Team Management](../features/TEAM_MANAGEMENT.md)**: Collaborate with colleagues

### Get Support
- **[FAQ](../support/FAQ.md)**: Answers to common questions
- **[Community Forum](../support/COMMUNITY.md)**: Connect with other users
- **[Contact Support](../support/CONTACT.md)**: Get help from our team
- **[Video Tutorials](../support/TUTORIALS.md)**: Visual learning resources

## 🎥 Video Tutorials

*Coming soon: Step-by-step video guides for all major features*

- Getting Started with LinkShield (5 minutes)
- Setting Up Your First Project (3 minutes)
- Understanding Security Analysis Results (7 minutes)
- Browser Extension Setup and Usage (4 minutes)
- API Integration for Developers (10 minutes)

## 💡 Pro Tips

### Maximize Your Security
- **Check before you click**: Always scan suspicious links
- **Use the browser extension**: For automatic protection
- **Monitor regularly**: Set up recurring scans for important URLs
- **Stay informed**: Follow our blog for security insights

### Optimize Your Workflow
- **Create projects**: Organize URLs by purpose or client
- **Use bulk analysis**: For checking multiple URLs at once
- **Set up webhooks**: For automated notifications
- **Export reports**: For documentation and compliance

### Get the Most Value
- **Explore all features**: Don't just stick to basic URL checking
- **Join the community**: Learn from other users' experiences
- **Provide feedback**: Help us improve the platform
- **Upgrade when needed**: Access advanced features as you grow

---

**Need help?** Our support team is here to assist you:
- **Email**: [support@linkshield.com](mailto:support@linkshield.com)
- **Live Chat**: Available for premium users
- **Community**: [community.linkshield.com](https://community.linkshield.com)
- **Documentation**: [docs.linkshield.com](https://docs.linkshield.com)
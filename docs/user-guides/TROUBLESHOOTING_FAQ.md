# LinkShield Troubleshooting & FAQ

This guide helps you resolve common issues and answers frequently asked questions about using LinkShield.

## Table of Contents

1. [Getting Started Issues](#getting-started-issues)
2. [Account & Authentication](#account--authentication)
3. [URL Scanning Problems](#url-scanning-problems)
4. [Browser Extension Issues](#browser-extension-issues)
5. [Social Media Monitoring](#social-media-monitoring)
6. [AI Analysis Questions](#ai-analysis-questions)
7. [Subscription & Billing](#subscription--billing)
8. [Performance Issues](#performance-issues)
9. [API Integration Problems](#api-integration-problems)
10. [Mobile App Issues](#mobile-app-issues)
11. [Data & Privacy](#data--privacy)
12. [General FAQ](#general-faq)

---

## Getting Started Issues

### Q: I just signed up but can't access my dashboard
**A:** This usually happens due to email verification issues:

1. **Check your email** (including spam/junk folders) for a verification email from LinkShield
2. **Click the verification link** in the email
3. **Wait 5-10 minutes** after verification before trying to log in
4. **Clear your browser cache** and cookies for linkshield.com
5. **Try a different browser** or incognito/private mode

If the problem persists:
- Resend verification email from the login page
- Contact support at support@linkshield.com with your email address

### Q: The interface looks broken or doesn't load properly
**A:** This is typically a browser compatibility issue:

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Quick fixes:**
1. **Update your browser** to the latest version
2. **Disable browser extensions** temporarily (especially ad blockers)
3. **Clear browser cache and cookies**
4. **Check JavaScript is enabled**
5. **Try incognito/private browsing mode**

### Q: I'm getting "Access Denied" errors
**A:** Check these common causes:

1. **Account not verified** - Complete email verification
2. **Subscription expired** - Check your subscription status
3. **IP restrictions** - If using enterprise features, check IP whitelist
4. **Browser blocking** - Disable strict privacy settings temporarily

---

## Account & Authentication

### Q: I forgot my password
**A:** Use the password reset feature:

1. Go to the [login page](https://linkshield.com/login)
2. Click "Forgot Password?"
3. Enter your email address
4. Check your email for reset instructions
5. Follow the link and create a new password

**Password Requirements:**
- At least 8 characters
- Include uppercase and lowercase letters
- Include at least one number
- Include at least one special character

### Q: Two-factor authentication isn't working
**A:** Common 2FA issues and solutions:

**Time sync issues:**
- Ensure your device's time is correct
- Try generating a new code after syncing time

**App problems:**
- Use Google Authenticator, Authy, or similar TOTP apps
- If codes don't work, disable and re-enable 2FA

**Backup codes:**
- Use your backup codes if the authenticator app fails
- Generate new backup codes after using them

**Lost access:**
- Contact support with account verification details
- Provide recent activity information for identity verification

### Q: Can I change my email address?
**A:** Yes, but it requires verification:

1. Go to **Profile Settings** → **Account Information**
2. Click **Change Email**
3. Enter your new email address
4. Verify the new email address
5. Confirm the change with your current password

**Note:** Your login credentials will change to the new email address.

### Q: How do I delete my account?
**A:** Account deletion is permanent:

1. Go to **Profile Settings** → **Account Management**
2. Scroll to **Danger Zone**
3. Click **Delete Account**
4. Enter your password to confirm
5. Type "DELETE" to confirm permanent deletion

**Before deleting:**
- Export any important data or reports
- Cancel active subscriptions
- Note that this action cannot be undone

---

## URL Scanning Problems

### Q: URL scans are taking too long
**A:** Scan times vary based on several factors:

**Normal scan times:**
- Basic security scan: 5-15 seconds
- Deep analysis: 30-60 seconds
- First-time scans: Longer due to comprehensive analysis

**If scans are unusually slow:**
1. **Check your internet connection**
2. **Try scanning a different URL** to test the service
3. **Check our status page** at status.linkshield.com
4. **Wait and retry** - temporary server load can cause delays

### Q: I'm getting "Scan Failed" errors
**A:** Common causes and solutions:

**Invalid URLs:**
- Ensure the URL includes http:// or https://
- Check for typos in the URL
- Verify the website is accessible

**Network issues:**
- Check your internet connection
- Try scanning from a different network
- Disable VPN temporarily

**Rate limiting:**
- Free accounts have scan limits
- Wait a few minutes between scans
- Consider upgrading for higher limits

### Q: The scan results seem incorrect
**A:** Our AI analyzes multiple factors:

**If a safe site shows as risky:**
- Check if the site was recently compromised
- Look at specific risk factors in the detailed report
- The site might have suspicious redirects or ads

**If a suspicious site shows as safe:**
- Threats can be intermittent or targeted
- Check the scan timestamp - threats may be new
- Report false negatives to improve our detection

**Getting better results:**
- Use "Deep Scan" for comprehensive analysis
- Check multiple URLs from the same domain
- Review historical scan data

### Q: Can I scan password-protected or private URLs?
**A:** Limitations for private content:

**What we can scan:**
- Publicly accessible URLs
- Login pages (but not content behind authentication)
- URLs that don't require special permissions

**What we cannot scan:**
- Content behind login walls
- Private documents or files
- Intranet or localhost URLs
- URLs requiring special authentication

**Workarounds:**
- Scan the public portions of the site
- Use our browser extension for real-time protection
- Check the domain reputation separately

---

## Browser Extension Issues

### Q: The browser extension won't install
**A:** Installation troubleshooting:

**Chrome/Edge:**
1. Ensure you're using Chrome Web Store or Edge Add-ons
2. Check if your browser allows extensions from unknown sources
3. Disable other security extensions temporarily
4. Try installing in incognito mode first

**Firefox:**
1. Use Firefox Add-ons store
2. Check Firefox security settings
3. Ensure add-ons are enabled in preferences

**Safari:**
1. Enable developer mode if required
2. Check Safari extension preferences
3. Allow extensions from identified developers

### Q: The extension shows "Not Connected"
**A:** Connection issues:

1. **Check your internet connection**
2. **Log out and log back in** to the extension
3. **Refresh the extension** by disabling and re-enabling it
4. **Clear extension data** in browser settings
5. **Reinstall the extension** if problems persist

### Q: Real-time protection isn't working
**A:** Ensure proper configuration:

**Check settings:**
- Real-time protection is enabled in extension settings
- Notifications are allowed for the extension
- The extension has necessary permissions

**Common issues:**
- Some sites block extension functionality
- Incognito/private mode may disable extensions
- Other security software might interfere

**Testing:**
- Visit a known test URL to verify protection
- Check the extension icon for status indicators
- Review protection logs in extension settings

### Q: The extension is slowing down my browser
**A:** Performance optimization:

**Reduce resource usage:**
1. Disable real-time scanning on trusted sites
2. Adjust scan frequency in settings
3. Clear extension cache regularly
4. Update to the latest extension version

**If problems persist:**
- Disable other extensions to identify conflicts
- Check browser memory usage
- Consider using web-based scanning instead

---

## Social Media Monitoring

### Q: I can't connect my social media accounts
**A:** Account connection troubleshooting:

**Common issues:**
- **Two-factor authentication** - Temporarily disable 2FA during setup
- **App passwords** - Use app-specific passwords where required
- **Privacy settings** - Ensure your account allows third-party access
- **API limits** - Some platforms have connection limits

**Platform-specific help:**

**Twitter/X:**
- Ensure your account is not restricted
- Check if you have API access enabled
- Verify your account is in good standing

**Instagram:**
- Must be a business or creator account for full access
- Personal accounts have limited monitoring capabilities
- Ensure account is public or properly authorized

**LinkedIn:**
- Professional accounts work best
- Check privacy settings for third-party access
- Ensure your profile is complete

### Q: My social media metrics seem wrong
**A:** Understanding metric accuracy:

**Data collection timing:**
- Metrics update every 4-6 hours
- Historical data may take 24-48 hours to populate
- Real-time data has slight delays

**Platform limitations:**
- Some platforms limit data access
- Private accounts provide limited metrics
- Deleted content may still appear in historical data

**Improving accuracy:**
- Ensure account connections are active
- Refresh connections monthly
- Check platform-specific settings

### Q: I'm not receiving shadow ban alerts
**A:** Shadow ban detection setup:

**Requirements:**
- Account must be connected for at least 48 hours
- Need sufficient posting history for baseline
- Account must have regular engagement patterns

**Check settings:**
- Shadow ban monitoring is enabled
- Alert thresholds are set appropriately
- Notification preferences are configured

**Understanding results:**
- Shadow bans can be temporary or partial
- Detection requires statistical analysis over time
- False positives can occur during low activity periods

---

## AI Analysis Questions

### Q: What do the AI confidence scores mean?
**A:** Understanding confidence levels:

**Confidence Score Ranges:**
- **90-100%:** Very high confidence - strong indicators present
- **70-89%:** High confidence - multiple indicators align
- **50-69%:** Moderate confidence - some indicators present
- **30-49%:** Low confidence - weak or conflicting signals
- **0-29%:** Very low confidence - insufficient data

**Factors affecting confidence:**
- Amount of content analyzed
- Clarity of threat indicators
- Historical data availability
- Content complexity

### Q: Why did the AI miss an obvious threat?
**A:** AI limitations and improvements:

**Common reasons:**
- **New threat types** - AI learns from known patterns
- **Sophisticated attacks** - Advanced threats may evade detection
- **Context limitations** - AI may lack full context
- **Data quality** - Poor quality input affects analysis

**Helping improve detection:**
- Report false negatives through the feedback system
- Provide additional context when possible
- Use multiple analysis types for comprehensive coverage
- Keep the system updated with latest threat intelligence

### Q: Can I customize AI analysis settings?
**A:** Customization options:

**Available settings:**
- **Sensitivity levels** - Adjust detection thresholds
- **Analysis depth** - Choose between quick and deep analysis
- **Content types** - Select specific content categories to analyze
- **Language preferences** - Set primary languages for analysis

**Enterprise features:**
- Custom threat models
- Industry-specific analysis
- Integration with existing security tools
- Advanced reporting and analytics

---

## Subscription & Billing

### Q: What's included in each subscription tier?
**A:** Subscription comparison:

**Free Tier:**
- 10 URL scans per day
- Basic threat detection
- Community support
- Browser extension access

**Pro Tier ($9.99/month):**
- 500 URL scans per day
- Advanced AI analysis
- Social media monitoring (2 accounts)
- Email support
- Real-time alerts

**Business Tier ($29.99/month):**
- Unlimited URL scans
- Team collaboration features
- Social media monitoring (10 accounts)
- API access
- Priority support
- Custom reports

**Enterprise Tier (Custom pricing):**
- All Business features
- Custom integrations
- Dedicated support
- SLA guarantees
- Advanced analytics

### Q: How do I upgrade or downgrade my subscription?
**A:** Managing subscriptions:

**To upgrade:**
1. Go to **Profile Settings** → **Subscription**
2. Click **Upgrade Plan**
3. Select your desired tier
4. Complete payment process
5. New features activate immediately

**To downgrade:**
1. Go to **Profile Settings** → **Subscription**
2. Click **Change Plan**
3. Select lower tier
4. Confirm downgrade
5. Changes take effect at next billing cycle

**Important notes:**
- Downgrades preserve data but may limit access
- Upgrades are prorated for current billing period
- Enterprise changes require contacting sales

### Q: I was charged incorrectly
**A:** Billing issue resolution:

**Common billing issues:**
- **Duplicate charges** - Usually authorization holds that will drop
- **Wrong amount** - Check for prorated charges or tax additions
- **Unexpected renewal** - Verify auto-renewal settings
- **Currency conversion** - International charges may vary

**Steps to resolve:**
1. Check your subscription settings for active plans
2. Review billing history in your account
3. Contact support with transaction details
4. Provide screenshots of charges if needed

**Refund policy:**
- 30-day money-back guarantee for new subscriptions
- Prorated refunds for downgrades
- No refunds for partial month usage

---

## Performance Issues

### Q: The dashboard is loading slowly
**A:** Performance optimization:

**Quick fixes:**
1. **Clear browser cache** and cookies
2. **Close unnecessary browser tabs**
3. **Disable browser extensions** temporarily
4. **Check internet connection speed**
5. **Try a different browser**

**Advanced troubleshooting:**
- Check browser developer console for errors
- Disable hardware acceleration in browser settings
- Update browser to latest version
- Try accessing from different network

### Q: Scans are timing out
**A:** Timeout troubleshooting:

**Common causes:**
- **Network connectivity issues**
- **Server overload during peak times**
- **Complex websites requiring longer analysis**
- **Firewall or proxy interference**

**Solutions:**
1. **Retry the scan** after a few minutes
2. **Check our status page** for service issues
3. **Try scanning a simpler URL** to test connectivity
4. **Contact support** if timeouts persist

### Q: Mobile app is crashing
**A:** Mobile troubleshooting:

**iOS troubleshooting:**
1. **Force close and restart** the app
2. **Restart your device**
3. **Update the app** from App Store
4. **Check iOS version compatibility**
5. **Free up device storage**

**Android troubleshooting:**
1. **Clear app cache** in Settings → Apps
2. **Restart your device**
3. **Update from Google Play Store**
4. **Check Android version compatibility**
5. **Ensure sufficient RAM available**

---

## API Integration Problems

### Q: I'm getting 401 Unauthorized errors
**A:** Authentication troubleshooting:

**Check API key:**
- Verify key is copied correctly (no extra spaces)
- Ensure key hasn't expired
- Check key permissions in dashboard
- Regenerate key if necessary

**Header format:**
```
X-API-Key: your_api_key_here
```

**Common mistakes:**
- Using wrong header name (Authorization vs X-API-Key)
- Including "Bearer" prefix with API key
- Using expired or revoked keys

### Q: API responses are slow or timing out
**A:** Performance optimization:

**Rate limiting:**
- Check your subscription's API limits
- Implement proper retry logic with exponential backoff
- Cache results when appropriate
- Use batch requests for multiple URLs

**Network optimization:**
- Use CDN endpoints when available
- Implement connection pooling
- Set appropriate timeout values
- Monitor API response times

### Q: How do I handle API errors properly?
**A:** Error handling best practices:

**HTTP Status Codes:**
- **200:** Success
- **400:** Bad Request - Check request format
- **401:** Unauthorized - Check API key
- **403:** Forbidden - Insufficient permissions
- **429:** Rate Limited - Implement backoff
- **500:** Server Error - Retry with exponential backoff

**Example error handling:**
```javascript
try {
  const response = await fetch(apiUrl, {
    headers: { 'X-API-Key': apiKey }
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      // Rate limited - wait and retry
      await new Promise(resolve => setTimeout(resolve, 5000));
      return retryRequest();
    }
    throw new Error(`API Error: ${response.status}`);
  }
  
  return await response.json();
} catch (error) {
  console.error('API request failed:', error);
  // Handle error appropriately
}
```

---

## Mobile App Issues

### Q: Push notifications aren't working
**A:** Notification troubleshooting:

**iOS:**
1. **Check notification permissions** in Settings → LinkShield
2. **Ensure notifications are enabled** in app settings
3. **Check Do Not Disturb** settings
4. **Restart the app** and device
5. **Update to latest app version**

**Android:**
1. **Check app notification permissions**
2. **Disable battery optimization** for LinkShield
3. **Check notification channels** in app settings
4. **Ensure background app refresh** is enabled
5. **Clear app cache** if needed

### Q: Offline functionality isn't working
**A:** Offline feature limitations:

**What works offline:**
- Previously scanned URL results
- Cached threat intelligence
- Basic app navigation
- Saved reports and history

**What requires internet:**
- New URL scans
- Real-time threat updates
- Account synchronization
- Social media monitoring

**Improving offline experience:**
- Sync data when connected
- Enable offline mode in settings
- Download reports for offline viewing

---

## Data & Privacy

### Q: What data does LinkShield collect?
**A:** Data collection transparency:

**Data we collect:**
- URLs you scan (for analysis purposes)
- Account information (email, preferences)
- Usage analytics (anonymized)
- Social media metrics (when connected)
- Browser extension activity (for protection)

**Data we don't collect:**
- Personal browsing history (unless explicitly scanned)
- Private messages or communications
- Financial information (except billing)
- Location data (unless required for threat analysis)

**Data usage:**
- Threat detection and analysis
- Service improvement
- Security research (anonymized)
- Compliance with legal requirements

### Q: How long do you keep my data?
**A:** Data retention policies:

**Scan results:** 12 months (or until account deletion)
**Account data:** Until account deletion
**Analytics data:** 24 months (anonymized)
**Billing data:** 7 years (legal requirement)
**Support tickets:** 3 years

**Data deletion:**
- Request data deletion through support
- Account deletion removes most personal data
- Some data retained for legal/security purposes
- Anonymized data may be retained for research

### Q: Is my data shared with third parties?
**A:** Third-party sharing policy:

**We share data with:**
- **Service providers** (hosting, analytics) under strict agreements
- **Security partners** for threat intelligence (anonymized)
- **Legal authorities** when required by law

**We never share:**
- Personal information for marketing
- Individual scan results with other users
- Account details with unauthorized parties
- Data for commercial purposes without consent

**Your control:**
- Opt out of analytics in privacy settings
- Request data portability
- Delete account and associated data
- Review privacy settings regularly

---

## General FAQ

### Q: Is LinkShield free to use?
**A:** Freemium model:

**Free tier includes:**
- 10 URL scans per day
- Basic threat detection
- Browser extension
- Community support

**Paid tiers offer:**
- Higher scan limits
- Advanced features
- Priority support
- Team collaboration
- API access

### Q: How accurate is LinkShield's threat detection?
**A:** Accuracy metrics:

**Overall accuracy:** 95%+ for known threats
**False positive rate:** <2%
**Detection coverage:** 99%+ of common threats

**Factors affecting accuracy:**
- New/unknown threats may have lower detection rates
- Sophisticated attacks designed to evade detection
- Context-dependent threats may require human analysis

**Continuous improvement:**
- Machine learning models updated daily
- Threat intelligence feeds from multiple sources
- User feedback incorporated into detection algorithms

### Q: Can LinkShield protect against all online threats?
**A:** Protection scope and limitations:

**What we protect against:**
- Phishing websites and emails
- Malware distribution sites
- Social engineering attacks
- Suspicious social media content
- Fraudulent online stores
- Compromised legitimate websites

**What we cannot prevent:**
- Social engineering via phone calls
- Physical security threats
- Insider threats
- Zero-day exploits (until detected)
- User error or poor security practices

**Best practices:**
- Use LinkShield as part of comprehensive security
- Maintain updated antivirus software
- Practice good password hygiene
- Stay informed about current threats
- Trust your instincts about suspicious content

### Q: How do I report a bug or request a feature?
**A:** Feedback and support:

**Bug reports:**
1. Go to **Help** → **Report Bug** in the app
2. Provide detailed description and steps to reproduce
3. Include screenshots if helpful
4. Note your browser/device information

**Feature requests:**
1. Visit our **Community Forum** at community.linkshield.com
2. Search for existing requests
3. Vote on existing requests or create new ones
4. Provide use case and justification

**Contact methods:**
- **Email:** support@linkshield.com
- **Community Forum:** community.linkshield.com
- **Live Chat:** Available for Pro+ subscribers
- **Phone Support:** Enterprise customers only

### Q: How do I stay updated on new features?
**A:** Staying informed:

**Official channels:**
- **Product blog:** blog.linkshield.com
- **Email newsletter:** Subscribe in account settings
- **Social media:** Follow @LinkShieldSec
- **Release notes:** Available in app and website

**Community:**
- **Community forum:** Discussions and announcements
- **User groups:** Regional and industry-specific groups
- **Webinars:** Monthly feature demonstrations
- **Beta program:** Early access to new features

---

## Getting Help

### Q: How do I contact support?
**A:** Support options by subscription tier:

**Free users:**
- Community forum
- Knowledge base
- Email support (48-72 hour response)

**Pro users:**
- All free options
- Priority email support (24-48 hour response)
- Live chat during business hours

**Business users:**
- All Pro options
- Phone support during business hours
- Dedicated account manager

**Enterprise users:**
- All Business options
- 24/7 phone support
- SLA guarantees
- On-site support (when needed)

### Q: What information should I include in support requests?
**A:** Effective support requests:

**Always include:**
- Your account email address
- Subscription tier
- Browser/device information
- Steps to reproduce the issue
- Screenshots or error messages

**For technical issues:**
- Console error messages
- Network connectivity details
- Recent changes to your setup
- Specific URLs or content involved

**For billing issues:**
- Transaction IDs
- Billing email address
- Screenshots of charges
- Expected vs actual amounts

### Q: How long does support take to respond?
**A:** Response time expectations:

**Email support:**
- Free: 48-72 hours
- Pro: 24-48 hours
- Business: 12-24 hours
- Enterprise: 4-8 hours

**Live chat:**
- Pro+: Available during business hours (9 AM - 6 PM EST)
- Response within 5-10 minutes during available hours

**Phone support:**
- Business+: Available during business hours
- Enterprise: 24/7 availability

**Emergency support:**
- Enterprise customers: 1-hour response for critical issues
- Escalation procedures for urgent security matters

---

## Additional Resources

### Documentation
- [User Guides](../user-guides/) - Comprehensive how-to guides
- [API Documentation](../developer/API_DOCUMENTATION.md) - Developer resources
- [Integration Guide](../developer/INTEGRATION_GUIDE.md) - Implementation examples

### Community
- [Community Forum](https://community.linkshield.com) - User discussions
- [Knowledge Base](https://help.linkshield.com) - Searchable help articles
- [Video Tutorials](https://youtube.com/linkshieldsec) - Step-by-step guides

### Status & Updates
- [Service Status](https://status.linkshield.com) - Real-time service health
- [Product Blog](https://blog.linkshield.com) - Feature announcements
- [Security Advisories](https://security.linkshield.com) - Security updates

### Contact Information
- **General Support:** support@linkshield.com
- **Sales Inquiries:** sales@linkshield.com
- **Security Issues:** security@linkshield.com
- **Partnership Opportunities:** partners@linkshield.com

---

*Last updated: January 2024*
*For the most current information and updates, visit [help.linkshield.com](https://help.linkshield.com)*
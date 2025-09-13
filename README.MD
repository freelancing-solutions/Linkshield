# 🛡️ LinkShield

**One-Click Link Safety Reports. Protect your visitors and your reputation.**

LinkShield is a comprehensive URL safety analysis platform that provides instant security assessments, AI-powered content analysis, and shareable safety reports for any web link. Built with Next.js 15 and modern web technologies.

## ✨ Key Features

### 🔍 **Instant URL Analysis**
- **Security Scoring** - Comprehensive security assessment with SSL validation
- **Performance Metrics** - Response time and status code analysis
- **Redirect Chain Detection** - Track and analyze URL redirections
- **Metadata Extraction** - Automatic title, description, and Open Graph data
- **Content Hash Analysis** - Detect content changes and duplicates

### 🤖 **AI-Powered Content Analysis**
- **Content Quality Scoring** - Readability, depth, and engagement metrics
- **Topic Categorization** - Automatic content classification
- **Content Summarization** - AI-generated content summaries
- **Similarity Detection** - Find related pages and content duplicates
- **Reading Time Estimation** - Automatic content length analysis

### 📊 **Shareable Safety Reports**
- **Public Report Links** - Generate shareable URLs for analysis results
- **Custom Branding** - Add custom titles and descriptions
- **Social Media Integration** - Share reports across platforms
- **Analytics Tracking** - Monitor report views and engagement
- **Open Graph Integration** - Rich social media previews

### 👥 **Multi-Tier Access**
- **Free Tier** - 5 checks/month, 2 AI analyses
- **Pro Tier** - 500 checks/month, 50 AI analyses
- **Premium Tier** - 2,500 checks/month, 500 AI analyses

### 🏢 **Enterprise Features**
- **Admin Dashboard** - User management and system analytics
- **Project Management** - Organize URLs by projects
- **Bulk Analysis** - Process multiple URLs simultaneously
- **API Access** - RESTful API for integrations
- **Advanced Analytics** - Detailed usage and performance metrics

## 🚀 Technology Stack

### **Frontend & Framework**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives

### **Backend & Database**
- **PostgreSQL** - Primary database with Prisma ORM
- **NextAuth.js** - Authentication and session management
- **Custom Server** - Express.js with Socket.io integration
- **Rate Limiting** - API protection and usage enforcement

### **AI & Analysis**
- **Custom AI Integration** - Content analysis and quality scoring
- **Crypto Hashing** - Content deduplication and change detection
- **URL Analysis Engine** - Security and performance assessment
- **Content Processing** - Metadata extraction and analysis

### **Payments & Subscriptions**
- **Stripe** - Primary payment processor
- **PayPal** - Alternative payment method
- **Subscription Management** - Automated billing and plan enforcement
- **Webhook Processing** - Real-time payment status updates

### **Development & Testing**
- **Vitest** - Unit and integration testing
- **ESLint** - Code quality and consistency
- **Prisma** - Database schema management
- **TypeScript** - Static type checking

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── check/         # URL analysis endpoint
│   │   ├── reports/       # Report management
│   │   ├── auth/          # Authentication (NextAuth)
│   │   ├── dashboard/     # User dashboard APIs
│   │   ├── admin/         # Admin panel APIs
│   │   ├── paypal/        # PayPal payment processing
│   │   ├── stripe/        # Stripe payment processing
│   │   ├── projects/      # Project management
│   │   ├── analytics/     # Usage analytics
│   │   ├── health/        # System health checks
│   │   ├── og/           # Open Graph image generation
│   │   └── v1/           # API versioning
│   ├── dashboard/         # User dashboard pages
│   ├── admin/            # Admin panel interface
│   ├── report/           # Public report pages
│   ├── reports/          # Report listing pages
│   ├── pricing/          # Subscription plans
│   ├── auth/             # Authentication pages
│   ├── docs/             # Documentation pages
│   └── linkshield/       # Brand/marketing pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── brand/            # Brand-specific components
│   ├── demos/            # Demo components
│   ├── projects/         # Project-specific components
│   ├── ReportDetails.tsx # Report display component
│   ├── ShareButton.tsx   # Social sharing component
│   └── navbar.tsx        # Navigation component
├── lib/                  # Utilities and services
│   ├── services/         # Business logic services
│   ├── repositories/     # Data access layer
│   ├── middleware/       # Custom middleware
│   ├── types/           # TypeScript definitions
│   ├── __tests__/       # Library tests
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   ├── paypal.ts        # PayPal integration
│   ├── socket.ts        # WebSocket configuration
│   ├── url-analysis.ts  # URL analysis engine
│   └── utils.ts         # General utilities
├── hooks/               # Custom React hooks
│   ├── use-mobile.ts    # Mobile detection
│   └── use-toast.ts     # Toast notifications
└── types/               # Global TypeScript definitions
    └── next-auth.d.ts   # NextAuth type extensions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd linkshield

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### Environment Setup

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkshield"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Payment Processing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
PAYPAL_WEBHOOK_ID="your_webhook_id"

# AI Services (optional)
OPENAI_API_KEY="sk-..."

# Application Settings
NODE_ENV="development"
PORT="3000"
```

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[API Reference](./docs/api_reference.md)** - Complete REST API documentation
- **[AI Features](./docs/ai_features.md)** - Content analysis capabilities
- **[Payment Integration](./docs/payments_integration.md)** - Stripe and PayPal setup
- **[Environment Variables](./docs/env_variables.md)** - Configuration reference
- **[Subscriptions & Plans](./docs/subscriptions_plans.md)** - Billing and plan management
- **[Compliance & Security](./docs/compliance_security.md)** - Security implementations
- **[Architecture Overview](./docs/architecture.md)** - System design and components
- **[User Workflows](./docs/user_workflows.md)** - User journey and features
- **[Authentication](./docs/auth_flow.md)** - Auth implementation details

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Vitest tests
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database
```

### Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

### API Endpoints

**Core Analysis:**
- `POST /api/check` - Analyze URL safety and content
- `GET /api/reports/[slug]` - Retrieve report data
- `GET /api/health` - System health check

**Dashboard:**
- `GET /api/dashboard/stats` - User statistics
- `GET /api/dashboard/history` - Analysis history
- `GET /api/dashboard/recent-reports` - Recent reports

**Admin:**
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/reports` - Report management

**Payments:**
- `POST /api/stripe/checkout` - Create Stripe session
- `POST /api/stripe/webhook` - Handle Stripe events
- `POST /api/paypal/checkout` - Create PayPal order
- `POST /api/paypal/webhook` - Handle PayPal events

## 🛡️ Security Features

- **Rate Limiting** - API endpoint protection with configurable limits
- **Input Validation** - Comprehensive request validation with Zod
- **SQL Injection Protection** - Prisma ORM with parameterized queries
- **XSS Prevention** - Content sanitization and React's built-in protection
- **CSRF Protection** - Built-in Next.js security features
- **SSL/TLS Analysis** - Certificate validation and security scoring
- **Webhook Verification** - Cryptographic signature validation
- **Authentication** - Secure session management with NextAuth.js

## 📊 Analytics & Monitoring

- **Report View Tracking** - Monitor public report engagement
- **Share Analytics** - Track sharing methods and success rates
- **Usage Metrics** - Plan limits and consumption tracking
- **Performance Monitoring** - Response time and error tracking
- **Sidebar Impressions** - UI interaction analytics
- **Admin Dashboard** - System-wide analytics and insights

## 🔌 API Integration

### REST API
LinkShield provides a comprehensive REST API for integrating URL analysis into your applications:

```bash
# Analyze a URL
curl -X POST https://your-domain.com/api/check \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Get report data
curl https://your-domain.com/api/reports/report-slug
```

### Webhooks
Receive real-time notifications for payment events and system updates.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation for API changes
- Follow the existing code style
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@linkshield.com
- 📖 Documentation: [docs/](./docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/linkshield/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/linkshield/discussions)

## 🚀 Deployment

LinkShield can be deployed on various platforms:

- **Vercel** - Recommended for Next.js applications
- **Railway** - Full-stack deployment with PostgreSQL
- **Docker** - Containerized deployment
- **Self-hosted** - Custom server deployment

See the deployment documentation for detailed instructions.

---

**LinkShield** - Protecting the web, one link at a time. 🛡️

*Built with ❤️ using Next.js, TypeScript, and modern web technologies.*

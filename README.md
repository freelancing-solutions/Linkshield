# LinkShield Client

Modern React-based web application for URL security analysis, AI-powered content analysis, and social protection features.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.0+
- **UI Library**: React 18.3+
- **Component Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 3.4+
- **State Management**: 
  - Zustand (UI state)
  - TanStack Query (server state)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher (20.x LTS recommended)
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd linkshield-client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

4. Install shadcn/ui components as needed:
```bash
# Example: Install button component
npx shadcn-ui@latest add button

# Install multiple components
npx shadcn-ui@latest add button input form dialog
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
linkshield-client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group
│   │   ├── dashboard/         # Dashboard routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   └── providers/         # Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API client modules
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   ├── config/                # Configuration files
│   └── lib/                   # Third-party library configs
├── public/                    # Static assets
├── .kiro/                     # Kiro specs and steering docs
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run end-to-end tests

## API Integration

The client communicates with the LinkShield backend API at:
```
https://api.linkshield.site/api/v1
```

All API calls are made through the configured Axios instance in `src/services/api.ts`.

## Documentation

Comprehensive documentation is available in the `.kiro/steering/` directory:

- [Architecture](/.kiro/steering/architecture.md)
- [Tech Stack](/.kiro/steering/tech-stack.md)
- [API Integration](/.kiro/steering/api-integration.md)
- [State Management](/.kiro/steering/state-management.md)
- [Component Patterns](/.kiro/steering/component-patterns.md)
- [Development Workflow](/.kiro/steering/development-workflow.md)

## Contributing

1. Follow the coding standards in `.kiro/steering/coding-standards.md`
2. Write tests for new features
3. Ensure accessibility compliance (WCAG 2.1 Level AA)
4. Run linting and type checking before committing
5. Follow the Git workflow and commit conventions

## License

[Add your license here]

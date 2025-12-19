# Clueso.io Clone

A comprehensive full-stack clone of Clueso.io - an AI-powered platform that transforms screen recordings into professional product videos and documentation.

## Features

- **User Onboarding & Authentication** - Seamless sign-up flows and session management
- **Dashboard Experience** - Intuitive interface with navigation and layout patterns
- **Feedback Collection Flows** - Capture, organize, and display user feedback
- **AI-Powered Insights** - Generate summaries and insights from content
- **Data Management** - Robust storage and retrieval systems
- **System Communication** - Seamless integration between extension, backend, and frontend

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Extension**: Chrome Extension (Manifest V3)
- **Authentication**: JWT tokens, bcrypt
- **AI**: OpenAI API (with mock fallback)

## Project Structure

```
clueso-clone/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── extension/         # Chrome extension for screen recording
├── shared/            # Shared types and utilities
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm run install:all
   ```

3. Set up environment variables:

   - Copy `backend/.env.example` to `backend/.env` and configure
   - Copy `frontend/.env.example` to `frontend/.env.local` and configure

4. Set up the database:

   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Run the development servers:
   ```bash
   npm run dev
   ```

### Environment Variables

#### Backend (.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/clueso"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
OPENAI_API_KEY="your-openai-api-key" (optional, uses mock if not provided)
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## API Documentation

See `backend/README.md` for detailed API documentation.

## Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` directory

## License

MIT

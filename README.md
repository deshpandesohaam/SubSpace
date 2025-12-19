# Clueso Backend API

RESTful API backend for the Clueso.io clone built with Express.js, TypeScript, and Prisma.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up the database:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. (Optional) Seed the database:

   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify authentication token

### Users

- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Recordings

- `GET /api/recordings` - Get all recordings (optional query: projectId)
- `GET /api/recordings/:id` - Get recording by ID
- `POST /api/recordings` - Create new recording
- `PUT /api/recordings/:id` - Update recording
- `DELETE /api/recordings/:id` - Delete recording

### Feedback

- `GET /api/feedback` - Get all feedback (optional queries: projectId, recordingId, type)
- `GET /api/feedback/:id` - Get feedback by ID
- `POST /api/feedback` - Create new feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Insights

- `GET /api/insights` - Get all insights (optional queries: projectId, recordingId, type)
- `GET /api/insights/:id` - Get insight by ID
- `POST /api/insights/generate` - Generate AI insight
- `DELETE /api/insights/:id` - Delete insight

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## AI Service

The AI service supports both OpenAI API and mock implementations:

- If `OPENAI_API_KEY` is set, uses OpenAI GPT-4
- Otherwise, uses mock responses with clear documentation

## Error Handling

All errors are handled centrally and return JSON responses in the format:

```json
{
  "error": "Error type",
  "message": "Error message"
}
```

## Database Schema

See `prisma/schema.prisma` for the complete database schema.


# Browser Extension Assignment

## Description
This is a browser extension developed as part of an assignment.

## Features
- Popup UI
- Background script
- Content script interaction

## How to Install
1. Clone or download this repository
2. Open Chrome and go to chrome://extensions
3. Enable Developer Mode
4. Click "Load unpacked"
5. Select the browser-extension folder

## Tech Used
- JavaScript
- HTML
- CSS
- Chrome Extensions API



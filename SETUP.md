# Detailed Setup Guide

## Project Structure

```
clueso-clone/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── middleware/ # Auth & error handling
│   │   ├── services/  # AI service & business logic
│   │   └── utils/     # Helpers & validation
│   └── prisma/        # Database schema & migrations
├── frontend/         # Next.js web application
│   ├── app/          # Next.js app router pages
│   ├── lib/          # API client & utilities
│   └── types/        # TypeScript types
├── extension/        # Chrome extension
│   ├── popup.html    # Extension popup UI
│   ├── popup.js      # Popup logic
│   ├── background.js # Background service worker
│   └── content.js    # Content script
└── README.md
```

## Backend Setup

### 1. Database Configuration

Create a PostgreSQL database:

```sql
CREATE DATABASE clueso;
```

Update `backend/.env` with your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/clueso"
```

### 2. Run Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

This will:

- Create all database tables
- Generate Prisma Client types

### 3. Seed Database (Optional)

```bash
npm run db:seed
```

Creates a demo user: `demo@clueso.io` / `demo123456`

### 4. Start Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Frontend Setup

### 1. Environment Variables

The frontend will automatically use `http://localhost:3001` as the API URL. To customize, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## Chrome Extension Setup

### 1. Create Extension Icons

You need to create icon files in `extension/icons/`:

- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any image editor or download free icons. The extension will work without icons but Chrome will show a default icon.

### 2. Load Extension in Chrome

1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `extension` directory

### 3. Authentication

The extension automatically detects when you're logged into the web app and uses your session token. If you're not logged in, click "Open Login Page" in the extension popup.

## Usage Flow

1. **Register/Login**: Create an account or login at `http://localhost:3000/login`
2. **Create Project**: Go to dashboard and create a new project
3. **Record Screen**:
   - Click the Clueso extension icon
   - Select a project
   - Click "Start Recording"
   - Choose what to record (screen/window/tab)
   - Click "Stop Recording" when done
4. **View Recording**: Recordings appear in your project dashboard
5. **Generate Insights**: Click on a recording and use the "Generate AI Insights" buttons
6. **Submit Feedback**: View recordings or projects and submit feedback

## API Testing

You can test the API directly using curl or Postman:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get projects (use token from login)
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL in `backend/.env`
- Verify database exists: `psql -l`

### Port Already in Use

- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/package.json` dev script

### Extension Not Loading

- Check browser console for errors
- Ensure all files are present in extension directory
- Verify manifest.json is valid JSON

### CORS Errors

- Ensure `CORS_ORIGIN` in `backend/.env` matches frontend URL
- Check both servers are running

## Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Use a secure `JWT_SECRET`
3. Set up proper file storage (S3, etc.) for recordings
4. Configure OpenAI API key for real AI insights
5. Set up HTTPS
6. Use environment-specific database URLs
7. Build frontend: `cd frontend && npm run build && npm start`
8. Build backend: `cd backend && npm run build && npm start`

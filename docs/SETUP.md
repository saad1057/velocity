# Velocity AI Recruitment Platform - Setup Guide

## Project Overview

This is a full-stack AI recruitment platform with:
- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express.js + TypeScript
- **Future AI Service**: Django microservice

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)

### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:8080` (or `http://localhost:5173` depending on Vite config)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A strong random string for JWT tokens
# - FRONTEND_URL: http://localhost:5173

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Environment Variables

#### Frontend (.env in root - optional)
```
VITE_API_URL=http://localhost:5000
```

#### Backend (backend/.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/velocity
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

## Project Structure

```
velocity/
├── frontend/              # Frontend React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── ...
│   ├── public/           # Static assets
│   └── ...
├── backend/              # Backend Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Utilities (AI service client)
│   └── ...
└── ai-service/           # Future Django AI microservice
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (recruiter/admin)

### Candidates
- `GET /api/candidates` - List candidates
- `GET /api/candidates/:id` - Get candidate details

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - List applications

See [backend/README.md](backend/README.md) for complete API documentation.

## Development Workflow

1. **Start MongoDB** (if running locally)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Access**: Frontend at `http://localhost:8080` (or check Vite config)

## Next Steps

1. **Set up MongoDB connection** - Configure Mongoose models
2. **Implement database models** - User, Job, Candidate, Application
3. **Complete controller logic** - Replace placeholder implementations
4. **Add file upload** - Resume uploads with Multer
5. **Connect frontend to backend** - Update API calls in React components
6. **Set up Django AI service** - For AI features (resume parsing, matching, etc.)

## Future Django AI Microservice

The Django service will handle:
- Resume parsing and data extraction
- AI-powered candidate-job matching
- NLP-based screening
- Skills extraction
- Interview question generation

Integration will be via HTTP API from the Express backend.

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `backend/src/index.ts`

### Database connection issues
- Verify MongoDB URI is correct
- Check if MongoDB service is running
- For MongoDB Atlas, ensure IP is whitelisted

## Support

For issues or questions, refer to:
- [Backend README](backend/README.md)
- [AI Service README](ai-service/README.md)


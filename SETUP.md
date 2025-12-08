# Velocity AI Recruitment Platform - Setup Guide

## Project Overview

This is a full-stack AI recruitment platform with:
- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express.js
- **AI Service**: Python Flask microservice

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)
- Python 3.9+ (for AI service)

### MongoDB Installation

1. **Install MongoDB**
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)

2. **Start MongoDB**
   - **Windows**: MongoDB should start as a service automatically
   - **macOS/Linux**: `brew services start mongodb-community` or `sudo systemctl start mongod`

## Quick Start

### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:5173` (or `http://localhost:8080` depending on Vite config)

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
# - AI_SERVICE_URL: http://localhost:8001

# Start backend server
npm start
```

Backend will run on `http://localhost:3000`

### 3. AI Service Setup

```bash
# Navigate to ai-service directory
cd ai-service

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
python app.py
```

AI Service will run on `http://localhost:8001`

## Environment Variables

### Frontend (.env in root - optional)
```
VITE_API_URL=http://localhost:3000
```

### Backend (backend/.env)
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/velocity
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8001
```

## MongoDB Connection Options

### Local MongoDB
Use the default connection string:
```
mongodb://localhost:27017/velocity
```

### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file:
```
mongodb+srv://username:password@cluster.mongodb.net/velocity
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
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── ...
└── ai-service/           # Python Flask AI microservice
    ├── app.py            # Flask application
    └── requirements.txt  # Python dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/users/me` - Get current user

### Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile
- `PUT /api/profile/:userId/password` - Change password

### Resume Parsing
- `POST /api/resume/parse` - Parse resume (PDF/DOCX)

### Jobs
- `GET /api/jobs` - List jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (recruiter/admin)

### Candidates
- `GET /api/candidates` - List candidates
- `GET /api/candidates/:id` - Get candidate details

## Development Workflow

1. **Start MongoDB** (if running locally)
2. **Start AI Service**: `cd ai-service && python app.py`
3. **Start Backend**: `cd backend && npm start`
4. **Start Frontend**: `cd frontend && npm start`
5. **Access**: Frontend at `http://localhost:5173`

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 3000 is available

### MongoDB not connecting
- Make sure MongoDB is running: `mongosh` or check MongoDB service status
- Verify the connection string in `.env`
- Check MongoDB logs for errors
- For MongoDB Atlas, ensure IP is whitelisted

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `backend/index.js`

### Port already in use
- Change `PORT` in backend `.env` file
- Update `FRONTEND_URL` to match your frontend URL

### AI Service not working
- Make sure Python virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check if port 8001 is available

## Support

For issues or questions, refer to:
- [Backend README](backend/README.md)
- [AI Service README](ai-service/README.md)

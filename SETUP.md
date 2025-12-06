# Database Setup Guide

This guide will help you set up MongoDB and connect it to your Velocity application.

## Prerequisites

1. **Install MongoDB**
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)

2. **Start MongoDB**
   - **Windows**: MongoDB should start as a service automatically
   - **macOS/Linux**: `brew services start mongodb-community` or `sudo systemctl start mongod`

## Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in the `server` directory:**
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/velocity_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   CORS_ORIGIN=http://localhost:8080
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3001`

## Frontend Setup

1. **Create `.env` file in the root directory (optional):**
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Start the frontend (if not already running):**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:8080`

## MongoDB Connection Options

### Local MongoDB
Use the default connection string:
```
mongodb://localhost:27017/velocity_db
```

### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file:
```
mongodb+srv://username:password@cluster.mongodb.net/velocity_db
```

## Testing the Connection

1. Start MongoDB
2. Start the backend server
3. You should see: `✅ MongoDB connected successfully`
4. Visit `http://localhost:3001/api/health` to verify the server is running

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile
- `PUT /api/profile/:userId/password` - Change password

## Troubleshooting

### MongoDB not connecting
- Make sure MongoDB is running: `mongosh` or check MongoDB service status
- Verify the connection string in `.env`
- Check MongoDB logs for errors

### Port already in use
- Change `PORT` in server `.env` file
- Update `CORS_ORIGIN` to match your frontend URL

### CORS errors
- Make sure `CORS_ORIGIN` in server `.env` matches your frontend URL
- Default frontend URL: `http://localhost:8080`


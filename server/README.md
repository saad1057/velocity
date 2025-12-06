# Velocity Server

Backend server for the Velocity recruitment management system.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file in the `server` directory:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/velocity_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CORS_ORIGIN=http://localhost:8080
```

3. Make sure MongoDB is running on your system

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile
- `PUT /api/profile/:userId/password` - Change password

## MongoDB Connection

The server connects to MongoDB using Mongoose. Make sure MongoDB is installed and running:

- **Local MongoDB**: `mongodb://localhost:27017/velocity_db`
- **MongoDB Atlas**: Use your Atlas connection string in `MONGODB_URI`


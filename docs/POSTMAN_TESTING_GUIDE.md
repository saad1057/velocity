# Postman Testing Guide for Velocity Backend

## Prerequisites

1. Make sure your server is running: `npm start`
2. Make sure MongoDB is running and connected

## Step 1: Create an Admin User

First, you need to create an admin user to test admin routes. Run this command:

```bash
npm run create-admin
```

This will create an admin user with:
- **Email**: `admin@velocity.com`
- **Password**: `admin123`
- **Role**: `admin`

## Step 2: Set Up Postman

### Base URL
Set your base URL as an environment variable in Postman:
- **Base URL**: `http://localhost:3000`

### Create a Postman Environment (Optional but Recommended)
1. Click on "Environments" in Postman
2. Create a new environment called "Velocity Local"
3. Add variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (leave empty, will be set after login)

## Step 3: Authentication Flow

### 1. Sign In as Admin

**Request:**
- **Method**: `POST`
- **URL**: `{{base_url}}/api/auth/signin` or `http://localhost:3000/api/auth/signin`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "admin@velocity.com",
  "password": "admin123"
}
```

**Response:**
You'll get a response with a `token`. Copy this token!

**Example Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "firstname": "Admin",
      "email": "admin@velocity.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Set Authorization Token

After signing in, you need to use the token for all protected routes:

**Option A: Set as Environment Variable**
1. Copy the token from the signin response
2. In Postman, go to your environment
3. Set `token` variable to the copied token value
4. Use `{{token}}` in Authorization header

**Option B: Manual Authorization Header**
For each request, add:
- **Header**: `Authorization`
- **Value**: `Bearer YOUR_TOKEN_HERE`

**Option C: Postman Authorization Tab**
1. Go to the "Authorization" tab in Postman
2. Select "Bearer Token" type
3. Paste your token in the Token field

## Step 4: Test User CRUD Operations (Admin Only)

### 1. Get Current User (Any Authenticated User)

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/users/me`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Response:**
```json
{
  "success": true,
  "message": "Current user retrieved successfully",
  "data": {
    "_id": "...",
    "firstname": "Admin",
    "email": "admin@velocity.com",
    "role": "admin"
  }
}
```

### 2. Create a New User (Admin Only)

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/users`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body** (raw JSON):
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "companyname": "Tech Corp",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "recruiter"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "...",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "recruiter"
  }
}
```

**Note**: Save the `_id` from the response - you'll need it for update/delete operations!

### 3. Get All Users (Admin Only)

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/users`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "...",
      "firstname": "Admin",
      "email": "admin@velocity.com",
      "role": "admin"
    },
    {
      "_id": "...",
      "firstname": "John",
      "email": "john.doe@example.com",
      "role": "recruiter"
    }
  ]
}
```

### 4. Get User by ID (Admin Only)

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3000/api/users/USER_ID_HERE`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Example URL**: `http://localhost:3000/api/users/65a1b2c3d4e5f6g7h8i9j0k1`

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "...",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "recruiter"
  }
}
```

### 5. Update User (Admin Only)

**Request:**
- **Method**: `PUT`
- **URL**: `http://localhost:3000/api/users/USER_ID_HERE`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body** (raw JSON) - You can update any field:
```json
{
  "firstname": "Jane",
  "lastname": "Smith",
  "companyname": "New Company",
  "email": "jane.smith@example.com",
  "role": "recruiter"
}
```

**Note**: To update password, include it in the body:
```json
{
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "...",
    "firstname": "Jane",
    "lastname": "Smith",
    "email": "jane.smith@example.com",
    "role": "recruiter"
  }
}
```

### 6. Delete User (Admin Only)

**Request:**
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/users/USER_ID_HERE`
- **Headers**: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Example URL**: `http://localhost:3000/api/users/65a1b2c3d4e5f6g7h8i9j0k1`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "...",
    "firstname": "Jane",
    "email": "jane.smith@example.com"
  }
}
```

## Step 5: Test Sign Up (Public Route)

You can also test the public signup route:

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:3000/api/auth/signup`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "firstname": "Test",
  "lastname": "User",
  "companyname": "Test Company",
  "email": "test@example.com",
  "password": "test123"
}
```

**Note**: Signup creates users with `role: "recruiter"` by default.

## Common Errors and Solutions

### 401 Unauthorized
- **Problem**: Token is missing or invalid
- **Solution**: Make sure you've signed in and copied the token correctly. Check that the Authorization header is: `Bearer YOUR_TOKEN`

### 403 Forbidden
- **Problem**: User is not an admin
- **Solution**: Make sure you're signed in as an admin user (role: "admin")

### 404 Not Found
- **Problem**: User ID doesn't exist
- **Solution**: Check that the user ID is correct. Get all users first to see available IDs.

### 409 Conflict
- **Problem**: Email already exists
- **Solution**: Use a different email address

## Quick Test Checklist

- [ ] Server is running (`npm start`)
- [ ] Admin user created (`npm run create-admin`)
- [ ] Signed in and got token
- [ ] Set Authorization header with Bearer token
- [ ] Tested GET /api/users/me
- [ ] Tested POST /api/users (create)
- [ ] Tested GET /api/users (get all)
- [ ] Tested GET /api/users/:id (get one)
- [ ] Tested PUT /api/users/:id (update)
- [ ] Tested DELETE /api/users/:id (delete)

## Tips

1. **Save Token**: After signing in, save the token as a Postman environment variable so you don't have to copy it every time.

2. **Collection**: Create a Postman collection with all these requests for easy testing.

3. **Pre-request Script**: You can add a pre-request script in Postman to automatically use the token from environment variables:
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

4. **Test Scripts**: Add test scripts to automatically save the token after signin:
   ```javascript
   if (pm.response.code === 200) {
       var jsonData = pm.response.json();
       if (jsonData.data && jsonData.data.token) {
           pm.environment.set("token", jsonData.data.token);
       }
   }
   ```


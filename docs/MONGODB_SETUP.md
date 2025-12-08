# MongoDB Setup Guide for Velocity (Windows)

This guide will help you set up MongoDB locally and deploy it on a server for the Velocity project.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [MongoDB Shell Installation](#mongodb-shell-installation)
3. [Server Deployment](#server-deployment)
4. [Configuration](#configuration)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Step 1: Install MongoDB Server

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or newer)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Select "Install MongoDB as a Service"
   - Service Name: `MongoDB`
   - Service Account: `Network Service user`
   - Check "Install MongoDB Compass" (optional GUI tool)
   - Click "Install"

3. **Verify Installation**
   - Open PowerShell as Administrator
   - Run: `Get-Service MongoDB`
   - Status should show "Running"
   - MongoDB is now running on `localhost:27017`

4. **Start/Stop MongoDB Service**
   - Open Services: Press `Win + R`, type `services.msc`
   - Find "MongoDB" service
   - Right-click → Start/Stop
   - Or use PowerShell:
     ```powershell
     # Start MongoDB
     net start MongoDB
     
     # Stop MongoDB
     net stop MongoDB
     ```

---

## MongoDB Shell Installation

**Important:** MongoDB Shell (`mongosh`) is installed separately from MongoDB Server. You need both for command-line access.

### Step 1: Download MongoDB Shell

1. Visit: https://www.mongodb.com/try/download/shell
2. Select:
   - Version: Latest
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB Shell

1. Run the downloaded `.msi` file
2. Follow the installation wizard
3. The installer will automatically add `mongosh` to your system PATH

### Step 3: Verify Shell Installation

1. **Close and reopen PowerShell** (required for PATH changes)
2. Test the installation:
   ```powershell
   mongosh --version
   ```
   You should see version information.

3. **Connect to MongoDB:**
   ```powershell
   # Connect to default database
   mongosh
   
   # Or connect directly to Velocity database
   mongosh "mongodb://localhost:27017/Velocity"
   ```

### Step 4: Basic Shell Commands

Once connected to MongoDB shell:

```javascript
// Show all databases
show dbs

// Switch to Velocity database
use Velocity

// Show collections (tables)
show collections

// View all users
db.users.find().pretty()

// Count users
db.users.countDocuments()

// Find specific user
db.users.findOne({ email: "user@example.com" })

// Exit shell
exit
```

---

## Server Deployment

### Option 1: MongoDB Atlas (Cloud - Recommended for Production)

MongoDB Atlas is the easiest way to deploy MongoDB in production.

#### Step 1: Create Account
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (M0 FREE tier available)

#### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "M0 FREE" tier (or paid tier for production)
3. Select your preferred cloud provider (AWS, Azure, GCP) and region
4. Click "Create"

#### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these securely!)
5. Set user privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

#### Step 4: Whitelist IP Addresses
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses of your servers
5. Click "Confirm"

#### Step 5: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Select driver: "Node.js" and version: "5.5 or later"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<database>` with `Velocity` (or add `?retryWrites=true&w=majority` at the end)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Velocity?retryWrites=true&w=majority
```

#### Step 6: Update Backend Configuration
Update `velocity/backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Velocity?retryWrites=true&w=majority
```

### Option 2: Self-Hosted Server (Windows Server)

If you want to host MongoDB on your own Windows server:

#### Step 1: Install MongoDB on Server
1. Follow the [Local Development Setup](#local-development-setup) steps on your server
2. Ensure MongoDB service is running

#### Step 2: Configure Firewall
1. Open Windows Firewall
2. Add inbound rule for port `27017` (TCP)
3. Allow connections from your application servers

#### Step 3: Configure MongoDB for Remote Access
1. Edit MongoDB config file: `C:\Program Files\MongoDB\Server\{version}\bin\mongod.cfg`
2. Update `net.bindIp` to allow remote connections:
   ```yaml
   net:
     port: 27017
     bindIp: 0.0.0.0  # Allow all IPs, or specify your server IPs
   ```
3. Restart MongoDB service:
   ```powershell
   net stop MongoDB
   net start MongoDB
   ```

#### Step 4: Enable Authentication (Recommended for Production)
1. Create admin user in MongoDB:
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "your-secure-password",
     roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
   })
   ```

2. Update `mongod.cfg`:
   ```yaml
   security:
     authorization: enabled
   ```

3. Restart MongoDB service

#### Step 5: Update Connection String
Update `velocity/backend/.env`:
```env
# For remote server without auth
MONGODB_URI=mongodb://your-server-ip:27017/Velocity

# For remote server with auth
MONGODB_URI=mongodb://admin:password@your-server-ip:27017/Velocity?authSource=admin
```

---

## Configuration

### Backend .env File

Create `velocity/backend/.env`:

```env
# MongoDB Configuration
# Local development
MONGODB_URI=mongodb://localhost:27017/Velocity

# Production (MongoDB Atlas)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Velocity?retryWrites=true&w=majority

# Production (Self-hosted)
# MONGODB_URI=mongodb://admin:password@your-server-ip:27017/Velocity?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080
```

### Default Connection
- If no `.env` file exists, the app defaults to: `mongodb://localhost:27017/Velocity`
- Database name: `Velocity`
- Port: `27017` (MongoDB default)

---

## Verification & Testing

### Check if MongoDB is Running

```powershell
# Check service status
Get-Service MongoDB

# Check if port is listening
netstat -an | findstr 27017

# Check MongoDB process
Get-Process | Where-Object {$_.ProcessName -like "*mongo*"}
```

### Test Connection with Shell

```powershell
# Connect to MongoDB
mongosh

# Or connect directly to Velocity database
mongosh "mongodb://localhost:27017/Velocity"
```

Once connected:
```javascript
// Show databases
show dbs

// Use Velocity database
use Velocity

// Show collections
show collections

// View users
db.users.find().pretty()
```

### Test Connection with MongoDB Compass

1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. Navigate to `Velocity` → `users` collection
5. View your data visually

### Test Backend Connection

1. Start backend server:
   ```powershell
   cd velocity/backend
   npm start
   ```

2. You should see:
   ```
   Connected to MongoDB successfully
   Server is running on port 3000
   ```

---

## Troubleshooting

### Error: "mongosh is not recognized"

**Problem:** MongoDB Shell is not installed or not in PATH.

**Solution:**
1. Install MongoDB Shell from: https://www.mongodb.com/try/download/shell
2. Close and reopen PowerShell after installation
3. Verify: `mongosh --version`

### Error: "MongoDB connection failed"

**Problem:** MongoDB service is not running.

**Solution:**
```powershell
# Check service status
Get-Service MongoDB

# Start service if stopped
net start MongoDB

# Check if port is listening
netstat -an | findstr 27017
```

### Error: "ECONNREFUSED"

**Problem:** MongoDB is not running or port is blocked.

**Solution:**
1. Start MongoDB service: `net start MongoDB`
2. Check firewall settings
3. Verify port 27017 is not blocked

### Error: "Authentication failed" (Atlas)

**Problem:** Wrong credentials or IP not whitelisted.

**Solution:**
1. Verify username and password in connection string
2. Check "Network Access" in Atlas dashboard
3. Ensure your IP is whitelisted

### Error: "User with this email already exists"

**Problem:** User already registered.

**Solution:**
```javascript
// In MongoDB shell
use Velocity
db.users.deleteOne({ email: "user@example.com" })
```

### MongoDB Service Won't Start

**Problem:** Service fails to start.

**Solution:**
1. Check MongoDB logs: `C:\Program Files\MongoDB\Server\{version}\log\mongod.log`
2. Verify data directory exists and has permissions
3. Check if port 27017 is already in use:
   ```powershell
   netstat -ano | findstr :27017
   ```

---

## Quick Reference

### Common Commands

```powershell
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Check service status
Get-Service MongoDB

# Connect to MongoDB shell
mongosh

# Connect to specific database
mongosh "mongodb://localhost:27017/Velocity"
```

### MongoDB Shell Commands

```javascript
// Show databases
show dbs

// Use database
use Velocity

// Show collections
show collections

// Find documents
db.users.find().pretty()

// Count documents
db.users.countDocuments()

// Find one document
db.users.findOne({ email: "user@example.com" })

// Delete document
db.users.deleteOne({ email: "user@example.com" })

// Exit shell
exit
```

---

## Next Steps

1. ✅ Install MongoDB Server
2. ✅ Install MongoDB Shell
3. ✅ Create `.env` file in `velocity/backend/`
4. ✅ Start backend server: `cd velocity/backend && npm start`
5. ✅ Verify: "Connected to MongoDB successfully"
6. ✅ Test signup/login functionality

---

## Additional Resources

- **MongoDB Compass:** https://www.mongodb.com/try/download/compass
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **MongoDB Documentation:** https://docs.mongodb.com/
- **MongoDB Shell Documentation:** https://docs.mongodb.com/mongodb-shell/

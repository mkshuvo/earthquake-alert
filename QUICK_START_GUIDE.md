# 🚀 Earthquake Detection System - Quick Start Guide

## ✅ Current Status: ALL SYSTEMS RUNNING

**Last Verified:** November 29, 2025

---

## 🎯 Running Services (Randomized Host Ports)

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **Web Frontend** | 3000 (host 48291) | http://localhost:48291 | 🟢 Running |
| **Backend API** | 6000 (host 51763) | http://localhost:51763/api | 🟢 Running |
| **MongoDB** | 43982 | localhost:43982 | 🟢 Running |
| **RabbitMQ** | 42107 | amqp://localhost:42107 | 🟢 Running |
| **RabbitMQ UI** | 49876 | http://localhost:49876 | 🟢 Running |
| **EMQX MQTT** | 45329 | mqtt://localhost:45329 | 🟢 Running |
| **EMQX MQTT WS** | 9001 (host 47754) | ws://localhost:47754 | 🟢 Running |
| **EMQX Dashboard** | 18083 | http://localhost:18083 | 🟢 Running |
| **RabbitMQ Consumer** | N/A | Microservice | 🟢 Running |

---

## 🔗 Quick Access Links

### User Interfaces
- **Main Application:** http://localhost:48291
- **Earthquake List:** http://localhost:48291/earthquakes
- **RabbitMQ Management:** http://localhost:49876 (rabbit/rabbit)
- **EMQX Dashboard:** http://localhost:18083

### API Endpoints
- **Health Check:** http://localhost:51763/api/earthquakes/health
- **List Earthquakes:** http://localhost:51763/api/earthquakes?limit=10
- **Statistics:** http://localhost:51763/api/earthquakes/statistics
- **Manual Fetch:** http://localhost:51763/api/earthquakes/fetch

---

## 🏃 How to Start All Services

### Step 1: Start Infrastructure (Docker)
```bash
# Navigate to backend directory
cd f:\projects\earthquake-detection\earthquake-alert-server

# Start MongoDB, RabbitMQ, and EMQX
docker-compose up -d mongo rabbitmq mqtt

# Verify containers are running
docker ps
```

### Step 2: Start Backend Server
```bash
# Navigate to backend directory (if not already there)
cd f:\projects\earthquake-detection\earthquake-alert-server

# Start in development mode
npm run start:dev

# Server will start on port 6000
# Wait for: "🚀 Earthquake Alert Server is running on port 6000"
```

### Step 3: Start RabbitMQ Consumer
```bash
# Open new terminal
# Navigate to consumer directory
cd f:\projects\earthquake-detection\earthquake-rabbitmq-consumer

# Start consumer
npm run start:dev

# Wait for: "🎯 RabbitMQ Consumer is listening for earthquake events..."
```

### Step 4: Start Web Frontend
```bash
# Open new terminal
# Navigate to frontend directory
cd f:\projects\earthquake-detection\earthquake-alert

# Start Next.js dev server
npm run dev

# Default dev server starts on port 3000 (host 48291 when containerized)
# Wait for: "Ready in X.Xs"
```

### Step 5: Verify Everything
```bash
# Check backend health
curl http://localhost:6000/api/earthquakes/health

# Check frontend
curl -I http://localhost:3000

# Should see HTTP 200 OK for both
```

---

## 🛑 How to Stop All Services

### Stop Node.js Processes
```powershell
# Stop all node processes
Stop-Process -Name "node" -Force
```

### Stop Docker Containers
```bash
cd f:\projects\earthquake-detection\earthquake-alert-server
docker-compose down
```

---

## 🔍 Troubleshooting

### Backend Not Starting
**Problem:** Port 6000 already in use  
**Solution:**
```powershell
# Find process using port 6000
netstat -ano | findstr :6000

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

### Frontend Not Loading
**Problem:** Port 3000 already in use  
**Solution:**
```powershell
# Kill process on port 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### MongoDB Connection Failed
**Problem:** MongoDB container not running  
**Solution:**
```bash
# Check container status
docker ps -a | findstr mongodb

# Restart container
docker start ea-mongodb

# Check logs
docker logs ea-mongodb
```

### RabbitMQ Connection Issues
**Problem:** Can't connect to RabbitMQ  
**Solution:**
```bash
# Check if RabbitMQ is running
docker ps | findstr rabbitmq

# Restart if needed
docker restart ea-rabbitmq

# Verify with management UI
# Open http://localhost:49876
```

### Consumer Not Processing Messages
**Problem:** Consumer connected but not receiving messages  
**Solution:**
1. Check backend is publishing to RabbitMQ
2. Verify queue exists in RabbitMQ UI
3. Check consumer logs for errors
4. Restart consumer service

---

## 📊 Monitoring

### Check Backend Logs
```bash
# Backend server logs appear in the terminal where you ran npm run start:dev
# Look for:
# - "Connected to MQTT broker"
# - "RabbitMQ connection established"
# - "Fetching earthquake data from USGS API"
```

### Check Consumer Logs
```bash
# Consumer logs appear in its terminal
# Look for:
# - "Connected to RabbitMQ successfully"
# - "Nest microservice successfully started"
# - "Processing earthquake event: <id>"
```

### Check Database
```bash
# Connect to MongoDB
docker exec -it ea-mongodb mongosh --username root --password root --authenticationDatabase admin

# Use earthquake database
use earthquake_db

# Count earthquakes
db.earthquakes.countDocuments()

# View latest earthquake
db.earthquakes.find().sort({createdAt: -1}).limit(1)
```

### Check RabbitMQ
1. Open http://localhost:49876
2. Login: rabbit/rabbit
3. Go to Queues tab
4. Check `earthquake_queue`
5. See message rates and counts

---

## 📱 Testing the System

### Test 1: Verify Data Fetching
```bash
# Trigger manual fetch
curl http://localhost:6000/api/earthquakes/fetch

# Check logs for "Fetching earthquake data from USGS API"
# Check logs for "Processed X earthquake records"
```

### Test 2: Check Database Storage
```bash
# Get latest earthquakes
curl "http://localhost:6000/api/earthquakes?limit=5"

# Should return JSON array of earthquakes
```

### Test 3: Verify Message Queue
```bash
# Watch consumer terminal
# Wait for next automatic fetch (every 30 seconds)
# Look for "Processing earthquake event" messages
```

### Test 4: Test Web Frontend
1. Open http://localhost:3000 in browser
2. Check for earthquake list
3. Verify map loads
4. Test filters
5. Check connection status indicator

---

## 🔐 Default Credentials

| Service | Username | Password | Port |
|---------|----------|----------|------|
| MongoDB | root | root | 43982 |
| RabbitMQ | rabbit | rabbit | 42107 |
| RabbitMQ UI | rabbit | rabbit | 49876 |
| EMQX | admin | public | 18083 |

---

## 📝 Configuration Files

### Backend Server
- **Location:** `f:\projects\earthquake-detection\earthquake-alert-server\.env`
- **Key Settings:**
  ```
  MONGODB_URI=mongodb://root:root@localhost:43982/earthquake-db?authSource=admin
  RABBITMQ_URL=amqp://rabbit:rabbit@localhost:42107
  MQTT_BROKER_URL=mqtt://localhost:45329
  PORT=6000
  ```

### RabbitMQ Consumer
- **Location:** `f:\projects\earthquake-detection\earthquake-rabbitmq-consumer\.env`
- **Key Settings:**
  ```
  RABBITMQ_URL=amqp://rabbit:rabbit@localhost:42107
  MQTT_URL=mqtt://localhost:45329
  ```

### Web Frontend
- **Location:** `f:\projects\earthquake-detection\earthquake-alert\.env`
- **Key Settings:**
  ```
  NEXT_PUBLIC_API_URL=http://localhost:51763/api
  NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:51763
  NEXT_PUBLIC_MQTT_WS_URL=ws://localhost:47754
  NEXT_PUBLIC_MQTT_TOPIC=alerts/earthquake
  ```

---

## 🎯 Key Features

### Backend Features
- ✅ Auto-fetch earthquakes from USGS every 30 seconds
- ✅ Store in MongoDB with duplicate prevention
- ✅ Publish new earthquakes to RabbitMQ
- ✅ Send MQTT alerts for magnitude >= 4.0
- ✅ WebSocket broadcasting to web clients
- ✅ RESTful API for querying earthquakes
- ✅ Health check endpoint
- ✅ Statistics endpoint

### Consumer Features
- ✅ Consume messages from RabbitMQ
- ✅ Determine alert priority by magnitude
- ✅ Forward alerts to MQTT broker
- ✅ Prepared for push notifications
- ✅ Email alerts for critical earthquakes (M >= 7.0)

### Frontend Features
- ✅ Real-time earthquake display (socket.io with polling fallback)
- ✅ Interactive map with Leaflet
- ✅ List view with sorting
- ✅ Multiple filters (magnitude, location, date)
- ✅ Statistics dashboard with charts
- ✅ WebSocket connection with fallback
- ✅ Browser notifications
- ✅ Responsive design

---

## 🚦 System Health Check

### Quick Health Check
```bash
# One command to check everything
curl http://localhost:51763/api/earthquakes/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "details": {
    "database": "connected",
    "rabbitmq": "connected",
    "mqtt": "connected",
    "lastFetch": "2025-11-29T16:34:46.520Z",
    "connectedClients": 0
  }
}
```

### Manual Checks
```bash
# Check MongoDB
docker exec ea-mongodb mongosh --eval "db.adminCommand('ping')" --username root --password root --authenticationDatabase admin

# Check RabbitMQ
curl -u rabbit:rabbit http://localhost:49876/api/overview

# Check EMQX
curl http://localhost:18083

# Check Backend
curl http://localhost:6000/api/earthquakes/health

# Check Frontend
curl -I http://localhost:3000
```

---

## 📚 Additional Documentation

- **COMPLETE_FEATURES_AND_TESTING_PLAN.md** - Full feature list and test plan
- **TEST_RESULTS.md** - Detailed test results
- **TESTING_COMPLETE_SUMMARY.md** - Executive summary

---

## 🆘 Getting Help

### Common Issues

**Issue:** "Cannot connect to database"
- Check MongoDB container is running: `docker ps | findstr mongodb`
- Verify port 43982 is not in use: `netstat -ano | findstr :43982`
- Check credentials in .env file

**Issue:** "WebSocket connection failed"
- Verify backend is running on port 6000
- Check CORS settings allow localhost:3000
- Look for errors in backend logs

**Issue:** "No earthquakes showing"
- Wait for automatic fetch (30 seconds)
- Manually trigger: `curl http://localhost:6000/api/earthquakes/fetch`
- Check backend logs for USGS API errors

---

## ✨ Next Steps

1. **Open the web app:** http://localhost:3000
2. **Watch the backend logs** for earthquake fetching
3. **Monitor the consumer** for message processing
4. **Test the API endpoints** with curl or Postman
5. **Explore the RabbitMQ UI** to see message flow

---

*Last Updated: November 29, 2025*  
*All services verified and operational* ✅

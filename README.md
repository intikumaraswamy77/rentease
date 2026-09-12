# RentEase – Furniture & Appliance Rental Platform

## Quick Start

### 1. Set Up MongoDB
Choose ONE of these options:

**Option A: MongoDB Atlas (Cloud)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user
3. Whitelist your IP (0.0.0.0/0 for all IPs)
4. Get your connection string
5. Update `rentease-backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/rentease?retryWrites=true&w=majority
   ```

**Option B: Local MongoDB**
1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Start MongoDB: `mongod`
3. The default `.env` already points to `mongodb://127.0.0.1:27017/rentease`

### 2. Install Dependencies
```bash
cd rentease-backend && npm install
cd ../rentease-frontend && npm install
```

### 3. Seed the Database
```bash
cd ../rentease-backend && node seed.js
```

### 4. Start the Servers
```bash
# Terminal 1: Backend
cd rentease-backend && npm run dev

# Terminal 2: Frontend
cd rentease-frontend && npm run dev
```

### 5. Access the App
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000/api/health

### Default Admin Account
- Email: admin@rentease.com
- Password: admin123

## Project Structure
```
unified mentors 2/
├── rentease-backend/          # Node.js + Express API
│   ├── src/
│   │   ├── index.js          # Main server (all routes)
│   │   ├── models/           # Mongoose schemas
│   │   └── middleware/       # Auth middleware
│   ├── seed.js               # Database seed script
│   └── .env                  # Environment variables
│
└── rentease-frontend/         # React 18 + Vite
    ├── src/
    │   ├── App.jsx
    │   ├── pages/            # All UI pages
    │   └── index.css
    └── package.json
```

## Features
- User registration & login (JWT auth)
- Browse furniture & appliances by category
- Add items to cart with tenure selection (3/6/12 months)
- Checkout with delivery scheduling
- Rental history & maintenance requests
- Admin dashboard with stats & CRUD operations
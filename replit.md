# Spend Desk - Expense Approval System

## Overview

Spend Desk is a full-stack expense approval system where employees can submit expenses and managers can approve or reject them. The frontend is a React SPA with Tailwind CSS, and the backend is an Express.js REST API with SQLite database and JWT authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool and dev server
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **Routing**: React Router DOM with protected routes and role-based access
- **State Management**: React Context for authentication state
- **Entry Point**: `frontend/src/main.jsx` renders into `frontend/index.html`
- **Dev Server**: Runs on port 5000 with proxy to backend

### Backend Architecture
- **Framework**: Express.js (v4.18)
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Entry Point**: `backend/server.js`
- **Port**: 3001

### Project Structure
```
/
├── backend/
│   ├── db/
│   │   ├── schema.sql        # Database schema
│   │   └── database.js       # DB initialization
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Expense.js        # Expense model
│   │   ├── Approval.js       # Approval model
│   │   └── index.js          # Model exports
│   ├── routes/
│   │   ├── auth.js           # Auth routes (register, login, me)
│   │   ├── expenses.js       # Employee expense routes
│   │   └── manager.js        # Manager approval routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── server.js             # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── DashboardLayout.jsx  # Shared dashboard layout
│   │   │   └── ui/
│   │   │       ├── StatCard.jsx         # Statistics card
│   │   │       └── StatusBadge.jsx      # Status badge
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Login page
│   │   │   ├── Register.jsx             # Registration page
│   │   │   ├── EmployeeDashboard.jsx    # Employee dashboard
│   │   │   └── ManagerDashboard.jsx     # Manager dashboard
│   │   ├── App.jsx                      # Main app with routing
│   │   ├── main.jsx                     # Entry point
│   │   └── index.css                    # Tailwind imports
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── package.json              # Root package (runs both services)
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user (email, password, name, role)
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

#### Employee Endpoints
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/my` - Get own expenses (with optional status filter)

#### Manager Endpoints
- `GET /api/manager/expenses/pending` - Get pending expenses for review
- `GET /api/manager/expenses` - Get all expenses
- `POST /api/manager/expenses/:id/decision` - Approve or reject expense

### Development Workflow
- Run `npm run dev` from root to start both frontend and backend
- Frontend proxies `/api` requests to backend on port 3001

## External Dependencies

### Frontend
- React, React DOM, React Router DOM
- Vite with @vitejs/plugin-react
- Tailwind CSS v4 with @tailwindcss/postcss, autoprefixer

### Backend
- Express, CORS
- better-sqlite3 (SQLite database)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)

### Development Tools
- Concurrently (runs both servers in parallel)

## Test Users
- Employee: test@example.com / password123
- Manager: manager@example.com / password123

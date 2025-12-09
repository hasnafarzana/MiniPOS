# Spend Desk - Expense Approval System

## Project Documentation

**Version:** 1.0  
**Last Updated:** December 2024

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [User Guide](#user-guide)
8. [Development Setup](#development-setup)

---

## Overview

Spend Desk is a full-stack expense approval system designed for organizations to manage employee expense submissions and managerial approvals. The application provides a streamlined workflow where:

- **Employees** can submit expense requests with details like title, amount, category, and description
- **Managers** can review, approve, or reject pending expense requests with optional remarks

The system features role-based access control, JWT authentication, and a modern responsive user interface.

---

## Features

### Employee Features
- Create new expense submissions with:
  - Title and description
  - Amount in USD
  - Category (Supplies, Travel, Equipment, Software, Training, Other)
  - Date of expense
- View all submitted expenses with status tracking
- Filter expenses by status (Pending, Approved, Rejected)
- Dashboard with expense statistics

### Manager Features
- View all pending expense requests requiring approval
- Approve or reject expenses with optional remarks
- View complete expense history across all employees
- Dashboard with approval statistics and total approved amounts

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control

---

## System Architecture

### Frontend Architecture

The frontend is a React single-page application (SPA) built with modern tooling:

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── DashboardLayout.jsx    # Shared responsive layout
│   │   └── ui/
│   │       ├── StatCard.jsx           # Statistics display card
│   │       └── StatusBadge.jsx        # Status indicator badge
│   ├── context/
│   │   └── AuthContext.jsx            # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx                  # User login page
│   │   ├── Register.jsx               # User registration page
│   │   ├── EmployeeDashboard.jsx      # Employee expense management
│   │   └── ManagerDashboard.jsx       # Manager approval workflow
│   ├── App.jsx                        # Main application with routing
│   ├── main.jsx                       # Application entry point
│   └── index.css                      # Tailwind CSS imports
├── tailwind.config.js                 # Tailwind configuration
├── postcss.config.js                  # PostCSS configuration
└── vite.config.js                     # Vite build configuration
```

### Backend Architecture

The backend is a Node.js Express REST API with SQLite database:

```
backend/
├── db/
│   ├── schema.sql                     # Database schema definition
│   └── database.js                    # Database initialization
├── models/
│   ├── User.js                        # User data operations
│   ├── Expense.js                     # Expense data operations
│   ├── Approval.js                    # Approval data operations
│   └── index.js                       # Model exports
├── routes/
│   ├── auth.js                        # Authentication endpoints
│   ├── expenses.js                    # Employee expense endpoints
│   └── manager.js                     # Manager approval endpoints
├── middleware/
│   └── auth.js                        # JWT authentication middleware
└── server.js                          # Express server configuration
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component library |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Utility-first CSS framework |
| React Router DOM | Client-side routing |
| React Context API | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| better-sqlite3 | SQLite database driver |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password hashing |

---

## API Reference

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "EMPLOYEE"
}
```
**Response:** User object with JWT token

#### Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:** User object with JWT token

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```
**Response:** Current user object

### Employee Endpoints

#### Create Expense
```
POST /api/expenses
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "title": "Office Supplies",
  "amount": 150.00,
  "category": "Supplies",
  "date": "2024-12-09",
  "description": "Printer paper and ink"
}
```

#### Get My Expenses
```
GET /api/expenses/my?status=PENDING
Authorization: Bearer <token>
```
**Query Parameters:** status (optional) - PENDING, APPROVED, REJECTED

### Manager Endpoints

#### Get Pending Expenses
```
GET /api/manager/expenses/pending
Authorization: Bearer <token>
```

#### Get All Expenses
```
GET /api/manager/expenses
Authorization: Bearer <token>
```

#### Make Decision
```
POST /api/manager/expenses/:id/decision
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "decision": "APPROVED",
  "remark": "Approved for Q4 budget"
}
```

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| email | TEXT | Unique email address |
| password | TEXT | Hashed password |
| name | TEXT | User's full name |
| role | TEXT | EMPLOYEE or MANAGER |
| created_at | DATETIME | Account creation timestamp |

### Expenses Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| title | TEXT | Expense title |
| amount | REAL | Amount in USD |
| category | TEXT | Expense category |
| date | TEXT | Date of expense |
| description | TEXT | Optional description |
| status | TEXT | PENDING, APPROVED, REJECTED |
| created_at | DATETIME | Submission timestamp |

### Approvals Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| expense_id | INTEGER | Foreign key to expenses |
| manager_id | INTEGER | Foreign key to users |
| decision | TEXT | APPROVED or REJECTED |
| remark | TEXT | Optional manager remark |
| created_at | DATETIME | Decision timestamp |

---

## User Guide

### For Employees

1. **Registration**: Create an account at the registration page, selecting "Employee" as your role
2. **Login**: Sign in with your email and password
3. **Submit Expense**: Click "Create Expense" in the sidebar to submit a new expense
4. **Track Status**: View all your expenses and their approval status on the dashboard
5. **Filter**: Use the status filter to view only pending, approved, or rejected expenses

### For Managers

1. **Registration**: Create an account selecting "Manager" as your role
2. **Login**: Sign in with your email and password
3. **Review Pending**: View all pending expenses requiring your approval
4. **Make Decisions**: Click "Review" on any expense to approve or reject it
5. **Add Remarks**: Optionally add remarks explaining your decision
6. **View History**: Switch to "History" tab to see all past decisions

---

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development servers:
```bash
npm run dev
```

This starts both the frontend (port 5000) and backend (port 3001) simultaneously.

### Test Accounts

For testing purposes, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Employee | test@example.com | password123 |
| Manager | manager@example.com | password123 |

---

## Support

For questions or issues, please contact the development team.

---

*Document generated for Spend Desk v1.0*

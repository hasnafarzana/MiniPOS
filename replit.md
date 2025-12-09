# Replit.md

## Overview

This is a full-stack web application with a separated frontend and backend architecture. The frontend is a React single-page application built with Vite, while the backend is an Express.js REST API server. The application currently provides a simple health check endpoint demonstrating the frontend-backend communication pattern.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool and dev server
- **Entry Point**: `frontend/src/main.jsx` renders into `frontend/index.html`
- **Dev Server**: Runs on port 5000 with a proxy configured to forward `/api` requests to the backend
- **Styling**: Plain CSS with a single `index.css` file

### Backend Architecture
- **Framework**: Express.js (v4.18)
- **Entry Point**: `backend/server.js`
- **Port**: 3001 (configurable via `PORT` environment variable)
- **Middleware**: CORS enabled for cross-origin requests, JSON body parsing
- **API Pattern**: RESTful endpoints prefixed with `/api`

### Project Structure
```
/
├── backend/          # Express.js API server
│   └── server.js     # Main server file
├── frontend/         # React + Vite application
│   ├── src/          # React source code
│   └── vite.config.js
└── package.json      # Root package for running both services
```

### Development Workflow
- Root `package.json` uses `concurrently` to run both frontend and backend simultaneously
- Frontend proxies API calls to backend, avoiding CORS issues in development
- Run `npm run dev` from root to start both servers

## External Dependencies

### Frontend
- **React**: UI library for building component-based interfaces
- **React DOM**: React renderer for web browsers
- **Vite**: Fast development server and build tool
- **@vitejs/plugin-react**: Vite plugin for React support with Fast Refresh

### Backend
- **Express**: Web server framework for handling HTTP requests
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing

### Development Tools
- **Concurrently**: Runs multiple npm scripts in parallel (used at root level)

### Database
- No database is currently configured. The application is stateless.

### External Services
- No external APIs or third-party services are integrated.
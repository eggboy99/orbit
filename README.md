# Web Application Setup Guide

This web application consists of separate frontend and backend components that need to run simultaneously.
## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [project-directory]
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```

## Starting the Application

You'll need to run both the frontend and backend servers in separate terminal windows:

### Frontend

```bash
npm run dev
```

The frontend development server will start and typically be available at `http://localhost:5173` (check console output for the exact URL).

### Backend

```bash
npm run start:dev
```

The backend server will start and typically be available at `http://localhost:3000` (check console output for the exact port).

## Development Notes

- The frontend uses a development server with hot reloading enabled
- The backend uses nodemon to automatically restart the server when changes are detected
- Make sure both servers are running for the application to function properly

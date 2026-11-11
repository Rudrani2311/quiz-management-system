# Quiz management and examination system

A full-stack MERN web application enabling administrators to create and manage quizzes and question banks, while students can attempt timed examinations, receive backend-evaluated results, and review performance analysis.

## Demo credentials

- **Administrator account**: `admin@university.edu` / `password123`
- **Student account**: `student@university.edu` / `password123`

## Running the project

1. **Backend server** (`http://localhost:5000`):
   ```bash
   cd backend
   npm install
   npm start
   ```
   *(Automatically connects to local MongoDB at `mongodb://127.0.0.1:27017/qmes` or launches an embedded MongoDB instance and seeds initial academic data if local MongoDB is not running.)*

2. **Frontend application** (`http://localhost:5173`):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

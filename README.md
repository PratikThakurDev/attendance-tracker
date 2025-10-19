Attendance Tracker
Overview
Attendance Tracker is a full-stack web application that allows users to manage subjects, track student attendance, and view attendance summaries. It features a PostgreSQL database backend with a Node.js and Express API, and a React frontend built with Vite and Tailwind CSS. The app supports user registration, subjects management, attendance marking, and attendance summary visualization.

Features
User registration and authentication (backend)

CRUD operations for subjects

Record attendance for students (students are users)

Dashboard with attendance summaries per subject

Responsive React frontend with client-side routing

PostgreSQL database with relational schema and referential integrity

Deployment-ready for platforms like Render (backend) and Vercel (frontend)

Tech Stack
Backend: Node.js, Express, PostgreSQL, pg, express-validator, dotenv, bcrypt, jsonwebtoken

Frontend: React, Vite, Tailwind CSS, React Router, Axios

Database Schema: Users, Subjects, Attendance, Timetable tables with foreign key relationships

Installation and Setup
Backend
Clone the repository and navigate to the backend folder.

Install dependencies:

bash
npm install
Create a .env file with your environment variables, e.g.:

bash
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
Run the backend server locally:

bash
npm start
Frontend
Navigate to the frontend folder.

Install dependencies:

bash
npm install
Create a .env file for frontend variables:

bash
VITE_API_URL=http://localhost:5000/api
Run the frontend locally:

bash
npm run dev
Deployment
Deploy backend to Render:

Set Root Directory to backend

Build Command: npm install

Start Command: npm start

Add environment variables on Render dashboard

Deploy frontend to Vercel:

Set Root Directory to frontend

Build Command: npm run build

Output Directory: dist

Add environment variables such as VITE_API_URL pointing to Render backend

Database Schema
users table stores registered users

subjects linked to users

attendance linked to subjects and users (students)

timetable for scheduling subjects

Referential integrity is enforced with foreign keys.

API Endpoints
/api/users - User registration and management

/api/subjects - CRUD for subjects

/api/attendance - Mark and fetch attendance records

/api/attendance/summary/:userId - Get attendance stats per subject for a user
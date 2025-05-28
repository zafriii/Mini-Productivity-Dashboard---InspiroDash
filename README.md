# 🌟 Inspiro Dash — Mini Productivity Dashboard

**Live Demo** 👉 [https://inspiro-dash.netlify.app/](https://inspiro-dash.netlify.app/)

---

## 📌 About the Project

**Inspiro Dash** is a minimal yet powerful productivity dashboard designed to keep you motivated and organized. It fetches a daily motivational quote and allows you to manage your tasks and goals effectively.

---

## 🔥 Features

## 🔐 User Authentication

- Users can **sign up** and **log in** to their accounts.
- JWT-based **token authentication** is implemented to secure user routes.
- Only logged-in users can access, add, update, or delete their tasks and goals.

### 🧘 Daily Motivation
- Automatically fetches and displays a quote from the [ZenQuotes API](https://zenquotes.io/) to start your day with inspiration.

### ✅ Task Management
- Add, edit, delete tasks.
- Mark tasks as complete or undo them.
- View tasks categorized as:
  - **Today's Tasks**
  - **Upcoming Tasks**
- See visual progress of task completion.

### 🎯 Goal Management
- Add weekly or monthly goals.
- Assign priorities (High / Medium / Low).
- Edit and delete goals.
- Mark goals as complete or revert them.
- Visual progress indicator for goal tracking.

---


## 🧰 Tech Stack

- **Frontend**: React, CSS 
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **API Integration**: ZenQuotes API

---

## ⚙️ Project Setup

### 🖥️ Frontend (React)

```bash
# Clone the repository
git clone https://github.com/your-username/inspiro-dash.git

# Navigate to the frontend directory
cd frontend cd mini-productivity-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev

```
### 🖥️ Backend (Node js, Express js, MongoDb)

```bash
# Navigate to the backend directory
cd backend cd server

# Install dependencies
npm install

# Create a `.env` file in the root with the following content:
MONGODB_URI=mongodb+srv://your-username:your-password@mongodb.sekrqaw.mongodb.net/mini_productivity?retryWrites=true&w=majority&appName=Mon
JWT_SECRET_KEY=USERID&PASSWORD
PORT=5000

# Start the server
npm run start

```

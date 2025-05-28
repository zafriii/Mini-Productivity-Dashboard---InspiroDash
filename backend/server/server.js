require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require("./utils/db");

const authRouter = require("./router/auth-router");

const taskRouter = require("./router/taskRouter");

const goalRouter = require("./router/goalRouter");

const errorMiddleware = require("./middlewares/error-middleware");

const app = express();
const server = http.createServer(app); // Create the server for both HTTP and WebSocket connections

// Middleware for CORS
const corsOptions = {
  origin: "http://localhost:5173", // Adjust according to the frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and static files
app.use(express.json());
app.use(express.static('dist'));

// Connect routes for authentication and blogs
app.use("/api/auth", authRouter);

app.use("/api/tasks", taskRouter);

app.use("/api/goals", goalRouter);

// Middleware for handling errors
app.use(errorMiddleware);

// Database connection and starting the server
const port = 5000;
connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
});



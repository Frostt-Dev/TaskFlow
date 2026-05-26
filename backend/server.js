require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Connect to MongoDB Atlas or Local MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for easier cloud deployment
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mount Routes
app.use('/bfhl/tasks', taskRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('TaskFlow API is running smoothly. Access tasks at /bfhl/tasks');
});

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Custom Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error Details:', err);

  // Handle Mongoose Validation Error (missing fields, min/max length/value checks, custom validators)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Handle Mongoose Cast Error (malformed ID or bad type casts)
  if (err.name === 'CastError') {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Malformed or invalid ID format' });
    }
    return res.status(400).json({ error: `Invalid input type for ${err.path}` });
  }

  // Fallback to Express default status or 500
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'An unexpected server error occurred'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in production-ready mode on port ${PORT}`);
});

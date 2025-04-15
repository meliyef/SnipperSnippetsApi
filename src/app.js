// src/app.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const { auth } = require('express-openid-connect');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Auth0 configuration
const {
  AUTH0_SECRET = 'a long, randomly-generated string stored in env', // generate one by using: `openssl rand -base64 32`
  AUTH0_AUDIENCE = 'http://localhost:3000',
  AUTH0_CLIENT_ID,
  AUTH0_BASE_URL,
} = process.env;

const config = {
  authRequired: true, // require login for all routes
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_BASE_URL,
};

// Auth0 middleware
app.use(auth(config));

// Basic route to check if the server is working
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Import routes
const snippetsRouter = require('./routes/snippetRouter');
const usersRouter = require('./routes/userRouter');
const profileRouter = require('./routes/profileRouter');

app.use('/api/snippets', snippetsRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);

// Catch-all for handling 404 errors
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${config.baseURL}`);
});

// src/app.js

const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Basic route to check if the server is working
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Import your routes (we'll create these later)
const snippetsRouter = require('./routes/snippetRouter');
const usersRouter = require('./routes/userRouter'); 
app.use('/api/snippets', snippetsRouter);
app.use('/api/users',usersRouter);

// Catch-all for handling 404 errors (if route not found)
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Global error handler (optional for catching errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

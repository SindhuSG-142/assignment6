const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const logDirectory = path.join(__dirname, 'src');
const logFilePath = path.join(logDirectory, 'access.log');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });
// Setup Morgan Logger Middleware
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'src', 'access.log'), { flags: 'a' });

// Custom token for Morgan to log response time in milliseconds
morgan.token('time-taken', function (req, res) {
  return res.getHeader('X-Response-Time');
});

// Use Morgan Middleware with custom format
app.use(morgan(':method :status :res[content-length] :time-taken :date[web] :http-version :url', { stream: accessLogStream }));

// Middleware to log response time
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    res.setHeader('X-Response-Time', `${Date.now() - start}ms`);
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Express Logger Project!');
});

app.get('/get-users', (req, res) => {
  res.status(200).json({ users: ['user1', 'user2'] });
});

app.post('/add-user', (req, res) => {
  res.status(201).send('User added successfully!');
});

app.put('/user/:id', (req, res) => {
  res.status(200).send(`User with ID ${req.params.id} updated successfully!`);
});

app.delete('/user/:id', (req, res) => {
  res.status(200).send(`User with ID ${req.params.id} deleted successfully!`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

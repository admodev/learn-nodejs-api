const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth');
// Private route
const postRoute = require('./routes/posts');

dotenv.config();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to database!');
  }
);

app.use(express.json());

// Route middlewares
app.use('/api/user', authRoute);

app.use('/api/posts', postRoute);

app.listen(3030, () => console.log('The server is running!'));

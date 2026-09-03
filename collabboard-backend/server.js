const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// Middleware (Request Body එක read කර ගැනීමට මෙය අත්‍යවශ්‍ය වේ)
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
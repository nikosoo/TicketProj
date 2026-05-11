const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database name:', mongoose.connection.db.databaseName);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Use authentication and ticket routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Ticket Project API');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

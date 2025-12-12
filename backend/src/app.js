const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();

app.use(express.json());
app.use(cors());

// Basic health check
app.get('/', (req, res) => {
    res.send('Sweet Shop API');
});

const authRoutes = require('./routes/auth');
const sweetRoutes = require('./routes/sweets');

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

module.exports = app;

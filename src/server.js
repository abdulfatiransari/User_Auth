const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

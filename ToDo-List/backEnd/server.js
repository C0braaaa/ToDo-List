const express = require('express');
const cors = require('cors');
const connection = require('./config/database');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const detailRoutes = require('./routes/details.routes');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/home.html'));
});
app.use(express.static(path.join(__dirname, '../frontend')));
// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/details', detailRoutes);
// Single connection attempt
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID', connection.threadId);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
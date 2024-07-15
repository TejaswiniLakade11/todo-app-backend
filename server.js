const express = require('express');
const bodyParser = require('body-parser');
const tasksRoutes = require('./routes/tasks');
const todoRoutes = require('./routes/todo');
const authenticateJWT = require('./middleware/authenticateJWT');
const { register, login} = require('./controllers/userController');
const {createTodo} = require('./controllers/taskController');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Routes
app.post('/register',register);
app.post('/login', login);
app.post('/create-todo',authenticateJWT, createTodo);
app.use('/tasks', tasksRoutes);
app.use('/todo', todoRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
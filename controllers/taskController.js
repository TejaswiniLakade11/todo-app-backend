const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getAllTasks = async (req, res) => {
    
    try {
        const [rows, fields] = await db.execute('SELECT * FROM tasks');
        console.log(rows, fields)
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
};

exports.createTodo = async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const [userRows] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const statusValue = status !== undefined ? status : null;
        const dueDateValue = dueDate !== undefined ? dueDate : null;

        const insertQuery = 'INSERT INTO tasks (userId, title, description, status, dueDate) VALUES (?, ?, ?, ?, ?)';
        const insertValues = [userId, title, description, statusValue, dueDateValue];
        await db.execute(insertQuery, insertValues);

        res.status(200).json({ message: 'Task created successfully' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

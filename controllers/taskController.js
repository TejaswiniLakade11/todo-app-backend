const db = require('../config/db');

exports.getAllTasks = async (req, res) => {
    const userId = req.user.userId;
    
    try {
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE userId = ?', [userId]);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, status, dueDate } = req.body;
    const userId = req.user.userId;

    try {
        await db.execute('INSERT INTO tasks (userId, title, description, status, dueDate) VALUES (?, ?, ?, ?, ?)', [userId, title, description, status, dueDate]);
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task' });
    }
};

exports.getTaskById = async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user.userId;

    try {
        const [taskRows] = await db.execute('SELECT * FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
        const task = taskRows[0];

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving task' });
    }
};

exports.updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, status, dueDate } = req.body;
    const userId = req.user.userId;

    try {
        await db.execute('UPDATE tasks SET title = ?, description = ?, status = ?, dueDate = ? WHERE id = ? AND userId = ?', [title, description, status, dueDate, taskId, userId]);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task' });
    }
};

exports.deleteTask = async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user.userId;

    try {
        await db.execute('DELETE FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting task' });
    }
};

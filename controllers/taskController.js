const db = require('../config/db');

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
    const userId = req.params.userId; 
  
    try {
     
      const [userRows] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
      if (userRows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      await db.execute('INSERT INTO tasks (userId, title, description, status, dueDate) VALUES (?, ?, ?, ?, ?)', [userId, title, description, status, dueDate]);
      
      res.status(200).json({ message: 'Task created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating task' });
    }
  };
  


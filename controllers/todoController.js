const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.finishtodo = async (req, res) => {
  const { fieldToUpdate, valueToUpdate } = req.body;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  console.log('Received Body:', req.body);

  const allowedFields = ['status', 'title', 'description'];
  if (!allowedFields.includes(fieldToUpdate)) {
    return res.status(400).json({ error: 'Invalid field to update' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; 
    const taskId = req.params.taskId; 

    console.log('Decoded Token:', decoded);

    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE userId = ? AND id = ?',
      [userId, taskId]
    );

    console.log('Tasks Found:', tasks);
    console.log(userId, taskId);

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [updateResult] = await db.query(
      `UPDATE tasks SET ${fieldToUpdate} = ? WHERE userId = ? AND id = ?`,
      [valueToUpdate, userId, taskId]
    );

    console.log('Update Result:', updateResult);

    const [updatedTasks] = await db.query(
      'SELECT * FROM tasks WHERE userId = ? AND id = ?',
      [userId, taskId]
    );

    console.log('Updated Tasks:', updatedTasks);

    res.json(updatedTasks[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listtodo = async (req, res) => {
  const status = req.params.status;
  console.log('status:', status); 

  try {

      let sql = 'SELECT * FROM tasks ';

      if (status && (status == 'INCOMPLETE' || status == 'COMPLETED')) {
          sql += ` WHERE status = '${status}'`; 
      }
    
      const results = await db.query(sql);

      console.log('result ',results);

      const statusList = results[0];

      console.log('status ',statusList);
      
      res.json(statusList); 
  } catch (error) {
      console.error('Error fetching status list:', error);
      res.status(500).send('Error fetching status list');
  }
};

exports.TodoById = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
      return res.status(401).send('Authorization token is required');
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      if (!userId) {
          return res.status(400).send('User ID is required');
      }

      const sql = 'SELECT * FROM tasks WHERE userId = ?';
      const [results] = await db.query(sql, [userId]);

      if (results.length === 0) {
          return res.status(404).send('Tasks not found');
      }

      res.json(results);
  } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).send('Error fetching tasks');
  }
};
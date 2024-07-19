const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/get',  taskController.getAllTasks);
router.post('/createtodo', authenticateJWT, taskController.createTodo,async(res)=>{
    res.status(200).json({ message: 'Task created successfully' });
});

module.exports = router;

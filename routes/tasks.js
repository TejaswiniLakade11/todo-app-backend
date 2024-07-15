const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/get', taskController.getAllTasks);
router.post('/createtodo/:userId', taskController.createTodo);

module.exports = router;

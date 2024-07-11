const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.get('/', auth, taskController.getAllTasks);
router.post('/', auth, taskController.createTask);
router.get('/:taskId', auth, taskController.getTaskById);
router.put('/:taskId', auth, taskController.updateTask);
router.delete('/:taskId', auth, taskController.deleteTask);

module.exports = router;

const express = require('express');
const router = express.Router();
const {finishtodo,listtodo,TodoById} = require('../controllers/todoController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.put('/finish/task/:taskId', authenticateJWT , finishtodo);
router.get('/list/:status', listtodo );
router.get('/TodoId', authenticateJWT , TodoById );

module.exports = router;
const express = require('express');
const router = express.Router();
const {finishtodo,listtodo,TodoById} = require('../controllers/todoController');

router.put('/finish/user/:userId/task/:taskId', finishtodo );
router.get('/list/:status', listtodo );
router.get('/TodoId/:userId', TodoById );

module.exports = router;
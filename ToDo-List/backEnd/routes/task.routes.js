const express = require('express');
const router = express.Router();
const TaskController = require('../controller/task.controller');

router.post('/create', TaskController.createTask);
router.get('/user/:email', TaskController.getTasks); // Đổi từ userId thành email
router.put('/update', TaskController.updateTaskStatus);
router.delete('/:taskId', TaskController.deleteTask);
// router.get('/task/:taskId', TaskController.getTaskById);

module.exports = router;
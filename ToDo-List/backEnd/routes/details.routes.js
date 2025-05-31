const express = require('express');
const router = express.Router();
const DetailController = require('../controller/details.controller');

router.get('/task/:taskId', DetailController.getTaskDetails);
router.put('/task/:taskId', DetailController.updateTaskDetails);

module.exports = router;
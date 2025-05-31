const express = require('express');
const router = express.Router();
const UserController = require('../controller/user.controller');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/change-password', UserController.changePassword);
module.exports = router;
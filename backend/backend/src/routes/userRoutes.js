const express = require('express');
const router = express.Router(); // ✅ PASTIKAN INI express.Router()
const userController = require('../controllers/userController');

// ✅ ROUTES YANG BENAR
router.post('/register', userController.register);
router.post('/login', userController.login);

// CRUD routes
router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.patch('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
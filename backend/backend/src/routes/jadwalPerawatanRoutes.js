const express = require('express');
const router = express.Router();
// Pastikan path ini benar sesuai lokasi file userController.js kamu
const jadwalPerawatanController = require('../controllers/jadwalPerawatanController'); 

// --- ROUTE UNTUK USER ---

// 1. Create User (POST /api/users)
router.post('/', jadwalPerawatanController.create);

// 2. Read All Users (GET /api/users)
router.get('/', jadwalPerawatanController.getAll);

// 3. Read One User by ID (GET /api/users/:id)
router.get('/:id', jadwalPerawatanController.getOne);

// 4. Update User by ID (PATCH /api/users/:id)
// PATCH digunakan untuk update sebagian data. PUT untuk update keseluruhan.
router.patch('/:id', jadwalPerawatanController.update);

// 5. Delete User by ID (DELETE /api/users/:id)
router.delete('/:id', jadwalPerawatanController.remove);

module.exports = router;
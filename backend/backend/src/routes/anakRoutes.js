const express = require('express');
const router = express.Router();
// Pastikan path ini benar sesuai lokasi file userController.js kamu
const anakController = require('../controllers/anakController'); 
// --- ROUTE UNTUK ANAK ---

// 1. Create Anak (POST /api/children)
router.post('/', anakController.create);

// 2. Read All Anak (GET /api/children)
router.get('/', anakController.getAll);

// 3. Read One Anak by ID (GET /api/children/:id)
router.get('/:id', anakController.getOne);

// 4. Update Anak by ID (PATCH /api/children/:id)
// PATCH digunakan untuk update sebagian data. PUT untuk update keseluruhan.
router.patch('/:id', anakController.update);

// 5. Delete Anak by ID (DELETE /api/children/:id)
router.delete('/:id', anakController.remove);

module.exports = router;
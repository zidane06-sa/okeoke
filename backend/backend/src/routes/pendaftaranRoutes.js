const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');

// CREATE
router.post('/', pendaftaranController.create);
// READ ALL  
router.get('/', pendaftaranController.getAll);
// READ ONE
router.get('/:id', pendaftaranController.getOne);
// UPDATE (Full - untuk edit data pendaftaran biasa)
router.put('/:id', pendaftaranController.update);
// ⭐⭐ UPDATE STATUS (Ini yang trigger auto create anak) ⭐⭐
router.patch('/:id/status', pendaftaranController.updateStatus);
// DELETE
router.delete('/:id', pendaftaranController.remove);

module.exports = router;
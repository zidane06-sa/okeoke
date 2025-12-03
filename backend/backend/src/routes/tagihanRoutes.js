const express = require('express');
const router = express.Router();
const tagihanController = require('../controllers/tagihanController');
const upload = require('../middlewares/uploadHandler');

// 1. Create Tagihan (POST /tagihan)
router.post('/', tagihanController.create);

// 2. Read All Tagihan (GET /tagihan)
router.get('/', tagihanController.getAll);

// 3. Read One Tagihan by ID (GET /tagihan/:id)
router.get('/:id', tagihanController.getOne);

// 4. Update Tagihan (PATCH /tagihan/:id)
router.patch('/:id', tagihanController.update);

// 5. Delete Tagihan (DELETE /tagihan/:id)
router.delete('/:id', tagihanController.remove);

// 6. Upload Payment Proof (POST /tagihan/:id/upload-proof)
router.post('/:id/upload-proof', upload.single('paymentProof'), tagihanController.uploadPaymentProof);

module.exports = router;
const express = require('express');
const router = express.Router();
const laporanHarianController = require('../controllers/laporanHarianController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (token) {
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
    } catch (err) {
      // Token invalid but continue anyway
    }
  }
  next();
};

// Apply optional auth middleware to all routes
router.use(optionalAuth);

// 1. Create (POST)
router.post('/', laporanHarianController.create);

// 2. Read All (GET)
router.get('/', laporanHarianController.getAll);

// 3. Read One (GET /:id)
router.get('/:id', laporanHarianController.getOne);

// 4. Update (PATCH /:id)
router.patch('/:id', laporanHarianController.update);

// 5. Delete (DELETE /:id)
router.delete('/:id', laporanHarianController.remove);

module.exports = router;
const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (Search/View) - Requirements say "Sweets (Protected)" but listing usually public?
// User Requirements: "Sweets (Protected): GET /api/sweets"
// Implementation: I will protect ALL sweet routes as per the "Sweets (Protected)" heading in requirements.
// However, earlier I thought View might be public. Let's stick to requirements: All Protected.

router.get('/', authMiddleware, sweetController.getAllSweets);
router.get('/search', authMiddleware, sweetController.searchSweets);
router.post('/', authMiddleware, sweetController.createSweet);
router.put('/:id', authMiddleware, sweetController.updateSweet);
router.delete('/:id', authMiddleware, sweetController.deleteSweet);
router.post('/:id/purchase', authMiddleware, sweetController.purchaseSweet);
router.post('/:id/restock', authMiddleware, sweetController.restockSweet);

module.exports = router;

const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');

// Routes for repairs
router.post('/', repairController.createRepair);
router.get('/', repairController.getAllRepairs);
router.get('/:id', repairController.getRepairById);
router.put('/:id', repairController.updateRepair);
router.delete('/:id', repairController.deleteRepair);

module.exports = router;
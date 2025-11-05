const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');

router.get('/', categoryController.getCategory);
router.post('/', categoryController.createCategory);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
module.exports = router;

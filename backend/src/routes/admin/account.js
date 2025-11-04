const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const controller = require('../../controllers/admin/accountController');

// Route to create a new account with avatar upload
router.post('/', upload.single('avatar'), controller.createAccount);
router.put('/:id', upload.single('avatar'), controller.updateAccount);
router.get('/:id', controller.getAccountById);
router.get('/', controller.getAccount);
router.delete('/:id', controller.deleteAccount);
module.exports = router;
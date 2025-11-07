const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const articleController = require('../../controllers/admin/articleController');

router.post('/', upload.single('image'), articleController.createArticle);
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', upload.single('image'), articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
module.exports = router;
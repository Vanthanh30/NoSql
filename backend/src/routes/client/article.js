const express = require('express');
const router = express.Router();
const articleController = require("../../controllers/admin/articleController");
router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleById);

module.exports = router;
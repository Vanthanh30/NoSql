const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");
const authJWT = require("../../middlewares/authJWT");
const articleController = require("../../controllers/admin/articleController");

// Middleware authJWT sẽ đảm bảo req.userId có sẵn
router.post("/", authJWT, upload.single("image"), articleController.createArticle);
router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleById);
router.put("/:id", authJWT, upload.single("image"), articleController.updateArticle);
router.delete("/:id", authJWT, articleController.deleteArticle);

module.exports = router;

const Article = require("../../models/admin/articles");

const createArticle = async (req, res) => {
  try {
    const { title, content, category, createdBy } = req.body;

    if (!title || !content || !category || !createdBy) {
      return res
        .status(400)
        .json({ error: "title, content, category and createdBy are required" });
    }

    const creator =
      typeof createdBy === "string" ? JSON.parse(createdBy) : createdBy;

    if (!creator.account_id) {
      return res
        .status(400)
        .json({ error: "createdBy.account_id is required" });
    }

    const newArticle = new Article({
      title,
      content,
      category: category,
      image: req.file?.path || null,
      createdBy: {
        account_id: creator.account_id,
        createdAt: Date.now(),
      },
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: error.message });
  }
};

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ deleted: false })
      .populate("category", "title")
      .exec();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);
    if (!article || article.deleted) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const updateData = req.body;

    const article = await Article.findById(articleId);
    if (!article || article.deleted) {
      return res.status(404).json({ error: "Article not found" });
    }

    article.title = updateData.title || article.title;
    article.content = updateData.content || article.content;
    article.category = updateData.category || article.category;
    article.status = updateData.status || article.status;
    article.image = req.file?.path || article.image; // multer đã upload
    article.updatedBy = {
      account_id: updateData.account_id || req.account_id || "unknown",
      updatedAt: Date.now(),
    };

    await article.save();
    res.status(200).json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const deletedArticle = await Article.findByIdAndUpdate(
      articleId,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};

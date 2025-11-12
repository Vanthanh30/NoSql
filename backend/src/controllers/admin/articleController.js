
const Article = require("../../models/admin/articles");

const createArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category)
      return res.status(400).json({ error: "title, content, category are required" });

    if (!req.userId)
      return res.status(401).json({ error: "Unauthorized: no user" });

    const newArticle = new Article({
      title,
      content,
      category,
      image: req.file?.path || null,
      createdBy: { account_id: req.userId }
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ deleted: false })
      .populate("category", "title")
      .populate("createdBy.account_id", "fullName")
      .exec();

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("category", "title")
      .populate("createdBy.account_id", "name email");
    if (!article || article.deleted)
      return res.status(404).json({ error: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article || article.deleted)
      return res.status(404).json({ error: "Article not found" });

    const { title, content, category, status } = req.body;
    article.title = title || article.title;
    article.content = content || article.content;
    article.category = category || article.category;
    article.status = status || article.status;
    article.image = req.file?.path || article.image;
    article.updatedBy = { account_id: req.userId, updatedAt: Date.now() };

    await article.save();
    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!deletedArticle)
      return res.status(404).json({ error: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle
};

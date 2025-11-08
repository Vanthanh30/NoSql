const Article = require('../../models/admin/articles');
const createArticle = async (req, res) => {
    try {
        const { title, content, image, createdBy } = req.body;
        const newArticle = new Article({
            title,
            content,
            image,
            createdBy: {
                account_id: createdBy.account_id,
                createdAt: Date.now()
            }
        });
        let imageUrl = null;
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'article_images',
            });
            imageUrl = uploadResult.secure_url;
            newArticle.image = imageUrl;
        }
        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getArticles = async (req, res) => {
    try {
        const articles = await Article.find({ deleted: false });
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getArticleById = async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId);
        if (!article || article.deleted) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const updateArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const updateData = req.body;
        const article = await Article.findById(articleId);
        if (!article || article.deleted) {
            return res.status(404).json({ error: 'Article not found' });
        }
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'article_images',
            });
            updateData.image = uploadResult.secure_url;
        }
        article.title = updateData.title || article.title;
        article.content = updateData.content || article.content;
        article.status = updateData.status || article.status;
        article.updatedBy = {
            account_id: req.account_id,  // hoặc từ token đăng nhập
            updatedAt: Date.now()
        };
        await article.save();
        res.status(200).json(article);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const deletedArticle = await Article.findByIdAndUpdate(articleId, { deleted: true }, { new: true });
        if (!deletedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    createArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle
};
const category = require('../../models/admin/categories');

const getCategory = async (req, res) => {
    try {
        const categories = await category.find({ deleted: false });
        res.status(200).json({ message: 'Categories retrieved successfully', categories: categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const createCategory = async (req, res) => {
    try {
        const { title, description, parentId, status, position } = req.body;
        const newCategory = new category({
            title,
            description,
            parentId,
            status,
            position
        });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });

    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = await category.findById(categoryId);
        if (!categoryData || categoryData.deleted) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category retrieved successfully', category: categoryData });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { title, description, parentId, status, position } = req.body;
        const updatedCategory = await category.findByIdAndUpdate(
            categoryId,
            { title, description, parentId, status, position },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await category.findByIdAndUpdate(
            categoryId,
            { deleted: true },

        );
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = {
    getCategory,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};
// api : http://localhost:3000/api/admin/categories
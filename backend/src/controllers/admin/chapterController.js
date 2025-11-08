const Chapter = require('../../models/admin/chapter');
const Lesson = require('../../models/admin/lesson');


const createChapter = async (req, res) => {
    try {
        const { title, lessons } = req.body;
        const chapter = new Chapter({ title, lessons });
        await chapter.save();
        res.status(201).json({ message: 'Chapter created successfully', chapter });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find().populate('lessons');
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateChapter = async (req, res) => {
    try {
        const updated = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Chapter not found' });
        res.status(200).json({ message: 'Chapter updated successfully', chapter: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteChapter = async (req, res) => {
    try {
        const deleted = await Chapter.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Chapter not found' });
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createChapter,
    getChapters,
    updateChapter,
    deleteChapter
};

const Lesson = require('../../models/admin/lesson');
const Chapter = require('../../models/admin/chapter');
const Course = require('../../models/admin/course');


const createCourse = async (req, res) => {
    try {
        const { title, category, level, language, instructor, status, time, pricing, description, createdBy, chapters } = req.body;
        if (!title || !Array.isArray(chapters)) return res.status(400).json({ error: "Title and chapters are required." });

        const chapterIds = [];
        for (const ch of chapters) {
            const lessonIds = [];

            if (Array.isArray(ch.lessons)) {
                for (const lesson of ch.lessons) {
                    const newLesson = new Lesson(lesson);
                    await newLesson.save();
                    lessonIds.push(newLesson._id);
                }
            }

            const newChapter = new Chapter({ title: ch.title, lessons: lessonIds });
            await newChapter.save();
            chapterIds.push(newChapter._id);
        }

        const imageUrl = req.files?.["imageUrl"] ? req.files["imageUrl"][0].path : null;
        const videoUrl = req.files?.["videoUrl"] ? req.files["videoUrl"][0].path : null;

        const newCourse = new Course({
            title, category, level, language, instructor, status, time,
            media: { imageUrl, videoUrl },
            pricing,
            description,
            chapters: chapterIds,
            createdBy: { account_id: createdBy?.account_id || "admin", createdAt: Date.now() }
        });

        await newCourse.save();
        const populated = await Course.findById(newCourse._id).populate({ path: 'chapters', populate: { path: 'lessons' } });

        res.status(201).json({ message: 'Course created successfully', course: populated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ deleted: false }).populate({ path: 'chapters', populate: { path: 'lessons' } });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({ path: 'chapters', populate: { path: 'lessons' } });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const updateData = req.body.data ? JSON.parse(req.body.data) : req.body;

        if (req.files?.imageUrl) {
            updateData.media = updateData.media || {};
            updateData.media.imageUrl = req.files.imageUrl[0].path;
        }
        if (req.files?.videoUrl) {
            updateData.media = updateData.media || {};
            updateData.media.videoUrl = req.files.videoUrl[0].path;
        }
        if (updateData.updatedBy && updateData.updatedBy.account_id) {
            updateData.$push = {
                updatedBy: {
                    account_id: updateData.updatedBy.account_id,
                    updatedAt: new Date()
                }
            };
        }

        const updated = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
            .populate({ path: 'chapters', populate: { path: 'lessons' } });

        if (!updated) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json({ message: 'Course updated successfully', course: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteCourse = async (req, res) => {
    try {
        const deleted = await Course.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        if (!deleted) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};

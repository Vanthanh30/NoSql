const Lesson = require('../../models/admin/lesson');
const Chapter = require('../../models/admin/chapter');
const Course = require('../../models/admin/course');
const Category = require('../../models/admin/categories');
const createCourse = async (req, res) => {
    try {
        const {
            title,
            category,
            level,
            language,
            instructor,
            status,
            time,
            pricing,
            description,
            createdBy,
            chapters
        } = req.body;


        // Validate input
        if (!title || !Array.isArray(chapters)) {
            return res.status(400).json({ error: "Title and chapters are required." });
        }

        const chapterIds = [];

        // Lưu từng chapter và lesson
        for (const ch of chapters) {
            const lessonIds = [];

            if (Array.isArray(ch.lessons)) {
                for (const lesson of ch.lessons) {
                    const newLesson = new Lesson(lesson);
                    await newLesson.save();
                    lessonIds.push(newLesson._id);
                }
            }

            const newChapter = new Chapter({
                title: ch.title,
                lessons: lessonIds
            });

            await newChapter.save();
            chapterIds.push(newChapter._id);
        }
        let imageUrl = req.files?.["imageUrl"] ? req.files["imageUrl"][0].path : null;
        let videoUrl = req.files?.["videoUrl"] ? req.files["videoUrl"][0].path : null;
        // Tạo khóa học
        const newCourse = new Course({
            title,
            category,
            level,
            language,
            instructor,
            status,
            time,
            media: { imageUrl, videoUrl },
            pricing,
            createdBy: {
                account_id: createdBy.account_id,
                createdAt: Date.now()
            },
            description,
            chapters: chapterIds
        });

        await newCourse.save();

        // Populate để trả về dữ liệu đầy đủ
        const populatedCourse = await Course.findById(newCourse._id)
            .populate({
                path: 'chapters',
                populate: { path: 'lessons' }
            });

        res.status(201).json({
            message: 'Khóa học tạo thành công!',
            course: populatedCourse
        });

    } catch (error) {
        console.error(' Error creating course:', error);
        res.status(500).json({ error: error.message });
    }
};
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate({
                path: 'chapters',
                populate: { path: 'lessons' }
            });
        res.status(200).json(courses);
    } catch (error) {
        console.error(' Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
};
const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId)
            .populate({
                path: 'chapters',
                populate: { path: 'lessons' }
            });
        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: error.message });
    }
};
const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const updateData = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
            .populate({
                path: 'chapters',
                populate: { path: 'lessons' }
            });

        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json({
            message: 'Course updated successfully',
            course: updatedCourse
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: error.message });
    }
};
const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const deletedCourse = await Course.findByIdAndUpdate(courseId, { deleted: true }, { new: true });
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
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
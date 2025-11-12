const Lesson = require('../../models/admin/lesson');
const Chapter = require('../../models/admin/chapter');
const Course = require('../../models/admin/course');

const createCourse = async (req, res) => {
    try {
        // Lấy dữ liệu từ req.body
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
        } = req.body;

        if (!title) return res.status(400).json({ error: "Title is required." });

        // Parse chapters: frontend gửi mảng ID dạng JSON string
        let chapters = req.body.chapters;
        if (!chapters) return res.status(400).json({ error: "Chapters are required." });
        if (typeof chapters === "string") chapters = JSON.parse(chapters); // JSON string -> array
        if (!Array.isArray(chapters) || chapters.length === 0)
            return res.status(400).json({ error: "Chapters must be a non-empty array of IDs." });

        // Xử lý file upload
        const imageUrl = req.files?.["imageUrl"] ? req.files["imageUrl"][0].path : null;
        const videoUrl = req.files?.["videoUrl"] ? req.files["videoUrl"][0].path : null;

        // Tạo course
        const newCourse = new Course({
            title,
            category,
            level,
            language,
            instructor,
            status,
            time: time ? JSON.parse(time) : {},     // nếu frontend gửi object stringified
            pricing: pricing ? JSON.parse(pricing) : {},
            description,
            media: { imageUrl, videoUrl },
            chapters,                               // chỉ là mảng ObjectId
            createdBy: { account_id: req.userId, createdAt: new Date() }
        });

        await newCourse.save();

        // Populate để trả về thông tin đầy đủ
        const populated = await Course.findById(newCourse._id)
            .populate({ path: 'chapters', populate: { path: 'lessons' } });

        res.status(201).json({ message: 'Course created successfully', course: populated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ deleted: false })
            .populate({ path: 'chapters', populate: { path: 'lessons' } });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate({ path: 'chapters', populate: { path: 'lessons' } });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course || course.deleted)
            return res.status(404).json({ error: "Course not found" });

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
            chapters
        } = req.body;

        // Cập nhật các field nếu có, giữ giá trị cũ nếu không có
        course.title = title || course.title;
        course.category = category || course.category;
        course.level = level || course.level;
        course.language = language || course.language;
        course.instructor = instructor || course.instructor;
        course.status = status || course.status;
        course.description = description || course.description;

        // time và pricing có thể là object stringified
        course.time = time ? JSON.parse(time) : course.time;
        course.pricing = pricing ? JSON.parse(pricing) : course.pricing;

        // chapters nếu gửi mảng mới
        if (chapters) {
            course.chapters = typeof chapters === "string" ? JSON.parse(chapters) : chapters;
        }

        // Media
        if (req.files?.imageUrl) course.media.imageUrl = req.files.imageUrl[0].path;
        if (req.files?.videoUrl) course.media.videoUrl = req.files.videoUrl[0].path;

        // Lưu thông tin người update
        course.updatedBy = { account_id: req.userId, updateAt: new Date() };

        await course.save();

        // Populate để trả về đầy đủ info
        const populated = await Course.findById(course._id)
            .populate({ path: 'chapters', populate: { path: 'lessons' } });

        res.status(200).json({ message: "Course updated successfully", course: populated });

    } catch (error) {
        console.error(error);
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

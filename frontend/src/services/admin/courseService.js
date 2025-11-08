// services/admin/courseService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin/course';

const courseService = {
    createCourse: async (courseData) => {
        try {
            const formData = new FormData();

            // === CƠ BẢN ===
            formData.append('title', courseData.title.trim());
            formData.append('category', courseData.category || '');
            formData.append('level', courseData.level || '');
            formData.append('language', courseData.language || '');
            formData.append('instructor', courseData.instructor || '');
            formData.append('status', courseData.status || 'active');
            formData.append('description', courseData.description || '');

            // === PRICING → GỬI DƯỚI DẠNG OBJECT TRỰC TIẾP ===
            formData.append('pricing[price]', Number(courseData.pricing?.price) || 0);
            formData.append('pricing[discount]', Number(courseData.pricing?.discount) || 0);

            // === CREATED BY → GỬI DƯỚI DẠNG OBJECT TRỰC TIẾP ===
            formData.append('createdBy[account_id]', '672c9e90b8a2f4c04c4a13b2');
            formData.append('createdBy[createdAt]', new Date().toISOString());

            // === FILE ===
            if (courseData.imageFile) formData.append('imageUrl', courseData.imageFile);
            if (courseData.videoFile) formData.append('videoUrl', courseData.videoFile);

            // === CHƯƠNG + BÀI HỌC → GỬI DƯỚI DẠNG MẢNG TRỰC TIẾP ===
            courseData.chapters.forEach((ch, chIndex) => {
                formData.append(`chapters[${chIndex}][title]`, ch.title);
                ch.lessons.forEach((les, lesIndex) => {
                    formData.append(`chapters[${chIndex}][lessons][${lesIndex}][title]`, les.title);
                    if (les.videoFile) {
                        formData.append(`lessonVideo_${chIndex}_${lesIndex}`, les.videoFile);
                    }
                });
            });

            const res = await axios.post(API_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return res.data;
        } catch (error) {
            const err = error.response?.data || error;
            console.error('Create Course Error:', err);
            throw err;
        }
    },

    getCourses: async () => {
        try {
            const res = await axios.get(API_URL);
            return res.data;
        } catch (error) {
            console.error('Get Courses Error:', error);
            throw error;
        }
    },


    getCourseById: async (id) => {
        try {
            const res = await axios.get(`${API_URL}/${id}`);
            console.log("Response getCourseById:", res.data); // DEBUG
            return res.data;
        } catch (error) {
            console.error("getCourseById error:", error.response || error);
            throw error;
        }
    },


    updateCourse: async (id, formData) => {
        try {
            const res = await axios.put(`${API_URL}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (error) {
            console.error("Update Course Error:", error.response?.data || error);
            throw error;
        }
    },

    softDeleteCourse: async (id, courses, setCourses) => {
        // Xóa khỏi state courses trực tiếp
        setCourses(courses.filter(course => course._id !== id));
        return { message: "Khóa học đã bị xóa mềm trên UI" };
    }
};
export default courseService;
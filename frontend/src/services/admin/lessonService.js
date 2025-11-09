// services/lessonService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin/lessons';

const lessonService = {
    // 1. Tạo lesson (chỉ title + preview)
    createLesson: async (title, chapterId, preview = false) => {
        const res = await axios.post(API_URL, { title, chapterId, preview });
        return res.data.lesson; // { _id, title, ... }
    },


    // 2. Upload video cho lesson
    uploadVideoForLesson: async (lessonId, videoFile) => {
        const formData = new FormData();
        formData.append('videoUrl', videoFile); // đúng với BE
        const res = await axios.post(`${API_URL}/${lessonId}/uploadVideo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.lesson; // phải có videoUrl từ BE
    },

    //Lấy danh sách lesson
    getLessons: async () => {
        const res = await axios.get(API_URL);
        return res.data;
    },

    //Cập nhật lesson (có thể bao gồm video)
    updateLesson: async (id, data) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key !== 'videoUrl') formData.append(key, data[key]); // ĐỔI TỪ 'lessonVideo' → 'videoUrl'
        });

        if (data.videoUrl) formData.append('videoUrl', data.videoUrl); // ĐỔI TỪ 'lessonVideo' → 'videoUrl'

        const res = await axios.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data.lesson;
    },
    //Xóa lesson theo ID
    deleteLesson: async (id) => {
        const res = await axios.delete(`${API_URL}/${id}`);
        return res.data;
    }
};

export default lessonService;

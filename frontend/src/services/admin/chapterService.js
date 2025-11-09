// services/chapterService.js
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/admin/chapters';

const chapterService = {
    createChapter: async (data) => {
        const res = await axios.post(API_URL, data);
        return res.data;
    },
    getChapters: async () => {
        const res = await axios.get(API_URL);
        return res.data;
    },
    // THÊM: Cập nhật chapter
    updateChapter: async (id, data) => {
        const res = await axios.put(`${API_URL}/${id}`, data);
        return res.data;
    },

    // THÊM: Xóa chapter
    deleteChapter: async (id) => {
        const res = await axios.delete(`${API_URL}/${id}`);
        return res.data;
    }
};

export default chapterService;
// services/courseService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin/course';

const courseService = {
    createCourse: async (formData) => {
        const res = await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },

    getCourses: async () => {
        const res = await axios.get(API_URL);
        return res.data;
    },

    getCourseById: async (id) => {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    },

    updateCourse: async (id, payload) => {
        const res = await axios.put(`${API_URL}/${id}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    }
};

export default courseService;
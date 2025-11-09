import axios from "axios";

const API_URL = "http://localhost:3000/api/admin/lessons";

const lessonAPI = {
    getAll: () => axios.get(API_URL),
    getById: (id) => axios.get(`${API_URL}/${id}`),
    create: (formData) =>
        axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    uploadVideo: (id, formData) =>
        axios.post(`${API_URL}/${id}/uploadVideo`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, formData) =>
        axios.put(`${API_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (id) => axios.delete(`${API_URL}/${id}`),
};

export default lessonAPI;

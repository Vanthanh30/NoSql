import axios from "axios";
import userService from "./userService";
const API_URL = "http://localhost:3000/api/admin/course";

const courseAPI = {
    getAll: () => {
        const token = userService.getToken();
        return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    },
    getById: (id) => {
        const token = userService.getToken();
        return axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    },
    create: (formData) => {
        const token = userService.getToken();
        return axios.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
    },
    update: (id, formData) => {
        const token = userService.getToken();
        return axios.put(`${API_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
    },
    updateJSON: (id, data) => {
        const token = userService.getToken();
        return axios.put(`${API_URL}/${id}`, data, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
    },
    delete: (id) => {
        const token = userService.getToken();
        return axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    },
};

export default courseAPI;
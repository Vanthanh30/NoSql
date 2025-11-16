// src/services/admin/accountService.js
import axios from "axios";
import userService from "./userService"; // Import để lấy token

const BASE_URL = "http://localhost:3000/api/admin/accounts";

// Tạo axios instance với interceptor
const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = userService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const accountService = {
    createAccount: (data) =>
        api.post("", data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    getAccounts: async () => {
        try {
            const res = await api.get("");
            let data = [];

            if (Array.isArray(res.data)) {
                data = res.data;
            } else if (res.data && Array.isArray(res.data.accounts)) {
                data = res.data.accounts;
            }
            return data.filter((acc) => !acc.deleted);
        } catch (err) {
            console.error("Lỗi getAccounts:", err);
            return [];
        }
    },

    getAccountById: (id) => api.get(`/${id}`),

    updateAccount: (id, data) =>
        api.put(`/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    deleteAccount: (id) => api.delete(`/${id}`),
};

export default accountService;
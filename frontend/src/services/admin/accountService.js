// services/admin/accountService.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/admin/accounts";

const accountService = {
    createAccount: (data) =>
        axios.post(BASE_URL, data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // SỬA: Xử lý cả mảng trực tiếp HOẶC { accounts: [...] }
    getAccounts: async () => {
        try {
            const res = await axios.get(BASE_URL);
            let data = [];

            if (Array.isArray(res.data)) {
                data = res.data;
            } else if (res.data && Array.isArray(res.data.accounts)) {
                data = res.data.accounts;
            }

            // LỌC NHỮNG TÀI KHOẢN CHƯA BỊ XÓA
            return data.filter(acc => !acc.deleted);
        } catch (err) {
            console.error("Lỗi getAccounts:", err);
            return [];
        }
    },

    getAccountById: (id) => axios.get(`${BASE_URL}/${id}`),

    updateAccount: (id, data) =>
        axios.put(`${BASE_URL}/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    deleteAccount: (id) => axios.delete(`${BASE_URL}/${id}`),
};

export default accountService;
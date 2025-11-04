import axios from "axios";

const BASE_URL = "http://localhost:3000/api/admin/auth";

const userService = {
    login: async (email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}/login`, { email, password });
            return res.data;
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                throw new Error(err.response.data.message);
            }
            throw new Error("Lỗi kết nối máy chủ!");
        }
    },

    logout: () => {
        localStorage.removeItem("account");
    },

    getCurrentUser: () => {
        const user = localStorage.getItem("account");
        return user ? JSON.parse(user) : null;
    },
};

export default userService;
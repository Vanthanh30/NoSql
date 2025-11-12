import axios from "axios";

const BASE_URL = "http://localhost:3000/api/admin/auth";

const userService = {
    login: async (email, password) => {
        const res = await axios.post(`${BASE_URL}/login`, { email, password });
        if (res.data.token) {
            localStorage.setItem("token", res.data.token);
        }
        return res.data;
    },
    logout: () => {
        localStorage.removeItem("token");
    },
    getToken: () => localStorage.getItem("token")
};

export default userService;

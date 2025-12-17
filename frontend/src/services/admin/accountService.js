// src/services/admin/accountService.js
import axios from "axios";
import userService from "./userService"; // Import để lấy token

const ADMIN_ACCOUNTS_URL = "http://localhost:3000/api/admin/accounts";
const USER_ACCOUNTS_URL = "http://localhost:3000/api/client/user";

// Tạo axios instance với interceptor
const createApiInstance = (baseURL) => {
    const api = axios.create({ baseURL });

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

    return api;
};

const adminApi = createApiInstance(ADMIN_ACCOUNTS_URL);
const userApi = createApiInstance(USER_ACCOUNTS_URL);

const accountService = {
    // Tạo tài khoản
    createAccount: (data) =>
        adminApi.post("", data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    // ========================================
    // HÀM MỚI: LẤY ADMIN ACCOUNTS
    // ========================================
    getAdminAccounts: async () => {
        try {
            const response = await adminApi.get("");
            const data = response.data;

            let accounts = [];
            if (Array.isArray(data)) {
                accounts = data;
            } else if (data && Array.isArray(data.accounts)) {
                accounts = data.accounts;
            }

            // Lọc bỏ tài khoản đã xóa và chỉ lấy role Admin
            return accounts.filter(
                (acc) => !acc.deleted && acc.role_Id?.toLowerCase() === 'admin'
            );
        } catch (err) {
            console.error("Lỗi getAdminAccounts:", err);
            return [];
        }
    },

    // ========================================
    // HÀM MỚI: LẤY USER ACCOUNTS
    // ========================================
    getUserAccounts: async () => {
        try {
            const response = await userApi.get("/all");
            const data = response.data;

            let accounts = [];
            if (Array.isArray(data)) {
                accounts = data;
            } else if (data && Array.isArray(data.users)) {
                accounts = data.users;
            } else if (data && Array.isArray(data.accounts)) {
                accounts = data.accounts;
            }

            // Lọc bỏ tài khoản đã xóa và chỉ lấy role User
            return accounts.filter(
                (acc) => !acc.deleted &&
                    (!acc.role_Id || acc.role_Id?.toLowerCase() === 'user')
            );
        } catch (err) {
            console.error("Lỗi getUserAccounts:", err);
            return [];
        }
    },

    // ========================================
    // HÀM GỘP: LẤY TẤT CẢ ACCOUNTS (dùng 2 hàm trên)
    // ========================================
    getAccounts: async () => {
        try {
            // Gọi song song 2 hàm
            const [adminAccounts, userAccounts] = await Promise.all([
                accountService.getAdminAccounts(),
                accountService.getUserAccounts()
            ]);

            // Gộp 2 mảng lại
            return [...adminAccounts, ...userAccounts];
        } catch (err) {
            console.error("Lỗi getAccounts:", err);
            return [];
        }
    },

    // Lấy account theo ID (thử cả 2 API)
    getAccountById: async (id) => {
        try {
            // Thử admin API trước
            return await adminApi.get(`/${id}`);
        } catch (adminErr) {
            // Nếu không có trong admin, thử user API
            try {
                return await userApi.get(`/${id}`);
            } catch (userErr) {
                throw new Error("Không tìm thấy tài khoản");
            }
        }
    },

    // Cập nhật account (tự động chọn API dựa vào role)
    updateAccount: async (id, data) => {
        try {
            // Lấy thông tin account để biết role
            const accountInfo = await accountService.getAccountById(id);
            const role = accountInfo.data?.account?.role_Id || accountInfo.data?.role_Id;

            // Chọn API phù hợp
            const api = role?.toLowerCase() === 'admin' ? adminApi : userApi;

            return await api.put(`/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (err) {
            console.error("Lỗi updateAccount:", err);
            throw err;
        }
    },

    // Xóa account (tự động chọn API dựa vào role)
    deleteAccount: async (id) => {
        try {
            // Lấy thông tin account để biết role
            const accountInfo = await accountService.getAccountById(id);
            const role = accountInfo.data?.account?.role_Id || accountInfo.data?.role_Id;

            // Chọn API phù hợp
            const api = role?.toLowerCase() === 'admin' ? adminApi : userApi;

            return await api.delete(`/${id}`);
        } catch (err) {
            console.error("Lỗi deleteAccount:", err);
            throw err;
        }
    },
    deleteUserAccount: async (id) => {
        try {
            const response = await userApi.delete(`/${id}`);
            return response;
        } catch (err) {
            console.error("Lỗi deleteUserAccount:", err);

            if (err.response?.data?.error) {
                throw new Error(err.response.data.error);
            }
            throw new Error("Không thể xóa tài khoản User. Vui lòng thử lại!");
        }
    },
};

export default accountService;
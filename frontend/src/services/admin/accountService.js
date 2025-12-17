import axios from "axios";
import userService from "./userService";

const ADMIN_ACCOUNTS_URL = "http://localhost:3000/api/admin/accounts";
const USER_ACCOUNTS_URL = "http://localhost:3000/api/client/user";


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

    createAccount: (data) =>
        adminApi.post("", data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),


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

            return accounts.filter(
                (acc) => !acc.deleted && acc.role_Id?.toLowerCase() === 'admin'
            );
        } catch (err) {
            console.error("Lỗi getAdminAccounts:", err);
            return [];
        }
    },


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

            return accounts.filter(
                (acc) => !acc.deleted &&
                    (!acc.role_Id || acc.role_Id?.toLowerCase() === 'user')
            );
        } catch (err) {
            console.error("Lỗi getUserAccounts:", err);
            return [];
        }
    },


    getAccounts: async () => {
        try {

            const [adminAccounts, userAccounts] = await Promise.all([
                accountService.getAdminAccounts(),
                accountService.getUserAccounts()
            ]);


            return [...adminAccounts, ...userAccounts];
        } catch (err) {
            console.error("Lỗi getAccounts:", err);
            return [];
        }
    },


    getAccountById: async (id) => {
        try {

            return await adminApi.get(`/${id}`);
        } catch (adminErr) {

            try {
                return await userApi.get(`/${id}`);
            } catch (userErr) {
                throw new Error("Không tìm thấy tài khoản");
            }
        }
    },


    updateAccount: async (id, data) => {
        try {

            const accountInfo = await accountService.getAccountById(id);
            const role = accountInfo.data?.account?.role_Id || accountInfo.data?.role_Id;

            const api = role?.toLowerCase() === 'admin' ? adminApi : userApi;

            return await api.put(`/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (err) {
            console.error("Lỗi updateAccount:", err);
            throw err;
        }
    },


    deleteAccount: async (id) => {
        try {

            const accountInfo = await accountService.getAccountById(id);
            const role = accountInfo.data?.account?.role_Id || accountInfo.data?.role_Id;

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

import axios from "axios";

const API_URL = "http://localhost:3000/api/admin/article";

const articleAPI = {
  getAll: () => axios.get(API_URL),
  getById: (id) => axios.get(`${API_URL}/${id}`),
  create: (formData) => {
    return axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id, formData) => {
    return axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id) => axios.delete(`${API_URL}/${id}`),
};

export default articleAPI;

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/admin/article";

const articleService = {
  getAllArticles: async () => {
    try {
      const response = await axios.get(API_BASE_URL);

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      throw error;
    }
  },

  getArticleById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tải bài viết ${id}:`, error);
      throw error;
    }
  },
};

export default articleService;

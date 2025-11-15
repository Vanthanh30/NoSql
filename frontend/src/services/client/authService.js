const API_BASE_URL = "http://localhost:3000/api/client/user";

const authService = {
  async registerUser(email, password, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const text = await response.text();

        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || "Registration failed");
        } catch (e) {
          throw new Error(
            `Server error (${response.status}): ${text.substring(0, 100)}`
          );
        }
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async loginUser(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const text = await response.text();

        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || "Login failed");
        } catch (e) {
          throw new Error(
            `Server error (${response.status}): ${text.substring(0, 100)}`
          );
        }
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async logoutUser() {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {}

    localStorage.removeItem("authToken");
    return { success: true };
  },

  getToken() {
    return localStorage.getItem("authToken");
  },

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },
};

export default authService;

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
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        window.dispatchEvent(new Event('authChange'));
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('authChange'));

    return { success: true };
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token && token !== "null" && token !== "undefined";
  },

  getUser() {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
};

export default authService;
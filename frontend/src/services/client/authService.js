const API_BASE_URL = "http://localhost:3000/api/client/user";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

function markSessionActive() {
  sessionStorage.setItem("sessionActive", "true");
}

function isNewSession() {
  return !sessionStorage.getItem("sessionActive");
}

function checkAndClearIfNewSession() {
  if (isNewSession()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("Session mới phát hiện, đã xóa token");
  }
  markSessionActive();
}

const authService = {
  init() {
    checkAndClearIfNewSession();

    window.addEventListener("beforeunload", () => {});
  },

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
        markSessionActive();
        window.dispatchEvent(new Event("authChange"));
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getUserProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { success: false, error: "Unauthorized" };

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();

      if (data.user) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, ...data.user })
        );
      }

      return { success: true, data: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateUserProfile(userData) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { success: false, error: "Unauthorized" };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (!(userData instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        userData = JSON.stringify(userData);
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: headers,
        body: userData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server Error: ${text}`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChange"));
      }

      return { success: true, data: data.user };
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
    sessionStorage.removeItem("sessionActive");
    window.dispatchEvent(new Event("authChange"));

    return { success: true };
  },

  getToken() {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      console.log("Token đã hết hạn, tự động logout");
      this.logoutUser();
      return null;
    }

    return token;
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      return false;
    }

    if (isTokenExpired(token)) {
      console.log("Token đã hết hạn");
      this.logoutUser();
      return false;
    }

    return true;
  },

  getUser() {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },
};

authService.init();

export default authService;

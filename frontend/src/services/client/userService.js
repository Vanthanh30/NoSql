const API_BASE_URL = "http://localhost:3000/api/client/user";

const userService = {
    async getUserProfile() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return {
                    success: false,
                    error: "Unauthorized",
                };
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    return {
                        success: false,
                        error: "Unauthorized",
                    };
                }

                const text = await response.text();

                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.error || "Failed to fetch user profile");
                } catch (e) {
                    throw new Error(
                        `Server error (${response.status}): ${text.substring(0, 100)}`
                    );
                }
            }

            const data = await response.json();

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            return { success: true, data: data.user || data };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    async updateUserProfile(userData) {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return {
                    success: false,
                    error: "Unauthorized",
                };
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const text = await response.text();

                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.error || "Failed to update profile");
                } catch (e) {
                    throw new Error(
                        `Server error (${response.status}): ${text.substring(0, 100)}`
                    );
                }
            }

            const data = await response.json();

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                window.dispatchEvent(new Event("authChange"));
            }

            return { success: true, data: data.user || data };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    async changePassword(currentPassword, newPassword) {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return {
                    success: false,
                    error: "Unauthorized",
                };
            }

            const response = await fetch(`${API_BASE_URL}/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                const text = await response.text();

                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.error || "Failed to change password");
                } catch (e) {
                    throw new Error(
                        `Server error (${response.status}): ${text.substring(0, 100)}`
                    );
                }
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    async uploadAvatar(file) {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return {
                    success: false,
                    error: "Unauthorized",
                };
            }

            const formData = new FormData();
            formData.append("avatar", file);

            const response = await fetch(`${API_BASE_URL}/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const text = await response.text();

                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.error || "Failed to upload avatar");
                } catch (e) {
                    throw new Error(
                        `Server error (${response.status}): ${text.substring(0, 100)}`
                    );
                }
            }

            const data = await response.json();

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                window.dispatchEvent(new Event("authChange"));
            }

            return { success: true, data: data.avatarUrl || data };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    getUser() {
        try {
            const userString = localStorage.getItem("user");
            return userString ? JSON.parse(userString) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    },
};

export default userService;
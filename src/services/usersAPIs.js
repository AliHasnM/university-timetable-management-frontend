import axios from "../utils/axiosInstance";

const registerUser = async (userData) => {
  try {
    const response = await axios.post("/users/register", userData);
    const { accessToken, user } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "Registration failed:",
      error?.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error?.response?.data?.message || "Registration failed",
    };
  }
};

const loginUser = async (credentials) => {
  try {
    const response = await axios.post("/users/login", credentials, {
      withCredentials: true, // Important for cookie-based refresh tokens
    });

    const { accessToken, user } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "Login failed:",
      error?.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
    };
  }
};

const getUserProfile = async () => {
  try {
    const response = await axios.get("/users/profile");
    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "Get profile failed:",
      error?.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch profile",
    };
  }
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
};

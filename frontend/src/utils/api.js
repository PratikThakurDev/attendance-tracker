import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

export const signup = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/signup`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Signup failed" };
  }
};

export const login = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { error: "Login failed" };
  }
};

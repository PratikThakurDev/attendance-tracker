import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

let token = null;

export const setAuthToken = (t) => {
  token = t;
};

const getHeaders = () => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

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

export const fetchSubjects = async (userId) => {
  const { data } = await axios.get(`${API_BASE}/subjects/${userId}`, getHeaders());
  return data;
};

export const addSubject = async (userId, subjectName) => {
  const { data } = await axios.post(
    `${API_BASE}/subjects`,
    { user_id: userId, subject_name: subjectName },
    getHeaders()
  );
  return data;
};

export const fetchAttendanceBySubject = async (subjectId) => {
  const { data } = await axios.get(`${API_BASE}/attendance/${subjectId}`, getHeaders());
  return data;
};

export const fetchSummary = async (userId) => {
  const { data } = await axios.get(`${API_BASE}/attendance/summary/${userId}`, getHeaders());
  return data;
};

export const markAttendance = async (student_id, subject_id, status, date) => {
  const { data } = await axios.post(
    `${API_BASE}/attendance`,
    { student_id, subject_id, status, date },
    getHeaders()
  );
  return data;
};

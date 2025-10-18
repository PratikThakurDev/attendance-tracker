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

export const updateSubject = async (subjectId, subjectData) => {
  const { data } = await axios.put(
    `${API_BASE}/subjects/${subjectId}`,
    subjectData,
    getHeaders()
  );
  return data;
};

export const deleteSubject = async (subjectId) => {
  const { data } = await axios.delete(
    `${API_BASE}/subjects/${subjectId}`,
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

export const fetchDashboardSummary = async (userId) => {
  const { data } = await axios.get(
    `${API_BASE}/attendance/dashboard-summary/${userId}`,
    getHeaders()
  );
  return data;
};

export const fetchDailyAttendance = async (userId) => {
  const { data } = await axios.get(
    `${API_BASE}/attendance/daily/${userId}`,
    getHeaders()
  );
  return data;
};

export const fetchTimetable = async (userId) => {
  const { data } = await axios.get(`${API_BASE}/timetable/${userId}`, getHeaders());
  return data;
};

export const saveTimetable = async (userId, timetable) => {
  const { data } = await axios.post(
    `${API_BASE}/timetable/${userId}`,
    { timetable },
    getHeaders()
  );
  return data;
};

export const clearTimetable = async (userId) => {
  const { data } = await axios.delete(
    `${API_BASE}/timetable/${userId}`,
    getHeaders()
  );
  return data;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const { data } = await axios.put(
    `${API_BASE}/user/change-password/${userId}`,
    { currentPassword, newPassword },
    getHeaders()
  );
  return data;
};

export const deleteAccount = async (userId, password) => {
  const { data } = await axios.delete(
    `${API_BASE}/user/delete-account/${userId}`,
    {
      data: { password },
      ...getHeaders(),
    }
  );
  return data;
};

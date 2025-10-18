import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { User, Mail, Calendar, Lock, Trash2} from "lucide-react";
import { changePassword, deleteAccount} from "../utils/api";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    joinDate: "",
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setUserInfo({
          name: decoded.name || "User",
          email: decoded.email || "",
          joinDate: new Date(decoded.iat * 1000).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        });
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      alert("New passwords don't match!");
      return;
    }

    if (passwords.new.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await changePassword(userId, passwords.current, passwords.new);
      alert("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowChangePassword(false);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert("Please enter your password to confirm deletion");
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(userId, deletePassword);
      alert("Account deleted successfully");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      const blob = await exportAttendanceCSV(userId);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert("Attendance data exported successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#18181b] rounded-xl border border-[#1fd6c1]/30 p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#1fd6c1]/20 flex items-center justify-center">
            <User size={40} className="text-[#1fd6c1]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{userInfo.name}</h2>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span>{userInfo.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Joined {userInfo.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#18181b] rounded-xl border border-[#1fd6c1]/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
        
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="flex items-center gap-2 text-white hover:text-[#1fd6c1] transition-colors"
            >
              <Lock size={18} />
              <span>Change Password</span>
            </button>
            
            {showChangePassword && (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#0e1117] border border-gray-600 text-white"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#0e1117] border border-gray-600 text-white"
                  required
                  minLength={6}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#0e1117] border border-gray-600 text-white"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#1fd6c1] text-black rounded-lg hover:bg-[#17b9a9] font-semibold disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
              <span>Delete Account</span>
            </button>
            <p className="text-sm text-gray-400 mt-1 ml-6">
              Permanently delete your account and all data
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg p-6 max-w-md w-full border border-red-600/50">
            <h2 className="text-xl font-semibold mb-3 text-white">Delete Account</h2>
            <p className="text-gray-400 mb-4">
              This action cannot be undone. All your data including subjects, attendance records, and timetable will be permanently deleted.
            </p>
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full p-2 mb-4 rounded-lg bg-[#0e1117] border border-gray-600 text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 text-white"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#18181b] rounded-xl border border-[#1fd6c1]/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">About AttendEase</h3>
        <p className="text-gray-400 text-sm">
          Version 1.0.0 • Built with React & Node.js
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;

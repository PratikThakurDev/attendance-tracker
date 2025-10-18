import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { User, Mail, Calendar, Lock, Trash2, Download } from "lucide-react";

function ProfilePage() {
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
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
    // TODO: Implement change password API call
    alert("Password change functionality coming soon!");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
      )
    ) {
      // TODO: Implement delete account API call
      alert("Delete account functionality coming soon!");
    }
  };

  const handleExportData = () => {
    // TODO: Implement data export
    alert("Export data functionality coming soon!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
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

      {/* Account Settings */}
      <div className="bg-[#18181b] rounded-xl border border-[#1fd6c1]/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
        
        <div className="space-y-4">
          {/* Change Password */}
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
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#0e1117] border border-gray-600 text-white"
                  required
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
                  className="px-4 py-2 bg-[#1fd6c1] text-black rounded-lg hover:bg-[#17b9a9] font-semibold"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>

          {/* Export Data */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 text-white hover:text-[#1fd6c1] transition-colors"
            >
              <Download size={18} />
              <span>Export My Data</span>
            </button>
            <p className="text-sm text-gray-400 mt-1 ml-6">
              Download all your attendance data as CSV
            </p>
          </div>

          {/* Delete Account */}
          <div>
            <button
              onClick={handleDeleteAccount}
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

      {/* App Info */}
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

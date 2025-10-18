import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({ currentPage, setCurrentPage }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Add Subject", key: "addSubject" },
    { name: "Edit Subject", key: "editSubject" },
    { name: "Edit Timetable", key: "timeTable" },
    { name: "Profile", key: "profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <aside className="w-64 bg-[#151d23] p-5 flex flex-col justify-between border-r border-gray-800 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-[#1fd6c1] mb-8">AttendEase</h1>
          <ul className="space-y-4 text-gray-300">
            {menu.map((item) => (
              <li
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`cursor-pointer transition px-2 py-1 rounded ${
                  currentPage === item.key
                    ? "bg-[#1fd6c1]/20 text-[#1fd6c1]"
                    : "hover:text-[#1fd6c1]"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#18181b] rounded-lg p-6 max-w-sm w-full border border-[#1fd6c1]/30">
            <h2 className="text-xl font-semibold mb-3 text-white">
              Confirm Logout
            </h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;

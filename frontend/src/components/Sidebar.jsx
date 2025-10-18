import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({ currentPage, setCurrentPage }) {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Edit TimeTable", key: "timeTable" },
    { name: "Edit Subject", key: "editSubject" },
    { name: "Profile", key: "profile" },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
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
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}

export default Sidebar;

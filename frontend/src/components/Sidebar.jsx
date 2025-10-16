import React from "react";
import { LogOut } from "lucide-react";

function Sidebar({ currentPage, setCurrentPage }) {
  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Attendance Calendar", key: "calendar" },
    { name: "Classes Attended Graph", key: "graph" },
    { name: "Add subjects", key: "canceled" },
    { name: "Logs", key: "logs" },
    { name: "Settings", key: "settings" },
  ];

  return (
    <aside className="w-64 bg-[#151d23] p-5 flex flex-col justify-between border-r border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-[#1fd6c1] mb-8">AttendEase</h1>
        <ul className="space-y-4 text-gray-300">
          {menu.map((item) => (
            <li
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`cursor-pointer transition px-2 py-1 rounded ${
                currentPage === item.key ? "bg-[#1fd6c1]/20 text-[#1fd6c1]" : "hover:text-[#1fd6c1]"
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <button className="flex items-center gap-2 text-red-400 hover:text-red-500">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}

export default Sidebar;

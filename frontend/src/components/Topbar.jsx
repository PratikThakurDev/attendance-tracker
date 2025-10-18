import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { User, Calendar } from "lucide-react";

function TopBar() {
  const [username, setUsername] = useState("User");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.name || "User");
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }

    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(date);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Welcome back, {username}! 👋
        </h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar size={16} />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#18181b] px-4 py-2 rounded-lg border border-[#1fd6c1]/30">
        <div className="w-10 h-10 rounded-full bg-[#1fd6c1]/20 flex items-center justify-center">
          <User size={20} className="text-[#1fd6c1]" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">{username}</p>
          <p className="text-xs text-gray-400">Student</p>
        </div>
      </div>
    </div>
  );
}

export default TopBar;

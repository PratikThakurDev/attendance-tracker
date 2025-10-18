import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { Calendar } from "lucide-react";

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
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(date);
  }, []);

  return (
    <div className="mb-6 pr-16 lg:pr-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        Welcome back, {username}! 👋
      </h2>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Calendar size={16} />
        <span>{currentDate}</span>
      </div>
    </div>
  );
}

export default TopBar;

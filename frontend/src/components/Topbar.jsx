import React from "react";

function TopBar({ username = "User", avatarUrl = "https://i.pravatar.cc/40" }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold">Welcome, {username} 👋</h2>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#1b1e25] text-gray-300 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1fd6c1]"
        />
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-[#1fd6c1]"
        />
      </div>
    </div>
  );
}

export default TopBar;

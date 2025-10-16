import React from "react";

function TopBar({ username = "User", avatarUrl = "https://i.pravatar.cc/40" }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold">Welcome, {username} 👋</h2>
    </div>
  );
}

export default TopBar;

import React from "react";

function Card({ title, value, subtitle }) {
  return (
    <div className="bg-[#18181b] p-4 rounded-xl border border-[#1fd6c1]/30 shadow-md">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-[#1fd6c1]">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

export default Card;

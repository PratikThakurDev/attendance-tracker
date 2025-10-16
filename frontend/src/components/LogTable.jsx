import React from "react";

function LogTable({ logs }) {
  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30">
      <h3 className="text-lg font-semibold mb-3">Recent Logs</h3>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="py-2">Date</th>
            <th>Classes Attended</th>
            <th>Classes Canceled</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr
              key={i}
              className="border-b border-gray-700 hover:bg-[#232d3f]/40 transition"
            >
              <td className="py-2">{log.date}</td>
              <td className="text-[#1fd6c1]">
                {log.classes.length > 0 ? log.classes.join(", ") : "-"}
              </td>
              <td className="text-red-400">{log.canceled}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogTable;

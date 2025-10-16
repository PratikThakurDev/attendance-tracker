import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ClassesAttendedChart({ data }) {
  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30">
      <h3 className="text-lg font-semibold mb-4">Classes Attended Graph</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="day" type='category' stroke="#888" />
          <YAxis label={{ value: "Classes", angle: -90, position: "insideLeft" }}
          allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="classesAttended"
            stroke="#1fd6c1"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ClassesAttendedChart;

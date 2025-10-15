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

// Example usage with default data
ClassesAttendedChart.defaultProps = {
  data: [
    { day: "1", classesAttended: 1 },
    { day: "2", classesAttended: 2 },
    { day: "3", classesAttended: 0 },
    { day: "4", classesAttended: 1 },
    { day: "5", classesAttended: 3 },
    { day: "6", classesAttended: 0 },
    { day: "7", classesAttended: 2 },
  ],
};

export default ClassesAttendedChart;

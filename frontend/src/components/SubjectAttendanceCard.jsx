import React from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

function SubjectAttendanceCard({ selectedSubject, allSubjects = [] }) {
  const subjectToShow = selectedSubject || allSubjects[0];

  if (!subjectToShow) {
    return (
      <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 text-center">
        <p>Select a subject to view attendance</p>
      </div>
    );
  }

  const { subject_name, present_count, total_classes } = subjectToShow;
  const percentage = total_classes
    ? ((present_count / total_classes) * 100).toFixed(1)
    : 0;

  const data = [{ name: "Attendance", value: Number(percentage) }];

  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 text-center">
      <h3 className="text-lg font-semibold mb-4">
        Attendance for {subject_name}
      </h3>

      <div className="relative flex justify-center items-center">
        <div style={{ width: 200, height: 200, position: "relative" }}>
          <ResponsiveContainer>
            <RadialBarChart
              innerRadius="80%"
              outerRadius="100%"
              barSize={12}
              data={data}
              startAngle={90}
              endAngle={450}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                tick={false}
                stroke="none"
              />
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
                fill="#1fd6c1"
                cornerRadius={50}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold"
            style={{ pointerEvents: "none" }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {present_count}/{total_classes} classes attended
      </p>
    </div>
  );
}

export default SubjectAttendanceCard;

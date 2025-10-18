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
        <p className="text-gray-400">Select a subject to view attendance</p>
      </div>
    );
  }

  const { subject_name, present_count = 0, total_classes = 0 } = subjectToShow;

  const percentage = total_classes > 0 
    ? ((present_count / total_classes) * 100).toFixed(1)
    : "0.0";

  const data = [{ name: "Attendance", value: parseFloat(percentage) }];

  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 text-center">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Attendance for {subject_name}
      </h3>

      {total_classes === 0 ? (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="w-24 h-24 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
            <span className="text-2xl text-gray-500">0%</span>
          </div>
          <p className="text-sm text-gray-400">No classes recorded yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Start marking attendance to see your progress
          </p>
        </div>
      ) : (
        <>
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-white"
                style={{ pointerEvents: "none" }}
              >
                {percentage}%
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            {present_count}/{total_classes} classes attended
          </p>
        </>
      )}
    </div>
  );
}

export default SubjectAttendanceCard;

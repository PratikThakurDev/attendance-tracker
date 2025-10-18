import React from "react";

function AllSubjectsAttendanceStatus({ summary, requiredPercent = 75 }) {
  if (!summary || summary.length === 0) {
    return (
      <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 text-center">
        No subjects available
      </div>
    );
  }

  const requiredRatio = requiredPercent / 100;

  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">
        Attendance Status (All Subjects)
      </h3>
      <ul className="list-disc list-inside space-y-2 text-sm text-[#1fd6c1]">
        {summary.map(({ subject_name, present_count, total_classes, id }) => {
          if (total_classes === 0) {
            return <li key={id}>{subject_name}: No class data available</li>;
          }
          const attendanceRatio = present_count / total_classes;
          if (attendanceRatio < requiredRatio) {
            const needed = Math.ceil(
              (requiredRatio * total_classes - present_count) /
                (1 - requiredRatio)
            );
            return (
              <li key={id}>
                {subject_name}: Need to attend next {needed} class
                {needed > 1 ? "es" : ""} to reach {requiredPercent}% attendance.
              </li>
            );
          } else {
            const canSkip = Math.floor(
              (present_count - requiredRatio * total_classes) / requiredRatio
            );
            if (canSkip <= 0) {
              return (
                <li key={id}>
                  {subject_name}: You currently have perfect attendance.
                </li>
              );
            }
            return (
              <li key={id}>
                {subject_name}: Can skip next {canSkip} class
                {canSkip > 1 ? "es" : ""} and still maintain {requiredPercent}%
                attendance.
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

export default AllSubjectsAttendanceStatus;

import React from "react";

function CalendarWidget({ attendanceLogs }) {
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);


  const dayStatus = {};
  attendanceLogs.forEach((log) => {
    const day = new Date(log.attendance_date).getDate();
    dayStatus[day] = log.status ? "present" : "absent";
  });

  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30">
      <h3 className="text-lg font-semibold mb-3">Attendance Calendar</h3>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {days.map((day) => {
          const isFuture = day > today.getDate();
          const status = dayStatus[day];

          let bgClass = "bg-[#232d3f] text-gray-400";
          if (isFuture) bgClass = "bg-gray-700 text-gray-500";
          else if (status === "present") bgClass = "bg-[#1fd6c1]/30 text-[#1fd6c1]";
          else if (status === "absent") bgClass = "bg-red-400/30 text-red-400";

          return (
            <div key={day} className={`p-2 rounded-lg ${bgClass}`}>
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span className="text-[#1fd6c1]">Present</span>
        <span className="text-red-400">Absent</span>
        <span className="text-gray-500">Future</span>
      </div>
    </div>
  );
}

export default CalendarWidget;

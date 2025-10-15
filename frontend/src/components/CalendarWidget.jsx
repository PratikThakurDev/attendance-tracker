import React from "react";

function CalendarWidget({ attendanceData }) {
  /**
   * attendanceData format:
   * {
   *   1: ["Math", "Physics"],
   *   2: ["English"],
   *   3: [],
   *   ...
   * }
   */
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30">
      <h3 className="text-lg font-semibold mb-3">Attendance Calendar</h3>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {days.map((day) => {
          const classes = attendanceData[day] || [];
          return (
            <div
              key={day}
              className={`p-2 rounded-lg ${
                classes.length > 0
                  ? "bg-[#1fd6c1]/30 text-[#1fd6c1]"
                  : "bg-[#232d3f] text-gray-400"
              }`}
              title={classes.length > 0 ? classes.join(", ") : "No classes attended"}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// default data
CalendarWidget.defaultProps = {
  attendanceData: {
    1: ["Math", "Physics"],
    2: ["English"],
    4: ["Chemistry", "Biology"],
    5: ["Math", "English"],
    7: ["Physics"],
    8: ["Math", "Biology"],
    10: ["Chemistry"],
    11: ["English", "Math"],
    14: ["Physics", "Biology"],
    15: ["Math", "Chemistry"],
    17: ["English"],
    18: ["Math", "Physics"],
    21: ["Biology"],
    23: ["Math", "Chemistry"],
    24: ["Physics"],
  },
};

export default CalendarWidget;

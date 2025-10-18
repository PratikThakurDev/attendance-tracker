import React from "react";

// Define timeslots
const times = [
  "8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"
];

// This format: one entry for each day with time/subject pairs
const timetable = {
  Monday: {
    "8-9": "SEC-I EP103 (LAB)",
    "9-10": "SEC-I EP103 (LAB)",
    "10-11": "",
    "11-12": "",
    "12-1": "EE105 (L)",
    "1-2": "",
    "2-3": "AM101 (L) SPS7",
    "3-4": "AM101 G1(T) SPS7",
    "4-5": "",
    "5-6": "AP101 (LAB)"
  },
  Tuesday: {
    "8-9": "",
    "9-10": "AEC/VAC",
    "10-11": "",
    "11-12": "AM101 (L)",
    "12-1": "",
    "1-2": "AC101 (L)",
    "2-3": "",
    "3-4": "",
    "4-5": "",
    "5-6": ""
  },
  Wednesday: {
    "8-9": "",
    "9-10": "AP101 (L)",
    "10-11": "EE105 (L)",
    "11-12": "",
    "12-1": "SEC-I (EP103) SPS08",
    "1-2": "",
    "2-3": "",
    "3-4": "",
    "4-5": "Zero Hour (No Classes)",
    "5-6": ""
  },
  Thursday: {
    "8-9": "",
    "9-10": "AEC/VAC",
    "10-11": "",
    "11-12": "",
    "12-1": "",
    "1-2": "",
    "2-3": "AC101 (LAB)",
    "3-4": "",
    "4-5": "",
    "5-6": ""
  },
  Friday: {
    "8-9": "EE105 (LAB)",
    "9-10": "",
    "10-11": "",
    "11-12": "AM101 G2(T) SPS7",
    "12-1": "AP101 (L)",
    "1-2": "AC101 (L)",
    "2-3": "",
    "3-4": "",
    "4-5": "",
    "5-6": ""
  }
};

function Timetable() {
  const days = Object.keys(timetable);

  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 overflow-auto">
      <h3 className="text-lg font-semibold mb-4">DTU Weekly Timetable</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-[#1fd6c1]/30 px-2 py-1 bg-[#232d3f]">Day</th>
            {times.map((time) => (
              <th key={time} className="border border-[#1fd6c1]/30 px-2 py-1 bg-[#232d3f]">
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="border border-[#1fd6c1]/30 px-2 py-1 font-medium bg-[#232d3f]">{day}</td>
              {times.map((time) => (
                <td key={time} className="border border-[#1fd6c1]/30 px-2 py-1 text-[#1fd6c1]">
                  {timetable[day][time] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;

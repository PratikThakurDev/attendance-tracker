import React, { useState, useEffect } from "react";
import { fetchTimetable } from "../utils/api";

// Define timeslots
const times = [
  "8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Timetable({ userId }) {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const loadTimetable = async () => {
      if (!userId) return;
      
      setLoading(true);
      
      // Initialize empty structure
      const emptyTimetable = {};
      days.forEach((day) => {
        emptyTimetable[day] = {};
        times.forEach((time) => {
          emptyTimetable[day][time] = "";
        });
      });

      try {
        const savedTimetable = await fetchTimetable(userId);
        
        // Check if timetable has any data
        let hasData = false;
        Object.keys(savedTimetable).forEach(day => {
          Object.keys(savedTimetable[day] || {}).forEach(time => {
            if (savedTimetable[day][time] && savedTimetable[day][time].trim() !== "") {
              hasData = true;
              emptyTimetable[day][time] = savedTimetable[day][time];
            }
          });
        });
        
        setIsEmpty(!hasData);
        setTimetable(emptyTimetable);
      } catch (err) {
        console.error("Failed to load timetable:", err);
        setTimetable(emptyTimetable);
        setIsEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    loadTimetable();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30">
        <h3 className="text-lg font-semibold mb-4">Weekly Timetable</h3>
        <p className="text-gray-400">Loading timetable...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 flex flex-col items-center justify-center min-h-[200px]">
        <h3 className="text-lg font-semibold mb-2">Weekly Timetable</h3>
        <p className="text-gray-400 text-center mb-4">
          No timetable created yet.
        </p>
        <p className="text-sm text-gray-500">
          Go to "Edit Timetable" from the sidebar to create your schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#18181b] p-5 rounded-xl border border-[#1fd6c1]/30 overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Weekly Timetable</h3>
      <table className="w-full border-collapse text-xs">
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
              <td className="border border-[#1fd6c1]/30 px-2 py-1 font-medium bg-[#232d3f]">
                {day}
              </td>
              {times.map((time) => (
                <td key={time} className="border border-[#1fd6c1]/30 px-2 py-1 text-[#1fd6c1]">
                  {timetable[day]?.[time] || "-"}
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

import React, { useState, useEffect } from "react";
import { fetchTimetable, saveTimetable, clearTimetable } from "../utils/api";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"];

function TimetableEditor({ userId, subjects }) {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadTimetable = async () => {
      if (!userId) return;
      
      setInitializing(true);
      const initialTimetable = {};
      daysOfWeek.forEach((day) => {
        initialTimetable[day] = {};
        timeSlots.forEach((time) => {
          initialTimetable[day][time] = "";
        });
      });
      
      try {
        const savedTimetable = await fetchTimetable(userId);
        Object.keys(initialTimetable).forEach(day => {
          Object.keys(initialTimetable[day]).forEach(time => {
            if (savedTimetable[day]?.[time]) {
              initialTimetable[day][time] = savedTimetable[day][time];
            }
          });
        });
        setTimetable(initialTimetable);
      } catch (err) {
        console.error("Failed to load timetable:", err);
        setTimetable(initialTimetable);
      } finally {
        setInitializing(false);
      }
    };
    
    loadTimetable();
  }, [userId]);

  const handleCellChange = (day, time, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveTimetable(userId, timetable);
      alert("Timetable saved successfully!");
      setEditMode(false);
    } catch (err) {
      alert("Failed to save timetable: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear entire timetable?")) return;
    
    setLoading(true);
    try {
      await clearTimetable(userId);
      const emptyTimetable = {};
      daysOfWeek.forEach((day) => {
        emptyTimetable[day] = {};
        timeSlots.forEach((time) => {
          emptyTimetable[day][time] = "";
        });
      });
      setTimetable(emptyTimetable);
      alert("Timetable cleared successfully!");
    } catch (err) {
      alert("Failed to clear timetable: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-64 text-white">
        Loading timetable...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[#18181b] rounded-t-xl border border-[#1fd6c1]/30 border-b-0 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Edit Timetable</h2>
            <p className="text-gray-400 text-sm">Manage your weekly class schedule</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-5 py-2.5 bg-[#1fd6c1] text-black rounded-lg hover:bg-[#17b9a9] font-semibold transition-colors"
              >
                Edit Timetable
              </button>
            ) : (
              <>
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="px-4 py-2.5 bg-red-600/10 border border-red-600 text-red-500 rounded-lg hover:bg-red-600/20 disabled:opacity-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  disabled={loading}
                  className="px-4 py-2.5 bg-gray-700/50 border border-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#1fd6c1] text-black rounded-lg hover:bg-[#17b9a9] font-semibold disabled:opacity-50 transition-colors"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#18181b] rounded-b-xl border border-[#1fd6c1]/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#232d3f]">
                <th className="sticky left-0 z-10 bg-[#232d3f] border-r border-[#1fd6c1]/30 px-4 py-3 text-left font-semibold text-white min-w-[120px]">
                  Day
                </th>
                {timeSlots.map((time) => (
                  <th key={time} className="border-r border-[#1fd6c1]/30 px-3 py-3 text-center font-medium text-gray-300 min-w-[140px]">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day, dayIndex) => (
                <tr key={day} className={dayIndex % 2 === 0 ? "bg-[#18181b]" : "bg-[#1a1d24]"}>
                  <td className="sticky left-0 z-10 border-r border-t border-[#1fd6c1]/30 px-4 py-3 font-medium text-white bg-[#232d3f]">
                    {day}
                  </td>
                  {timeSlots.map((time) => (
                    <td key={time} className="border-r border-t border-[#1fd6c1]/30 p-2">
                      {editMode ? (
                        <select
                          value={timetable[day]?.[time] || ""}
                          onChange={(e) => handleCellChange(day, time, e.target.value)}
                          className="w-full bg-[#0e1117] text-white border border-gray-600 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-[#1fd6c1] transition-colors"
                        >
                          <option value="">-- Free --</option>
                          {subjects.map((subject) => (
                            <option key={subject.id} value={subject.subject_name}>
                              {subject.subject_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="px-2 py-2 text-sm min-h-[40px] flex items-center">
                          {timetable[day]?.[time] ? (
                            <span className="text-[#1fd6c1] font-medium">
                              {timetable[day][time]}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TimetableEditor;

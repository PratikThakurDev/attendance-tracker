import React, { useState, useEffect } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["8-9", "9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"];

function TimetableEditor({ userId, subjects }) {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Initialize empty timetable
  useEffect(() => {
    const initialTimetable = {};
    daysOfWeek.forEach((day) => {
      initialTimetable[day] = {};
      timeSlots.forEach((time) => {
        initialTimetable[day][time] = "";
      });
    });
    
    // TODO: Load timetable from backend API
    // const savedTimetable = await fetchTimetable(userId);
    // setTimetable(savedTimetable || initialTimetable);
    
    setTimetable(initialTimetable);
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
      // TODO: Save timetable to backend
      // await saveTimetable(userId, timetable);
      alert("Timetable saved successfully!");
      setEditMode(false);
    } catch (err) {
      alert("Failed to save timetable: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (!window.confirm("Clear entire timetable?")) return;
    const emptyTimetable = {};
    daysOfWeek.forEach((day) => {
      emptyTimetable[day] = {};
      timeSlots.forEach((time) => {
        emptyTimetable[day][time] = "";
      });
    });
    setTimetable(emptyTimetable);
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Edit Timetable</h2>
        <div className="space-x-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-[#1fd6c1] text-black rounded hover:bg-[#17b9a9] font-semibold"
            >
              Edit Timetable
            </button>
          ) : (
            <>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear All
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-[#1fd6c1] text-black rounded hover:bg-[#17b9a9] font-semibold"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-[#1fd6c1]/30 px-2 py-2 bg-[#232d3f]">Day</th>
              {timeSlots.map((time) => (
                <th key={time} className="border border-[#1fd6c1]/30 px-2 py-2 bg-[#232d3f]">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day}>
                <td className="border border-[#1fd6c1]/30 px-2 py-2 font-medium bg-[#232d3f]">
                  {day}
                </td>
                {timeSlots.map((time) => (
                  <td key={time} className="border border-[#1fd6c1]/30 px-1 py-1">
                    {editMode ? (
                      <select
                        value={timetable[day]?.[time] || ""}
                        onChange={(e) => handleCellChange(day, time, e.target.value)}
                        className="w-full bg-[#0e1117] text-white border border-gray-600 rounded px-1 py-1 text-xs"
                      >
                        <option value="">-- Free --</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.subject_name}>
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[#1fd6c1]">
                        {timetable[day]?.[time] || "-"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimetableEditor;

import React, { useState } from "react";
import { markAttendance } from "../utils/api";

function MarkAttendanceModal({ isOpen, onClose, subjectId, userId, onSuccess }) {
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await markAttendance(userId, subjectId, status === "present", date);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.error || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      <div className="bg-black/90 p-6 rounded-xl w-96 border border-[#1fd6c1]/30">
        <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Date:</label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0e1117] border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0e1117] border border-gray-700"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#1fd6c1] text-black font-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : "Mark"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MarkAttendanceModal;

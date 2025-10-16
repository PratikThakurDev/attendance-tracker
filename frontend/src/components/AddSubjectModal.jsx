import React, { useState } from "react";

function AddSubjectModal({ isOpen, onClose, onSuccess }) {
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) return alert("Enter subject name");

    setLoading(true);
    try {
      // Replace with your API call
      await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject_name: subjectName }),
      });

      setSubjectName("");
      onClose();
      onSuccess();
    } catch (err) {
      console.error("Error adding subject:", err);
      alert("Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#0e1117] p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Subject name"
            className="w-full px-3 py-2 rounded bg-[#18181b] border border-gray-600 text-white"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[#1fd6c1] text-black font-semibold hover:bg-[#17b9a9]"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubjectModal;

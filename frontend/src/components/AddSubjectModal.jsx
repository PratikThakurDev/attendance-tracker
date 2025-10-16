import React, { useState, useEffect, useRef } from "react";
import { addSubject } from "../utils/api";

function AddSubjectModal({ isOpen, onClose, userId, onSuccess }) {
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setError("Subject name cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      const newSubject = await addSubject(userId, subjectName.trim());
      onSuccess(newSubject);
      setSubjectName("");
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-[#18181b] p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add New Subject</h2>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            ref={inputRef}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full p-2 mb-2 rounded-lg bg-[#0e1117] border border-gray-600"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1fd6c1] text-black rounded-lg"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubjectModal;

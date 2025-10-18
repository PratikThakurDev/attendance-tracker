import React, { useState, useEffect, useRef } from "react";

function SubjectFormModal({ 
  isOpen, 
  onClose, 
  userId, 
  onSuccess, 
  subject,
  addSubject,  
  updateSubject, 
}) {
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const isEditMode = Boolean(subject);

  useEffect(() => {
    if (isOpen) {
      setSubjectName(subject?.subject_name || "");
      if (inputRef.current) inputRef.current.focus();
    }
  }, [isOpen, subject]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setError("Subject name cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEditMode) {
        const updated = await updateSubject(subject.id, { subject_name: subjectName.trim() });
        onSuccess(updated);
      } else {
        const added = await addSubject(userId, subjectName.trim());
        onSuccess(added);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#18181b] p-6 rounded-lg w-96 border border-[#1fd6c1]/30">
        <h2 className="text-lg font-semibold mb-4">{isEditMode ? "Edit Subject" : "Add Subject"}</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            placeholder="Subject Name"
            value={subjectName}
            ref={inputRef}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full p-2 mb-2 rounded-lg bg-[#0e1117] border border-gray-600 text-white"
            disabled={loading}
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="flex justify-between items-center">
            <div className="ml-auto space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800 text-white"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1fd6c1] rounded hover:bg-[#17b9a9] text-black"
                disabled={loading}
              >
                {loading ? (isEditMode ? "Saving..." : "Adding...") : isEditMode ? "Save Changes" : "Add Subject"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectFormModal;

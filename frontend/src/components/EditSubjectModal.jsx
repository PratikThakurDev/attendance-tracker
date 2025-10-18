import React from "react";

function EditSubjectModal({ isOpen, onClose, subjects, onDelete }) {
  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        {console.log("EditModal subjects:", subjects)}
      <div className="bg-[#18181b] rounded-lg p-6 max-w-md w-full border border-[#1fd6c1]/30 overflow-auto max-h-[70vh]">
        <h2 className="text-xl font-semibold mb-4 text-white">Edit Subjects</h2>
        {subjects.length === 0 ? (
          <p className="text-gray-400">No subjects to display.</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {subjects.map((subject) => (
              <li
                key={subject.id}
                className="py-2 flex justify-between items-center text-gray-300"
              >
                <span>{subject.subject_name || "Unnamed Subject"}</span>
                <button
                  onClick={() => {
                    if (
                      window.confirm(`Delete subject "${subject.subject_name}"?`)
                    ) {
                      onDelete(subject.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-600 font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSubjectModal;

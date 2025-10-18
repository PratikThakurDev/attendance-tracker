import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import Card from "../components/Card";
import SubjectAttendanceCard from "../components/SubjectAttendanceCard";
import TimeTable from "../components/TimeTable";
import TimetableEditor from "../components/TimeTableEditor";
import AllSubjectsAttendanceStatus from "../components/AllSubjectsAttendance";
import SubjectFormModal from "../components/SubjectFormModal";
import MarkAttendanceModal from "../components/MarkAttendanceModal";
import ProfilePage from "../components/ProfilePage";
import {
  fetchSummary,
  fetchAttendanceBySubject,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../utils/api";
import jwtDecode from "jwt-decode";
import { HiOutlineMenu } from "react-icons/hi";

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [summary, setSummary] = useState([]);
  const [subjectFormModalOpen, setSubjectFormModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [markAttendanceModalOpen, setMarkAttendanceModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  const loadSummary = async () => {
    if (!userId) return;
    try {
      setLoadingSummary(true);
      const res = await fetchSummary(userId);
      const normalized = res.map((s) => ({
        id: s.subject_id?.toString() ?? "",
        subject_name: s.subject_name ?? "Unnamed Subject",
        present_count: s.present_count ?? 0,
        total_classes: s.total_classes ?? 0,
        attendance_percentage: s.attendance_percentage ?? "0.00",
      }));
      setSummary(normalized);

      if (!selectedSubject && normalized.length > 0) {
        setSelectedSubject(normalized[0].id ?? "");
      }
    } catch (err) {
      console.error("Error fetching summary:", err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [userId]);

  useEffect(() => {
    if (!selectedSubject) {
      setAttendanceLogs([]);
      return;
    }
    const loadAttendance = async () => {
      try {
        const logs = await fetchAttendanceBySubject(Number(selectedSubject));
        setAttendanceLogs(logs);
      } catch (err) {
        console.error("Error fetching attendance:", err.message);
      }
    };
    loadAttendance();
  }, [selectedSubject]);

  const handleSubjectFormSuccess = (subject) => {
    setSummary((prev) => {
      if (editingSubject) {
        return prev.map((s) =>
          s.id === subject.id?.toString()
            ? { ...s, subject_name: subject.subject_name }
            : s
        );
      } else {
        const normalized = {
          id: subject.id?.toString() ?? "",
          subject_name: subject.subject_name ?? "Unnamed Subject",
          present_count: 0,
          total_classes: 0,
          attendance_percentage: "0.00",
        };
        return [...prev, normalized];
      }
    });

    if (!editingSubject) {
      setSelectedSubject(subject.id?.toString() ?? "");
    }
  };

  const handleDeleteSubject = (id) => {
    setSummary((prev) => prev.filter((s) => s.id !== id));
    if (selectedSubject === id) setSelectedSubject("");
  };

  const openAddSubject = () => {
    setEditingSubject(null);
    setSubjectFormModalOpen(true);
  };

  const avgAttendance =
    summary.length > 0
      ? (
          summary.reduce(
            (sum, s) => sum + parseFloat(s.attendance_percentage || 0),
            0
          ) / summary.length
        ).toFixed(1)
      : 0;

  if (loadingSummary)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="flex h-screen bg-[#0e1117] text-white overflow-hidden">
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen ">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            if (page === "addSubject") openAddSubject();
          }}
        />
      </div>

      <div className="lg:hidden absolute top-4 right-4 z-50">
        <button
          className="text-white text-2xl p-2 rounded-md hover:bg-[#1a1a1a]"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <HiOutlineMenu />
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#111217] z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            if (page === "addSubject") openAddSubject();
            setSidebarOpen(false);
          }}
        />
      </div>

      <SubjectFormModal
        isOpen={subjectFormModalOpen}
        onClose={() => setSubjectFormModalOpen(false)}
        userId={userId}
        subject={editingSubject}
        onSuccess={handleSubjectFormSuccess}
        onDelete={handleDeleteSubject}
        addSubject={addSubject}
        updateSubject={updateSubject}
        deleteSubject={deleteSubject}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8">
        <TopBar />
        {currentPage === "timeTable" && (
          <TimetableEditor userId={userId} subjects={summary} />
        )}
        {currentPage === "profile" && <ProfilePage />}
        {currentPage === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card
                title="Avg Attendance"
                value={`${avgAttendance}%`}
                subtitle="Across all subjects"
              />
              <Card
                title="Subjects"
                value={summary.length}
                subtitle="Total Enrolled"
              />
              <Card
                title="Highest Attendance"
                value={
                  summary.length > 0
                    ? `${Math.max(...summary.map((s) => parseFloat(s.attendance_percentage || 0)))}%`
                    : "0%"
                }
                subtitle="Top Subject"
              />
              <Card
                title="Classes Recorded"
                value={attendanceLogs.length}
                subtitle={
                  selectedSubject
                    ? (summary.find((s) => s.id?.toString() === selectedSubject)
                        ?.subject_name ?? "Unknown Subject")
                    : "Select a Subject"
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <label className="font-semibold text-sm sm:text-base">
                Select Subject:
              </label>
              <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                <select
                  className="flex-1 sm:flex-none bg-[#18181b] border border-[#1fd6c1]/30 px-3 py-2 rounded-lg text-sm sm:text-base"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">-- Choose --</option>
                  {summary.map((s) => (
                    <option
                      key={s.id?.toString() ?? s.subject_name}
                      value={s.id?.toString() ?? ""}
                    >
                      {s.subject_name ?? "Unnamed Subject"}
                    </option>
                  ))}
                </select>

                <button
                  className="px-3 sm:px-4 py-2 rounded-lg bg-[#1fd6c1] text-black font-semibold text-sm sm:text-base"
                  onClick={() => {
                    if (!selectedSubject)
                      return alert("Select a subject first");
                    setMarkAttendanceModalOpen(true);
                  }}
                >
                  Mark Attendance
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <SubjectAttendanceCard
                selectedSubject={summary.find(
                  (s) => s.id?.toString() === selectedSubject
                )}
                allSubjects={summary}
              />
              <AllSubjectsAttendanceStatus summary={summary} />
              <TimeTable userId={userId} />
            </div>
          </>
        )}

        {currentPage === "editSubject" && (
          <div className="p-6 text-white">
            <h2 className="text-2xl font-semibold mb-6">Manage Subjects</h2>
            {summary.length === 0 ? (
              <p className="text-gray-400">No subjects available.</p>
            ) : (
              <ul className="divide-y divide-gray-700 max-w-2xl">
                {summary.map((subject) => (
                  <li
                    key={subject.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <span>{subject.subject_name || "Unnamed Subject"}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingSubject(subject);
                          setSubjectFormModalOpen(true);
                        }}
                        className="bg-[#1fd6c1] hover:bg-[#17b9a9] text-black px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Delete subject "${subject.subject_name}"?`
                            )
                          ) {
                            try {
                              await deleteSubject(subject.id);
                              handleDeleteSubject(subject.id);
                            } catch (err) {
                              alert(
                                "Failed to delete subject: " +
                                  (err.message || "Unknown error")
                              );
                            }
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <MarkAttendanceModal
        isOpen={markAttendanceModalOpen}
        onClose={() => setMarkAttendanceModalOpen(false)}
        subjectId={selectedSubject}
        userId={userId}
        onSuccess={async () => {
          const logs = await fetchAttendanceBySubject(Number(selectedSubject));
          setAttendanceLogs(logs);
          await loadSummary();
        }}
      />
    </div>
  );
}

export default Dashboard;

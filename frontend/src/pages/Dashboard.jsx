import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import Card from "../components/Card";
import ClassesAttendedChart from "../components/AttendanceChart";
import CalendarWidget from "../components/CalendarWidget";
import LogTable from "../components/LogTable";
import AddSubjectModal from "../components/AddSubjectModal";
import MarkAttendanceModal from "../components/MarkAttendanceModal";
import { fetchSummary, fetchAttendanceBySubject } from "../utils/api";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [summary, setSummary] = useState([]);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [markAttendanceModalOpen, setMarkAttendanceModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleAddSubjectClick = () => setAddSubjectModalOpen(true);

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

  useEffect(() => {
    if (!userId) return;

    const loadSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await fetchSummary(userId);
        setSummary(res);
      } catch (err) {
        console.error("Error fetching summary:", err.message);
      } finally {
        setLoadingSummary(false);
      }
    };

    loadSummary();
  }, [userId]);

  useEffect(() => {
    if (!selectedSubject || isNaN(Number(selectedSubject))) {
      setAttendanceLogs([]);
      setChartData([]);
      return;
    }

    const loadAttendance = async () => {
      try {
        setLoadingAttendance(true);
        const logs = await fetchAttendanceBySubject(Number(selectedSubject));
        setAttendanceLogs(logs);

        const dailyMap = {};
        logs.forEach((log) => {
          const day = new Date(log.attendance_date).toLocaleDateString(
            "en-IN",
            { day: "numeric", month: "short" }
          );
          if (!dailyMap[day]) dailyMap[day] = 0;
          if (log.status) dailyMap[day] += 1;
        });

        const formatted = Object.keys(dailyMap).map((day) => ({
          day,
          classesAttended: dailyMap[day],
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching attendance:", err.message);
      } finally {
        setLoadingAttendance(false);
      }
    };

    loadAttendance();
  }, [selectedSubject]);

  const handleAddSuccess = async (newSubject) => {
    setSummary((prev) => [...prev, newSubject]);
    setSelectedSubject(newSubject.id);

    try {
      const logs = await fetchAttendanceBySubject(newSubject.id);
      setAttendanceLogs(logs);

      const dailyMap = {};
      logs.forEach((log) => {
        const day = new Date(log.attendance_date).toLocaleDateString(
          "en-IN",
          { day: "numeric", month: "short" }
        );
        if (!dailyMap[day]) dailyMap[day] = 0;
        if (log.status) dailyMap[day] += 1;
      });

      const formatted = Object.keys(dailyMap).map((day) => ({
        day,
        classesAttended: dailyMap[day],
      }));

      setChartData(formatted);
    } catch (err) {
      console.error("Error fetching attendance after adding subject:", err);
    }
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
    <div className="flex h-screen bg-[#0e1117] text-white">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          if (page === "canceled") handleAddSubjectClick();
        }}
      />

      <AddSubjectModal
        isOpen={addSubjectModalOpen}
        onClose={() => setAddSubjectModalOpen(false)}
        userId={userId}
        onSuccess={handleAddSuccess}
      />

      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        <TopBar />

        <div className="grid grid-cols-4 gap-6">
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
                ? `${Math.max(
                    ...summary.map((s) =>
                      parseFloat(s.attendance_percentage || 0)
                    )
                  )}%`
                : "0%"
            }
            subtitle="Top Subject"
          />
          <Card
            title="Classes Recorded"
            value={attendanceLogs.length}
            subtitle={
              selectedSubject
                ? `For ${
                    summary.find((s) => s.id === Number(selectedSubject))
                      ?.subject_name
                  }`
                : "Select a Subject"
            }
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold">Select Subject:</label>
          <select
            className="bg-[#18181b] border border-[#1fd6c1]/30 px-3 py-2 rounded-lg"
            value={selectedSubject ?? ""}
            onChange={(e) => setSelectedSubject(e.target.value || null)}
          >
            <option value="">-- Choose --</option>
            {summary.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subject_name}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 rounded-lg bg-[#1fd6c1] text-black font-semibold"
            onClick={() => {
              if (!selectedSubject) return alert("Select a subject first");
              setMarkAttendanceModalOpen(true);
            }}
          >
            Mark Attendance
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <ClassesAttendedChart data={chartData} />
          <CalendarWidget attendanceLogs={attendanceLogs} />
          <LogTable logs={attendanceLogs} />
        </div>
      </main>

      <MarkAttendanceModal
        isOpen={markAttendanceModalOpen}
        onClose={() => setMarkAttendanceModalOpen(false)}
        subjectId={selectedSubject}
        userId={userId}
        onSuccess={async () => {
          const logs = await fetchAttendanceBySubject(Number(selectedSubject));
          setAttendanceLogs(logs);

          const dailyMap = {};
          logs.forEach((log) => {
            const day = new Date(log.attendance_date).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "short" }
            );
            if (!dailyMap[day]) dailyMap[day] = 0;
            if (log.status) dailyMap[day] += 1;
          });
          setChartData(
            Object.keys(dailyMap).map((day) => ({
              day,
              classesAttended: dailyMap[day],
            }))
          );
        }}
      />
    </div>
  );
}

export default Dashboard;

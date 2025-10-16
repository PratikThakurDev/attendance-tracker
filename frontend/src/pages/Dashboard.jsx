import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import Card from "../components/Card";
import ClassesAttendedChart from "../components/AttendanceChart";
import CalendarWidget from "../components/CalendarWidget";
import LogTable from "../components/LogTable";
import MarkAttendanceModal from "../components/MarkAttendanceModal";
import { fetchSummary, fetchAttendanceBySubject } from "../utils/api";

function Dashboard() {
  const userId = 1; // later: replace with logged-in user ID
  const [summary, setSummary] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch summary for user
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await fetchSummary(userId);
        setSummary(res);
      } catch (err) {
        console.error("Error fetching summary:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, [userId]);

  // ✅ Fetch attendance logs when subject changes
  useEffect(() => {
    const loadAttendance = async () => {
      if (!selectedSubject) {
        setAttendanceLogs([]);
        setChartData([]);
        return;
      }

      try {
        const logs = await fetchAttendanceBySubject(selectedSubject);
        setAttendanceLogs(logs);

        // transform logs → chart-friendly format
        const dailyMap = {};
        logs.forEach((log) => {
          const day = new Date(log.attendance_date).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
            }
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
      }
    };
    loadAttendance();
  }, [selectedSubject]);

  // ✅ Calculate average attendance
  const avgAttendance =
    summary.length > 0
      ? (
          summary.reduce(
            (sum, s) => sum + parseFloat(s.attendance_percentage || 0),
            0
          ) / summary.length
        ).toFixed(1)
      : 0;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="flex h-screen bg-[#0e1117] text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        <TopBar />

        {/* Cards */}
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
                ? `For ${summary.find((s) => s.subject_id === +selectedSubject)?.subject_name}`
                : "Select a Subject"
            }
          />
        </div>

        {/* Subject Selector */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Select Subject:</label>
          <select
            className="bg-[#18181b] border border-[#1fd6c1]/30 px-3 py-2 rounded-lg"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {summary.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_name}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 rounded-lg bg-[#1fd6c1] text-black font-semibold"
            onClick={() => {
              if (!selectedSubject) return alert("Select a subject first");
              setIsModalOpen(true);
            }}
          >
            Mark Attendance
          </button>
        </div>

        {/* Charts + Logs */}
        <div className="grid grid-cols-3 gap-6">
          <ClassesAttendedChart data={chartData} />
          <CalendarWidget attendanceLogs={attendanceLogs} />
          <LogTable logs={attendanceLogs} />
        </div>
      </main>
      <MarkAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjectId={selectedSubject}
        userId={userId}
        onSuccess={() => {
          // refresh attendance after marking
          const reload = async () => {
            const logs = await fetchAttendanceBySubject(selectedSubject);
            setAttendanceLogs(logs);
            setChartData(
              logs.map((log) => ({
                day: new Date(log.attendance_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                }),
                classesAttended: log.status ? 1 : 0,
              }))
            );
          };
          reload();
        }}
      />
    </div>
  );
}

export default Dashboard;

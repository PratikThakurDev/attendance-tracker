import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import Card from "../components/Card";
import ClassesAttendedChart from "../components/AttendanceChart";
import CalendarWidget from "../components/CalendarWidget";
import LogTable from "../components/LogTable";
import MarkAttendanceModal from "../components/MarkAttendanceModal";
import { fetchSummary, fetchAttendanceBySubject } from "../utils/api";
import {jwtDecode} from "jwt-decode"; // ✅ stable import

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [summary, setSummary] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Extract userId from token
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

  // ✅ Fetch summary once userId is set
  useEffect(() => {
    if (!userId) return;

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
    if (!selectedSubject) {
      setAttendanceLogs([]);
      setChartData([]);
      return;
    }

    const loadAttendance = async () => {
      try {
        const logs = await fetchAttendanceBySubject(selectedSubject);
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
          <Card title="Avg Attendance" value={`${avgAttendance}%`} subtitle="Across all subjects" />
          <Card title="Subjects" value={summary.length} subtitle="Total Enrolled" />
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
        onSuccess={async () => {
          const logs = await fetchAttendanceBySubject(selectedSubject);
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

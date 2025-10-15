import React from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import Card from "../components/Card";
import AttendanceChart from "../components/AttendanceChart";
import CalendarWidget from "../components/CalendarWidget";
import LogTable from "../components/LogTable";

function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0e1117] text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        <TopBar />
        {/* Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card title="Attendance" value="87%" subtitle="This month" />
          <Card title="Present Days" value="22" subtitle="Out of 25" />
          <Card title="Class Cancelled" value="3" subtitle="This month" />
          <Card title="Streak" value="10 Days" subtitle="No Absences" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6">
          <AttendanceChart />
          <CalendarWidget />
          <LogTable />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

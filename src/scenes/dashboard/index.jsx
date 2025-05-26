import React, { useState } from "react";
import SidebarAdmin from "../global/SidebarAdmin";
import TopbarAdmin from "../global/TopbarAdmin";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const students = [
    { date: "02/04/2025", name: "Juan D. Cruz", id: "02003267548", program: "BSCS301", timeIn: "7:48 AM", timeOut: "1:04 PM" },
    { date: "03/04/2025", name: "Andrhea Mae Bayabos", id: "030002312", program: "BSCS301", timeIn: "2:00 PM", timeOut: "4:00 PM" },
    { date: "04/04/2025", name: "Cams D. Pamagmahal", id: "0300016352", program: "HRS201", timeIn: "8:00 AM", timeOut: "2:00 PM" },
    { date: "05/04/2025", name: "Mark L. Malupiton", id: "0400045678", program: "BSCS202", timeIn: "9:00 AM", timeOut: "3:30 PM" },
  ];

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-GB");

  const filteredStudents = selectedDate
    ? students.filter(s => s.date === formatDate(selectedDate))
    : students;

  const todayActivity = filteredStudents.map(s => ({
    label: s.name,
    time: `${s.timeIn} - ${s.timeOut}`
  }));

  const total = filteredStudents.length;
  const bscs = filteredStudents.filter(s => s.program.toLowerCase().includes("bscs")).length;
  const hrs = filteredStudents.filter(s => s.program.toLowerCase().includes("hrs")).length;

  const bscsPercent = total > 0 ? Math.round((bscs / total) * 100) : 0;
  const hrsPercent = total > 0 ? Math.round((hrs / total) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <TopbarAdmin />
      <div className="flex flex-grow">
        <SidebarAdmin />
        <div className="flex-1 bg-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

          {/* Header */}
          <div className="bg-white p-4 shadow rounded-md flex items-center justify-between">
            <h2 className="text-lg font-semibold">Attendance History</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Today Activity */}
            <div className="bg-white border rounded-md p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Today Activity</h3>
              <ul className="grid gap-3 text-sm text-gray-700">
                {todayActivity.length ? (
                  todayActivity.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      {item.label} <span className="ml-auto">{item.time}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No activity found</li>
                )}
              </ul>
            </div>

            {/* Statistics */}
            <div className="bg-white border rounded-md p-6 col-span-2">
              <div className="grid grid-cols-2 gap-10 justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="w-36 h-36">
                    <CircularProgressbar
                      value={bscsPercent}
                      text={`${bscsPercent}%`}
                      styles={buildStyles({
                        textColor: "#3b82f6",
                        pathColor: "#3b82f6",
                        trailColor: "#e5e7eb",
                        textSize: "18px",
                      })}
                    />
                  </div>
                  <div className="mt-3 text-base font-semibold text-blue-600">BSCS</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-36 h-36">
                    <CircularProgressbar
                      value={hrsPercent}
                      text={`${hrsPercent}%`}
                      styles={buildStyles({
                        textColor: "#f59e0b",
                        pathColor: "#f59e0b",
                        trailColor: "#e5e7eb",
                        textSize: "18px",
                      })}
                    />
                  </div>
                  <div className="mt-3 text-base font-semibold text-yellow-600">HRS</div>
                </div>
              </div>

              {/* Overall Summary */}
              <div className="text-center mt-6 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Total Students:</span> {total} &nbsp;|&nbsp;
                  <span className="text-blue-600 font-semibold">BSCS:</span> {bscs} &nbsp;|&nbsp;
                  <span className="text-yellow-600 font-semibold">HRS:</span> {hrs}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto bg-white p-4 rounded-md shadow">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Student Name</th>
                  <th className="px-4 py-2">ID Number</th>
                  <th className="px-4 py-2">Program</th>
                  <th className="px-4 py-2">Time In</th>
                  <th className="px-4 py-2">Time Out</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length ? (
                  filteredStudents.map((s, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{s.date}</td>
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">{s.id}</td>
                      <td className="px-4 py-2">{s.program}</td>
                      <td className="px-4 py-2">{s.timeIn}</td>
                      <td className="px-4 py-2">{s.timeOut}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-400 py-4">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

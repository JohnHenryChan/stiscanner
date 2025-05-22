import React, { useState } from "react";
import SidebarAdmin from "../global/SidebarAdmin";
import TopbarAdmin from "../global/TopbarAdmin";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";

const AttendanceRecord = () => {
  const [programs, setPrograms] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleEditProgram = (index) => {
    setEditIndex(index);
    // Add modal logic here if needed
  };

  const handleDeleteProgram = (index) => {
    const updatedPrograms = programs.filter((_, i) => i !== index);
    setPrograms(updatedPrograms);
  };

  const filteredPrograms = () => {
    return programs.filter((program) =>
      `${program.programName} ${program.instructorName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TopbarAdmin />
      <div className="flex flex-grow">
        <SidebarAdmin />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-semibold mb-6">Attendance Record</h1>

          {/* Search and Date Picker */}
          <div className="flex justify-between items-center mb-6 space-x-4">
            {/* Search Input */}
            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md w-1/3">
              <MdSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="outline-none px-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Date Picker */}
            <div className="flex items-center space-x-2 bg-white border rounded-md px-3 py-2 shadow-md">
              <label className="text-gray-700 font-medium">Date:</label>
              <input
                type="date"
                className="outline-none text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filteredPrograms().map((program, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white border border-gray-300 px-6 py-4 rounded-md shadow"
              >
                <div>
                  <h2 className="text-lg font-bold">{program.programName}</h2>
                  <p className="text-sm text-gray-600">
                    Instructor: {program.instructorName}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleEditProgram(index)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>

                {/* Static Circle Graph */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="absolute top-0 left-0" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-700"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="75, 100"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="text-blue-700 font-bold text-sm">75%</span>
                </div>
              </div>
            ))}
            {filteredPrograms().length === 0 && (
              <p className="text-gray-500 text-center">No attendance found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecord;

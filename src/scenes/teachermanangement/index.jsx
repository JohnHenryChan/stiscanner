import React, { useState } from "react";
import SidebarAdmin from "../global/SidebarAdmin";
import TopbarAdmin from "../global/TopbarAdmin";
import { MdEdit, MdDelete, MdSearch } from "react-icons/md";
import InstructorModal from "../../components/InstructorModal";

const CoursesManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [editIndex, setEditIndex] = useState(null);

  const [instructors, setInstructors] = useState([
    {
      name: "Jane Doe",
      startTime: "08:00",
      endTime: "10:00",
      schedule: "MWF",
      program: "Computer Science",
      course: "Data Structures",
      yearLevel: "2nd Year",
    },
    {
      name: "John Smith",
      startTime: "10:30",
      endTime: "12:00",
      schedule: "TTh",
      program: "Information Technology",
      course: "Web Development",
      yearLevel: "3rd Year",
    },
  ]);

  const handleAddInstructor = (data) => {
    if (editIndex !== null) {
      const updated = [...instructors];
      updated[editIndex] = data;
      setInstructors(updated);
      setEditIndex(null);
    } else {
      setInstructors([...instructors, data]);
    }
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    setInstructors(instructors.filter((_, i) => i !== index));
  };

  const programs = ["All", ...new Set(instructors.map((inst) => inst.program))];

  const filteredInstructors = instructors.filter((inst) => {
    const matchesSearch = `${inst.name} ${inst.startTime} ${inst.endTime} ${inst.program} ${inst.course} ${inst.schedule} ${inst.yearLevel}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesProgram =
      selectedProgram === "All" || inst.program === selectedProgram;

    return matchesSearch && matchesProgram;
  });

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopbarAdmin />
      <div className="flex flex-grow">
        <SidebarAdmin />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Courses Management</h1>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 items-center w-2/3">
              <div className="flex items-center border rounded px-3 py-2 bg-white shadow-md w-1/2">
                <MdSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="outline-none px-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 rounded border bg-white shadow-md"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
              >
                {programs.map((program, idx) => (
                  <option key={idx} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="bg-[#0057A4] text-white px-4 py-2 rounded shadow"
              onClick={() => {
                setEditIndex(null);
                setShowModal(true);
              }}
            >
              Assign Instructor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-center bg-white">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Time</th>
                  <th className="border px-4 py-2">Schedule</th>
                  <th className="border px-4 py-2">Program & Subject Handled</th>
                  <th className="border px-4 py-2">Year Level</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((inst, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{inst.name}</td>
                    <td className="border px-4 py-2">
                      {formatTime(inst.startTime)} – {formatTime(inst.endTime)}
                    </td>
                    <td className="border px-4 py-2">{inst.schedule}</td>
                    <td className="border px-4 py-2">
                      {inst.program}
                      <br />
                      {inst.course}
                    </td>
                    <td className="border px-4 py-2">{inst.yearLevel}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-yellow-500 mx-1"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800 mx-1"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredInstructors.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 text-gray-500">
                      No instructors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <InstructorModal
          visible={showModal}
          onClose={() => {
            setShowModal(false);
            setEditIndex(null);
          }}
          onSubmit={handleAddInstructor}
          initialData={editIndex !== null ? instructors[editIndex] : null}
        />
      )}
    </div>
  );
};

export default CoursesManagement;

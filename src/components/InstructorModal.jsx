import React, { useState, useEffect } from "react";

const InstructorModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [program, setProgram] = useState("");
  const [course, setCourse] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [scheduleSort, setScheduleSort] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [errors, setErrors] = useState({});

  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [newCourseName, setNewCourseName] = useState("");

  const [programOptions, setProgramOptions] = useState([
    "Computer Science",
    "Information Technology",
    "Business Management",
  ]);

  const [courseOptions, setCourseOptions] = useState({
    "Computer Science": ["Data Structures", "Algorithms", "Operating Systems"],
    "Information Technology": [
      "Web Development",
      "Networking",
      "Database Systems",
    ],
    "Business Management": ["Accounting", "Marketing", "Finance"],
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setStartTime(initialData.startTime || "");
      setEndTime(initialData.endTime || "");
      setProgram(initialData.program || "");
      setCourse(initialData.course || "");
      setSchedule(initialData.schedule || []);
      setScheduleSort(initialData.scheduleSort || "");
      setYearLevel(initialData.yearLevel || "");
    } else {
      resetForm();
    }
  }, [initialData, visible]);

  const resetForm = () => {
    setName("");
    setStartTime("");
    setEndTime("");
    setProgram("");
    setCourse("");
    setSchedule([]);
    setScheduleSort("");
    setYearLevel("");
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endTime) newErrors.endTime = "End time is required.";
    if (!program.trim()) newErrors.program = "Program is required.";
    if (!course.trim()) newErrors.course = "Course is required.";
    if (scheduleSort === "") newErrors.schedule = "Schedule is required.";
    if (yearLevel === "") newErrors.yearLevel = "Year level is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const instructorData = {
      name,
      startTime,
      endTime,
      program,
      course,
      schedule,
      scheduleSort,
      yearLevel,
    };
    if (typeof onSubmit === "function") {
      onSubmit(instructorData);
    }
    resetForm();
    onClose(); // Close modal after saving
  };

  const handleProgramChange = (value) => {
    if (value === "add-edit") {
      setShowAddProgram(true);
    } else {
      setProgram(value);
      setCourse(""); // Reset course when program changes
    }
  };

  const handleCourseChange = (value) => {
    if (value === "add-edit") {
      setShowAddCourse(true);
    } else {
      setCourse(value);
    }
  };

  const handleAddProgram = () => {
    const trimmed = newProgramName.trim();
    if (trimmed && !programOptions.includes(trimmed)) {
      setProgramOptions((prev) => [...prev, trimmed]);
      setCourseOptions((prev) => ({ ...prev, [trimmed]: [] }));
      setProgram(trimmed);
    }
    setShowAddProgram(false);
    setNewProgramName("");
  };

  const handleAddCourse = () => {
    const trimmed = newCourseName.trim();
    if (!program) {
      alert("Please select a program first.");
      return;
    }
    if (trimmed && !courseOptions[program]?.includes(trimmed)) {
      setCourseOptions((prev) => ({
        ...prev,
        [program]: [...(prev[program] || []), trimmed],
      }));
      setCourse(trimmed);
    }
    setShowAddCourse(false);
    setNewCourseName("");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96 relative">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Instructor" : "Assign Instructor"}
        </h2>

        <input
          className={`w-full border p-2 mb-1 rounded ${
            errors.name ? "border-red-500 border-2" : "border"
          }`}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name}</p>
        )}

        <div className="flex justify-between gap-4 mb-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              className={`w-full border p-2 rounded ${
                errors.startTime ? "border-red-500 border-2" : "border"
              }`}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              className={`w-full border p-2 rounded ${
                errors.endTime ? "border-red-500 border-2" : "border"
              }`}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        {(errors.startTime || errors.endTime) && (
          <p className="text-red-500 text-sm mb-2">
            {errors.startTime || errors.endTime}
          </p>
        )}

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Schedule</label>
            <select
              className={`w-full border p-2 rounded ${
                errors.schedule ? "border-red-500 border-2" : "border"
              }`}
              value={scheduleSort}
              onChange={(e) => setScheduleSort(e.target.value)}
            >
              <option value="">Select</option>
              <option value="MWF">MWF</option>
              <option value="TTH">TTH</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Year Level</label>
            <select
              className={`w-full border p-2 rounded ${
                errors.yearLevel ? "border-red-500 border-2" : "border"
              }`}
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
            >
              <option value="">Select</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <select
          className={`w-full p-2 mb-1 rounded ${
            errors.program ? "border-red-500 border-2" : "border"
          }`}
          value={program}
          onChange={(e) => handleProgramChange(e.target.value)}
        >
          <option value="">Select Program</option>
          <optgroup label="Programs">
            {programOptions.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </optgroup>
        </select>
        {errors.program && (
          <p className="text-red-500 text-sm mb-2">{errors.program}</p>
        )}

        <select
          className={`w-full p-2 mb-1 rounded ${
            errors.course ? "border-red-500 border-2" : "border"
          }`}
          value={course}
          onChange={(e) => handleCourseChange(e.target.value)}
          disabled={!program}
        >
          <option value="">Select Subject</option>
          {program &&
            courseOptions[program]?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
        {errors.course && (
          <p className="text-red-500 text-sm mb-4">{errors.course}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            Cancel
          </button>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>

        {showAddProgram && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white p-4 shadow-md border rounded w-80 z-10">
            <h3 className="font-bold mb-2">Add New Program</h3>
            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Program name"
              value={newProgramName}
              onChange={(e) => setNewProgramName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-700 text-white px-3 py-1 rounded"
                onClick={handleAddProgram}
              >
                Add
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => {
                  setShowAddProgram(false);
                  setNewProgramName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showAddCourse && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white p-4 shadow-md border rounded w-80 z-10">
            <h3 className="font-bold mb-2">Add New Course</h3>
            <input
              className="w-full border p-2 mb-2 rounded"
              placeholder="Course name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-700 text-white px-3 py-1 rounded"
                onClick={handleAddCourse}
              >
                Add
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => {
                  setShowAddCourse(false);
                  setNewCourseName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorModal;

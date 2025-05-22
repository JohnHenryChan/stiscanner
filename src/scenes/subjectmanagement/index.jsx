import React, { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import { FaTrash, FaPen } from "react-icons/fa";
import SidebarAdmin from "../global/SidebarAdmin";
import TopbarAdmin from "../global/TopbarAdmin";
import Subject from "../../components/Subject";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

const SubjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState("All Programs");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjectList"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSubjects(data);
    });
    return () => unsubscribe();
  }, []);

  const distinctPrograms = [
    "All Programs",
    ...new Set(subjects.map((subj) => subj.program))
  ];

  const handleOpenSubject = () => {
    setEditingIndex(null);
    setEditingData(null);
    setIsSubjectOpen(true);
  };

  const handleCloseSubject = () => {
    setIsSubjectOpen(false);
  };

  const handleSubjectSubmit = (data) => {
    setIsSubjectOpen(false);
    setEditingIndex(null);
    setEditingData(null);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingData(subjects[index]);
    setIsSubjectOpen(true);
  };

  const handleDelete = (index) => {
    const subjectDelete = subjects[index];
    if (subjectDelete?.id) {
      deleteDoc(doc(db, "subjectList", subjectDelete.id));
    }
  };

  const filteredSubjects = subjects.filter((subj) => {
    const programMatch =
      selectedProgram === "All Programs" || subj.program === selectedProgram;
    const searchMatch = Object.values(subj).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return programMatch && searchMatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopbarAdmin />
      <div className="flex flex-grow">
        <SidebarAdmin />
        <div className="flex flex-col flex-grow px-8 py-6 bg-white">
          <h1 className="text-2xl font-semibold mb-4">Subject Management</h1>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md w-64">
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
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="border px-4 py-2 rounded-md shadow-md bg-white text-gray-700"
              >
                {distinctPrograms.map((prog, idx) => (
                  <option key={idx} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenSubject}
              className="bg-[#0057A4] text-white px-6 py-2 rounded-sm shadow hover:bg-blue-800 transition-all"
            >
              Add Subject
            </button>
          </div>

          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Program</th>
                  <th className="py-2 px-4 border">Subject</th>
                  <th className="py-2 px-4 border">Subject Code</th>
                  <th className="py-2 px-4 border">Year Level</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subj, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border">{subj.program}</td>
                    <td className="py-2 px-4 border">{subj.subject}</td>
                    <td className="py-2 px-4 border">{subj.subjectCode}</td>
                    <td className="py-2 px-4 border">{subj.yearLevel}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => handleEdit(index)}>
                          <FaPen className="text-black hover:text-blue-600 cursor-pointer" />
                        </button>
                        <button onClick={() => handleDelete(index)}>
                          <FaTrash className="text-red-600 hover:text-red-800 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSubjects.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 text-center text-gray-500 italic"
                    >
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Subject
            visible={isSubjectOpen}
            onClose={handleCloseSubject}
            onSubmit={handleSubjectSubmit}
            initialData={editingData}
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectManagement;
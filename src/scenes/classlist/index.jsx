import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {doc,getDoc,getDocs,deleteDoc,collection,onSnapshot} from "firebase/firestore";
import { FaPen, FaTrash } from "react-icons/fa";
import { db } from "../../firebaseConfig";
import AddStudent from "../../components/AddStudent";

const ClassList = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const subjectRef = doc(db, "subjectList", subjectId);
    const unsubscribe = onSnapshot(collection(subjectRef, "students"), async (snapshot) => {
      const studentIds = snapshot.docs.map((doc) => doc.id);
      const studentPromises = studentIds.map(async (studentId) => {
        const studentSnap = await getDoc(doc(db, "students", studentId));
        return studentSnap.exists()
          ? { id: studentId, ...studentSnap.data(), valid: true }
          : { id: studentId, name: "Invalid Reference", valid: false };
      });
      const studentData = await Promise.all(studentPromises);
      setStudents(studentData);
    });

    getDoc(subjectRef)
      .then((subjectSnap) => {
        if (subjectSnap.exists()) {
          setSubjectData(subjectSnap.data());
        } else {
          console.log("No such subject found!");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subject:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [subjectId]);

  const handleBack = () => navigate("/subjectmanagement");

  const handleAddOrUpdateStudent = (studentData) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === studentData.id);
      return exists
        ? prev.map((s) => (s.id === studentData.id ? studentData : s))
        : [...prev, studentData];
    });
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleEditStudent = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (student?.valid) {
      setEditingStudent(student);
      setShowModal(true);
    } else {
      alert("This student reference is invalid and cannot be edited.");
    }
  };

  const handleDeleteStudentFromSubject = async (studentId) => {
    try {
      await deleteDoc(doc(db, "subjectList", subjectId, "students", studentId));
    } catch (err) {
      console.error("Error removing student from subject:", err);
    }
  };

  const handleDeleteStudentFromMaster = async (studentId) => {
    try {
      await deleteDoc(doc(db, "students", studentId));
      await handleDeleteStudentFromSubject(studentId);
    } catch (err) {
      console.error("Error removing student from master list:", err);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-white">
      {showModal && (
        <AddStudent
          onClose={() => {
            setShowModal(false);
            setEditingStudent(null);
          }}
          onAdd={handleAddOrUpdateStudent}
          initialData={editingStudent}
          subjectID={subjectId}
        />
      )}

      <div className="flex justify-between items-center p-4 shadow bg-blue sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="text-white text-3xl font-bold hover:underline transition"
        >
          ←
        </button>
        <span className="text-sm text-white opacity-0 cursor-default">&nbsp;</span>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold text-black mb-6">Class List</h1>

        <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
          {loading ? (
            <p className="text-gray-500">Loading subject data...</p>
          ) : subjectData ? (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-start">
              <div className="space-y-2 text-black">
                <div><strong>Program:</strong> {subjectData.program}</div>
                <div><strong>Subject:</strong> {subjectData.subject}</div>
                <div><strong>Subject Code:</strong> {subjectData.subjectCode}</div>
                <div><strong>Year Level:</strong> {subjectData.yearLevel}</div>
              </div>
              <div className="flex flex-col items-end gap-8 mt-4 md:mt-0">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                />
                <button
                  className="bg-blue-700 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-800"
                  onClick={() => setShowModal(true)}
                >
                  Add Student
                </button>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Subject not found.</p>
          )}
        </div>

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Student ID</th>
                <th className="py-2 px-4 border">Full Name</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={`text-center ${!student.valid ? "bg-red-100" : ""}`}>
                    <td className="py-2 px-4 border">{student.id}</td>
                    <td className="py-2 px-4 border">
                      {student.valid ? (
                        <Link to={`/students/${student.id}`} className="text-blue hover:underline">
                          {student.name}
                        </Link>
                      ) : (
                        <span className="text-red-500 italic">{student.name}</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => handleEditStudent(student.id)} disabled={!student.valid}>
                          <FaPen className={`cursor-pointer ${student.valid ? "text-black hover:text-blue-600" : "text-gray-400 cursor-not-allowed"}`} />
                        </button>
                        <button onClick={() => handleDeleteStudentFromSubject(student.id)}>
                          <FaTrash className="text-yellow-600 hover:text-yellow-800 cursor-pointer" title="Remove from Subject" />
                        </button>
                        <button onClick={() => handleDeleteStudentFromMaster(student.id)}>
                          <FaTrash className="text-red-600 hover:text-red-800 cursor-pointer" title="Delete from Master List" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 border text-center text-gray-500 italic">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassList;

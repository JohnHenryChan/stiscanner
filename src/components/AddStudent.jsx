import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AddStudent = ({ onClose, onAdd, initialData, subjectID, hideCancel = false, visible = true }) => {
  const [step, setStep] = useState(initialData ? 2 : 1);
  const [studentID, setStudentID] = useState(initialData?.id || "");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    contact: "",
    rfid: "",
    guardian: "",
    guardianContact: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!visible) return null;

  const handleIDCheck = async () => {
    if (!studentID.trim()) return alert("Please enter a Student ID");
    setLoading(true);

    const studentRef = doc(db, "students", studentID);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      setFormData({ id: studentID, ...studentSnap.data() });
    } else {
      setFormData((prev) => ({ ...prev, id: studentID }));
    }

    setStep(2);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = () => {
    const { id, name, contact, rfid, guardian, guardianContact } = formData;
    return id && name && contact && rfid && guardian && guardianContact;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentRef = doc(db, "students", formData.id);
    await setDoc(studentRef, formData, { merge: true });

    if (!initialData && subjectID) {
      const subjectStudentRef = doc(db, "subjectList", subjectID, "students", formData.id);
      const existing = await getDoc(subjectStudentRef);

      if (existing.exists()) {
        alert("Student ID already exists in this subject's list.");
        return;
      }

      await setDoc(subjectStudentRef, { id: formData.id });
    }

    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Student" : step === 1 ? "Enter Student ID" : "Student Details"}
        </h2>

        {step === 1 ? (
          <div className="space-y-4">
            <input
              name="studentID"
              placeholder="Student ID"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-end gap-2">
              {!hideCancel && (
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleIDCheck}
                className="bg-blue-700 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-800"
              >
                {loading ? "Checking..." : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="id" placeholder="Student ID" value={formData.id} disabled className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed" />
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            <input name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            <input name="rfid" placeholder="RFID No." value={formData.rfid} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            <input name="guardian" placeholder="Parent/Guardian Name" value={formData.guardian} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            <input name="guardianContact" placeholder="Contact Number" value={formData.guardianContact} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            <div className="flex justify-end gap-2">
              {!hideCancel && (
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`font-medium px-6 py-2 rounded-md ${isFormValid() ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              >
                {initialData ? "Update" : "Add Student"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddStudent;

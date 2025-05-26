import React, { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

const Subject = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    program: "",
    subject: "",
    subjectCode: "",
    yearLevel: "",
  });

  const docSub = collection(db, "subjectList");


  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (visible) {
      setFormData(
        initialData || {
          program: "",
          subject: "",
          subjectCode: "",
          yearLevel: "",
        }
      );
      setErrorMessage("");
    }
  }, [visible, initialData]);

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { program, subject, subjectCode, yearLevel } = formData;

    if (!program || !subject || !subjectCode || !yearLevel) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const docRef = doc(docSub, subjectCode);
    const docCheck = await getDoc(docRef);

    if (docCheck.exists()) {
      setErrorMessage("Subject already exists.");
      return;
    }

    onSubmit(formData); // Pass form data to parent for deferred saving
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Update Subject" : "Add Subject"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="program"
            placeholder="Program"
            value={formData.program}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="subjectCode"
            placeholder="Subject Code"
            value={formData.subjectCode}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="yearLevel"
            placeholder="Year Level"
            value={formData.yearLevel}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />

          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white font-medium px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-800"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Subject;

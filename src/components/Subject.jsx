import React, { useState, useEffect } from "react";
import { collection, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

const Subject = ({ visible, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    program: "",
    subject: "",
    subjectCode: "",
    yearLevel: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const docSub = collection(db, "subjectList");
  const subRef = formData.subjectCode;

  async function addOrUpdateSubject() {
    try {
      if (!subRef) {
        setErrorMessage("Subject code cannot be empty.");
        return false;
      }

      if (initialData) {
        const oldSubjectCode = initialData.subjectCode;
        const newSubjectCode = subRef;

        if (oldSubjectCode !== newSubjectCode) {
          const newDocRef = doc(docSub, newSubjectCode);
          const newDocSnap = await getDoc(newDocRef);

          if (newDocSnap.exists()) {
            setErrorMessage("Subject code already exists.");
            return false;
          }


          await deleteDoc(doc(docSub, oldSubjectCode));
          await setDoc(newDocRef, formData);
          console.log("Subject updated with new subject code");
          return true;
        } else {

          await setDoc(doc(docSub, oldSubjectCode), formData);
          console.log("Subject updated successfully");
          return true;
        }
      } else {

        const docRef = doc(docSub, subRef);
        const docCheck = await getDoc(docRef);

        if (docCheck.exists()) {
          setErrorMessage("Subject already exists.");
          return false;
        }

        await setDoc(docRef, formData);
        console.log("Subject added successfully");
        return true;
      }
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message || "An error occurred");
      return false;
    }
  }

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

    setLoading(true);
    const success = await addOrUpdateSubject();
    setLoading(false);

    if (success) {
      onSubmit(formData);
      onClose();
    }
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-700 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-800 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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

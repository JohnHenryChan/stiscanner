import React, { useState, useEffect } from "react";

const AddInstructor = ({ visible, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setIdNumber(initialData.idNumber || "");
    } else {
      setName("");
      setIdNumber("");
    }
    setErrors({});
  }, [initialData]);

  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!idNumber.trim()) newErrors.idNumber = "ID Number is required.";
    if (!name.trim()) newErrors.name = "Name is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ name, idNumber });
    setName("");
    setIdNumber("");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white shadow-md rounded p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Instructor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">ID Number</label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 ${errors.idNumber ? "border-red-500" : ""}`}
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className={`w-full border rounded px-3 py-2 ${errors.name ? "border-red-500" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-800"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstructor;

import React from "react";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="text-[#005baa] text-3xl font-bold hover:underline transition"
          >
            ←
          </button>
        </div>

        <button className="text-sm text-[#005baa] hover:underline">
          Mark all as read
        </button>
      </div>
      <h1 className="text-3xl font-bold text-[#005baa]">Notifications</h1>
      {/* Today Section */}
      <div className="space-y-2">
        <p className="text-gray-600 font-semibold">Today</p>

        {/* Notification Items */}
        <div className="bg-green-50 border rounded-md p-4">
          <p className="text-red-600 font-semibold">
            Warning! Student absent for 3 days
          </p>
          <p className="text-sm text-gray-700">Juan D. Cruz, BSCS 101</p>
        </div>

        <div className="bg-green-50 border rounded-md p-4">
          <p className="text-gray-700">Professor has logged into the server</p>
        </div>
      </div>

      {/* Yesterday Section */}
      <div className="space-y-2 mt-6">
        <p className="text-gray-600 font-semibold">Yesterday</p>

        <div className="bg-green-50 border rounded-md p-4">
          <p className="text-red-600 font-semibold">
            Warning! Student absent for 3 days
          </p>
          <p className="text-sm text-gray-700">Diego D. Diega, BSCS 101</p>
        </div>

        <div className="bg-green-50 border rounded-md p-4">
          <p className="text-gray-700">
            Professor 1 has logged into the server
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notification;

import React from 'react';
import SidebarAdmin from '../global/SidebarAdmin';
import TopbarAdmin from '../global/TopbarAdmin';
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";

const StudentManagement = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
      <TopbarAdmin />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <SidebarAdmin />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl mb-4">Student Management</h1>

          {/* Search Bar and Add Button Container */}
          <div className="flex justify-between items-center mb-4">
            {/* Search Bar */}
            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md w-1/3">
              <MdSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="outline-none px-2 w-full"
              />
            </div>

            {/* Add student Button */}
            <button className="bg-[#0057A4] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#004080] transition">
              Add Student
            </button>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black px-4 py-2">Name</th>
                <th className="border border-black px-4 py-2">ID Number</th>
                <th className="border border-black px-4 py-2">Program</th>
                <th className="border border-black px-4 py-2">Contact Info</th>
                <th className="border border-black px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample Empty Rows */}
              {[...Array(8)].map((_, index) => (
                <tr key={index} className="border border-black">
                  <td className="border border-black px-4 py-2"></td>
                  <td className="border border-black px-4 py-2"></td>
                  <td className="border border-black px-4 py-2"></td>
                  <td className="border border-black px-4 py-2"></td>
                  <td className="border border-black px-4 py-2 text-center">
                    <button className="text-blue-600 hover:text-blue-800 mx-2">
                      <MdEdit size={20} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 mx-2">
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;

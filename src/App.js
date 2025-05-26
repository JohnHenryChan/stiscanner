import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./scenes/login";
import Dashboard from "./scenes/dashboard";
import AttendanceRecord from "./scenes/attendancerecord";
import Studentmanagement from "./scenes/studentmanagement";
import Teachermanagement from "./scenes/teachermanangement";
import Settings from "./scenes/settings";
import Helps from "./scenes/helpsupport";
import Admin from "./scenes/adminprofile";
import Notification from "./scenes/notification";
import Profilesettings from "./scenes/profilesettings";
import Subject from "./scenes/subjectmanagement";
import ClassList from "./scenes/classlist";
import StudentInformation from "./scenes/studentinfo";

function App() {
  const [auth, setAuth] = useState(false); // manages login state

  return (
    <div className="app">
      <main className="content">
        {auth ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendancerecord" element={<AttendanceRecord />} />
            <Route path="/studentmanagement" element={<Studentmanagement />} />
            <Route path="/teachermanagement" element={<Teachermanagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/helps" element={<Helps />} />
            
            {/* Subject Management */}
            <Route path="/subjectmanagement" element={<Subject />} />
            <Route path="/admin/subjects/:subjectId" element={<ClassList />} />
            
             <Route path="/students/:studentId" element={<StudentInformation />} /> 

            {/* Admin & Profile */}
            <Route path="/adminprofile" element={<Admin setAuth={setAuth} />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profilesettings" element={<Profilesettings />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            
            {/* Default route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;

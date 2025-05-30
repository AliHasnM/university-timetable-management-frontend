import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import SignupPage from "./pages/SignupPage/SignupPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";

import DashboardLayout from "./pages/Dashboard/Dashboard.jsx";
import DashboardHome from "./pages/Dashboard/DashboardHome .jsx";
import Instructors from "./pages/Instructors/Instructors.jsx";
import Courses from "./pages/Courses/Courses.jsx";
import Rooms from "./pages/Rooms/Rooms.jsx";
import Timetable from "./pages/Timetable/Timetable.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="courses" element={<Courses />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="timetable" element={<Timetable />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

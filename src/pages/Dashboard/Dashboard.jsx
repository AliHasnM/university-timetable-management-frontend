import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import usersAPIs from "../../services/usersAPIs";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaDoorOpen,
  FaCalendarAlt,
  FaUserGraduate,
  FaTachometerAlt,
} from "react-icons/fa";

const DashboardLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await usersAPIs.getUserProfile();
        console.log("User profile response:", response);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6 shadow-xl">
        <Link
          to="/dashboard"
          className="flex items-center mb-8 gap-2 text-3xl font-extrabold tracking-wide text-white hover:text-yellow-300 transition"
        >
          <FaTachometerAlt />
          Dashboard
        </Link>

        <nav className="space-y-4">
          {user?.role === "Admin" ? (
            <>
              <Link
                to="/dashboard/instructors"
                className="flex items-center gap-2 text-lg hover:text-yellow-300 transition"
              >
                <FaChalkboardTeacher />
                Instructors
              </Link>
              <Link
                to="/dashboard/courses"
                className="flex items-center gap-2 text-lg hover:text-yellow-300 transition"
              >
                <FaBookOpen />
                Courses
              </Link>
              <Link
                to="/dashboard/rooms"
                className="flex items-center gap-2 text-lg hover:text-yellow-300 transition"
              >
                <FaDoorOpen />
                Rooms
              </Link>
              <Link
                to="/dashboard/timetable"
                className="flex items-center gap-2 text-lg hover:text-yellow-300 transition"
              >
                <FaCalendarAlt />
                Timetable
              </Link>
            </>
          ) : user?.role === "Student" ? (
            <Link
              to="/dashboard/view-timetable"
              className="flex items-center gap-2 text-lg hover:text-yellow-300 transition"
            >
              <FaUserGraduate />
              View Timetable
            </Link>
          ) : null}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default DashboardLayout;

/* eslint-disable no-unused-vars */
import { useOutletContext } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaUserTag } from "react-icons/fa";
import { motion } from "framer-motion";

const DashboardHome = () => {
  const { user } = useOutletContext();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-gray-500 animate-pulse">
          Loading user profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 py-10 px-4 flex justify-center items-center">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <FaUserCircle className="text-blue-600 text-6xl mb-2" />

          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username}!
          </h1>

          <div className="w-full text-left mt-4 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <FaEnvelope className="text-blue-500" />
              <span className="font-medium">Email:</span>
              <span className="text-gray-600">{user.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <FaUserTag className="text-purple-500" />
              <span className="font-medium">Role:</span>
              <span className="text-gray-600">{user.role}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;

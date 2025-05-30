import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-blue-900/30"></div>

      {/* Centered content box with semi-transparent bg */}
      <div className="relative z-10 max-w-3xl bg-black/60 rounded-lg p-10 text-center shadow-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Welcome to{" "}
          <span className="text-yellow-400">
            University Timetable Management
          </span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          Streamline your schedule, manage courses, and optimize room bookings —
          all in one place.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full text-lg shadow-lg hover:bg-yellow-300 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;

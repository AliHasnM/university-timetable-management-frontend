import React, { useState } from "react";

const initialTimetable = [
  {
    id: 1,
    course: "Math 101",
    instructor: "Dr. Ali",
    room: "Room A101",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
  },
  {
    id: 2,
    course: "Physics 201",
    instructor: "Prof. Sara",
    room: "Room B202",
    day: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
  },
  // Add more sample data as needed
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ITEMS_PER_PAGE = 10;

const Timetable = () => {
  const [timetable, setTimetable] = useState(initialTimetable);
  const [form, setForm] = useState({
    course: "",
    instructor: "",
    room: "",
    day: "",
    startTime: "",
    endTime: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
      course: "",
      instructor: "",
      room: "",
      day: "",
      startTime: "",
      endTime: "",
    });
    setEditId(null);
    setError("");
  };

  const validateForm = () => {
    const { course, instructor, room, day, startTime, endTime } = form;
    if (!course || !instructor || !room || !day || !startTime || !endTime) {
      setError("All fields are required.");
      return false;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editId) {
      setTimetable((prev) =>
        prev.map((entry) =>
          entry.id === editId ? { id: editId, ...form } : entry
        )
      );
    } else {
      const newEntry = { id: Date.now(), ...form };
      setTimetable((prev) => [...prev, newEntry]);
    }
    resetForm();
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    const entry = timetable.find((t) => t.id === id);
    if (entry) {
      setForm({
        course: entry.course,
        instructor: entry.instructor,
        room: entry.room,
        day: entry.day,
        startTime: entry.startTime,
        endTime: entry.endTime,
      });
      setEditId(id);
      setError("");
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this timetable entry?")
    ) {
      setTimetable((prev) => prev.filter((t) => t.id !== id));
      if (editId === id) resetForm();

      const lastPage = Math.ceil((timetable.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    }
  };

  // Pagination
  const totalPages = Math.ceil(timetable.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = timetable.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold pt-10 mb-8 text-blue-800">
        Manage Timetable
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Entry" : "Add New Entry"}
        </h2>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="course"
            placeholder="Course Name"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.course}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="instructor"
            placeholder="Instructor Name"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.instructor}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="room"
            placeholder="Room"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.room}
            onChange={handleInputChange}
          />
          <select
            name="day"
            value={form.day}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Day</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Timetable Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Course</th>
              <th className="py-3 px-6 text-left">Instructor</th>
              <th className="py-3 px-6 text-left">Room</th>
              <th className="py-3 px-6 text-left">Day</th>
              <th className="py-3 px-6 text-left">Start Time</th>
              <th className="py-3 px-6 text-left">End Time</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No timetable entries found. Please add some.
                </td>
              </tr>
            ) : (
              currentItems.map(
                ({ id, course, instructor, room, day, startTime, endTime }) => (
                  <tr key={id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">{course}</td>
                    <td className="py-3 px-6">{instructor}</td>
                    <td className="py-3 px-6">{room}</td>
                    <td className="py-3 px-6">{day}</td>
                    <td className="py-3 px-6">{startTime}</td>
                    <td className="py-3 px-6">{endTime}</td>
                    <td className="py-3 px-6 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(id)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === idx + 1
                  ? "bg-blue-800 text-white"
                  : "bg-blue-200 hover:bg-blue-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Timetable;

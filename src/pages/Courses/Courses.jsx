import React, { useState } from "react";

const initialCourses = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Sarah Khan",
  },
  { id: 2, title: "Calculus I", code: "MATH101", instructor: "Prof. Ali Raza" },
  {
    id: 3,
    title: "Physics I",
    code: "PHY101",
    instructor: "Dr. Nadia Hussain",
  },
  {
    id: 4,
    title: "Organic Chemistry",
    code: "CHEM201",
    instructor: "Prof. Omar Sheikh",
  },
  {
    id: 5,
    title: "Biology Basics",
    code: "BIO101",
    instructor: "Dr. Ayesha Malik",
  },
  {
    id: 6,
    title: "Microeconomics",
    code: "ECO101",
    instructor: "Prof. Kamran Javed",
  },
  {
    id: 7,
    title: "World History",
    code: "HIST101",
    instructor: "Dr. Fahad Iqbal",
  },
  {
    id: 8,
    title: "Political Science",
    code: "POL101",
    instructor: "Prof. Sana Mir",
  },
  {
    id: 9,
    title: "Philosophy 101",
    code: "PHIL101",
    instructor: "Dr. Asad Rafiq",
  },
  {
    id: 10,
    title: "English Literature",
    code: "LIT101",
    instructor: "Prof. Zara Shah",
  },
  {
    id: 11,
    title: "Psychology Basics",
    code: "PSY101",
    instructor: "Dr. Imran Ali",
  },
  // add more if you want
];

const ITEMS_PER_PAGE = 10;

const Courses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [form, setForm] = useState({ title: "", code: "", instructor: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: "", code: "", instructor: "" });
    setEditId(null);
    setError("");
  };

  const validateForm = () => {
    if (!form.title || !form.code || !form.instructor) {
      setError("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editId) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editId ? { id: editId, ...form } : course
        )
      );
    } else {
      const newCourse = {
        id: Date.now(),
        ...form,
      };
      setCourses((prev) => [...prev, newCourse]);
    }
    resetForm();
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setForm({
        title: course.title,
        code: course.code,
        instructor: course.instructor,
      });
      setEditId(id);
      setError("");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      if (editId === id) resetForm();

      const lastPage = Math.ceil((courses.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    }
  };

  // Pagination
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = courses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold pt-10 mb-8 text-green-800">
        Manage Courses
      </h1>

      {/* Course Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Course" : "Add New Course"}
        </h2>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="code"
            placeholder="Course Code"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.code}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="instructor"
            placeholder="Instructor"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.instructor}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition"
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

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Course Title</th>
              <th className="py-3 px-6 text-left">Course Code</th>
              <th className="py-3 px-6 text-left">Instructor</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No courses found. Please add some.
                </td>
              </tr>
            ) : (
              currentItems.map(({ id, title, code, instructor }) => (
                <tr key={id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{title}</td>
                  <td className="py-3 px-6">{code}</td>
                  <td className="py-3 px-6">{instructor}</td>
                  <td className="py-3 px-6 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(id)}
                      className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-semibold px-3 py-1 rounded transition"
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
              ))
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
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2 font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Courses;

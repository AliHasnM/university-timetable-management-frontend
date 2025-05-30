import React, { useState } from "react";

const initialInstructors = [
  {
    id: 1,
    name: "Dr. Sarah Khan",
    email: "sarah.khan@university.edu",
    department: "Computer Science",
  },
  {
    id: 2,
    name: "Prof. Ali Raza",
    email: "ali.raza@university.edu",
    department: "Mathematics",
  },
  {
    id: 3,
    name: "Dr. Nadia Hussain",
    email: "nadia.hussain@university.edu",
    department: "Physics",
  },
  {
    id: 4,
    name: "Prof. Omar Sheikh",
    email: "omar.sheikh@university.edu",
    department: "Chemistry",
  },
  {
    id: 5,
    name: "Dr. Ayesha Malik",
    email: "ayesha.malik@university.edu",
    department: "Biology",
  },
  {
    id: 6,
    name: "Prof. Kamran Javed",
    email: "kamran.javed@university.edu",
    department: "Economics",
  },
  {
    id: 7,
    name: "Dr. Fahad Iqbal",
    email: "fahad.iqbal@university.edu",
    department: "History",
  },
  {
    id: 8,
    name: "Prof. Sana Mir",
    email: "sana.mir@university.edu",
    department: "Political Science",
  },
  {
    id: 9,
    name: "Dr. Asad Rafiq",
    email: "asad.rafiq@university.edu",
    department: "Philosophy",
  },
  {
    id: 10,
    name: "Prof. Zara Shah",
    email: "zara.shah@university.edu",
    department: "Literature",
  },
  {
    id: 11,
    name: "Dr. Imran Ali",
    email: "imran.ali@university.edu",
    department: "Psychology",
  },
  // add more if you want
];

const ITEMS_PER_PAGE = 10;

const Instructors = () => {
  const [instructors, setInstructors] = useState(initialInstructors);
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", department: "" });
    setEditId(null);
    setError("");
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.department) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editId) {
      setInstructors((prev) =>
        prev.map((inst) =>
          inst.id === editId ? { id: editId, ...form } : inst
        )
      );
    } else {
      const newInstructor = {
        id: Date.now(),
        ...form,
      };
      setInstructors((prev) => [...prev, newInstructor]);
    }
    resetForm();
    setCurrentPage(1); // reset to first page on add/update
  };

  const handleEdit = (id) => {
    const instructor = instructors.find((inst) => inst.id === id);
    if (instructor) {
      setForm({
        name: instructor.name,
        email: instructor.email,
        department: instructor.department,
      });
      setEditId(id);
      setError("");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      setInstructors((prev) => prev.filter((inst) => inst.id !== id));
      if (editId === id) resetForm();

      // Adjust current page if deleting last item on last page
      const lastPage = Math.ceil((instructors.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(instructors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = instructors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold pt-10 mb-8 text-blue-800">
        Manage Instructors
      </h1>

      {/* Instructor Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Instructor" : "Add New Instructor"}
        </h2>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.department}
            onChange={handleInputChange}
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

      {/* Instructors Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Department</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No instructors found. Please add some.
                </td>
              </tr>
            ) : (
              currentItems.map(({ id, name, email, department }) => (
                <tr key={id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{name}</td>
                  <td className="py-3 px-6">{email}</td>
                  <td className="py-3 px-6">{department}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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

export default Instructors;

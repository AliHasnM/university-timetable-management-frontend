import React, { useState } from "react";

const initialRooms = [
  { id: 1, name: "Room A101", capacity: 30, location: "Building A, 1st Floor" },
  { id: 2, name: "Room B202", capacity: 50, location: "Building B, 2nd Floor" },
  { id: 3, name: "Room C303", capacity: 20, location: "Building C, 3rd Floor" },
  { id: 4, name: "Room D404", capacity: 40, location: "Building D, 4th Floor" },
  { id: 5, name: "Room E505", capacity: 25, location: "Building E, 5th Floor" },
  { id: 6, name: "Room F606", capacity: 35, location: "Building F, 6th Floor" },
  { id: 7, name: "Room G707", capacity: 45, location: "Building G, 7th Floor" },
  { id: 8, name: "Room H808", capacity: 60, location: "Building H, 8th Floor" },
  { id: 9, name: "Room I909", capacity: 15, location: "Building I, 9th Floor" },
  {
    id: 10,
    name: "Room J010",
    capacity: 55,
    location: "Building J, Ground Floor",
  },
  {
    id: 11,
    name: "Room K111",
    capacity: 30,
    location: "Building K, 1st Floor",
  },
];

const ITEMS_PER_PAGE = 10;

const Rooms = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [form, setForm] = useState({ name: "", capacity: "", location: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({ name: "", capacity: "", location: "" });
    setEditId(null);
    setError("");
  };

  const validateForm = () => {
    if (!form.name || !form.capacity || !form.location) {
      setError("All fields are required.");
      return false;
    }
    if (isNaN(form.capacity) || parseInt(form.capacity) <= 0) {
      setError("Capacity must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editId) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === editId
            ? { id: editId, ...form, capacity: parseInt(form.capacity) }
            : room
        )
      );
    } else {
      const newRoom = {
        id: Date.now(),
        name: form.name,
        capacity: parseInt(form.capacity),
        location: form.location,
      };
      setRooms((prev) => [...prev, newRoom]);
    }
    resetForm();
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    const room = rooms.find((r) => r.id === id);
    if (room) {
      setForm({
        name: room.name,
        capacity: room.capacity.toString(),
        location: room.location,
      });
      setEditId(id);
      setError("");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
      if (editId === id) resetForm();

      const lastPage = Math.ceil((rooms.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    }
  };

  // Pagination
  const totalPages = Math.ceil(rooms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = rooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold pt-10 mb-8 text-blue-800">
        Manage Rooms
      </h1>

      {/* Room Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Room" : "Add New Room"}
        </h2>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Room Name (e.g. Room A101)"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.capacity}
            onChange={handleInputChange}
            min="1"
          />
          <input
            type="text"
            name="location"
            placeholder="Location (e.g. Building A, 1st Floor)"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.location}
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

      {/* Rooms Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Room Name</th>
              <th className="py-3 px-6 text-left">Capacity</th>
              <th className="py-3 px-6 text-left">Location</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No rooms found. Please add some.
                </td>
              </tr>
            ) : (
              currentItems.map(({ id, name, capacity, location }) => (
                <tr key={id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{name}</td>
                  <td className="py-3 px-6">{capacity}</td>
                  <td className="py-3 px-6">{location}</td>
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

export default Rooms;

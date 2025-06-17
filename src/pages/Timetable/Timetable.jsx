/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  getTimetable,
  downloadTimetablePDF,
  sendTimetableEmailToAll,
  // generateTimetable,
  editTimetableEntry,
} from "../../services/timetableAPIs";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import TimetableModalForm from "../../components/TimetableModalForm/TimetableModalForm";

const ITEMS_PER_PAGE = 10;

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    shift: "",
  });

  const fetchTimetable = async () => {
    const { department, semester, shift } = filters;

    if (!department || !semester || !shift) {
      console.warn("Missing department, semester, or shift");
      setTimetable([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getTimetable(filters); // calls backend
      console.log("Fetched timetable:", response.data);

      // Handle the correct API response structure
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.schedule)
      ) {
        setTimetable(response.data.data.schedule);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        setTimetable(response.data.data);
      } else if (response.data && Array.isArray(response.data.schedule)) {
        setTimetable(response.data.schedule);
      } else if (response.data && Array.isArray(response.data)) {
        setTimetable(response.data);
      } else {
        setTimetable([]);
        console.warn("No schedule data found in response:", response.data);
      }

      // Show message if schedule is empty
      if (response.data?.data?.schedule?.length === 0) {
        setError(
          "No timetable entries found for the selected filters. Please generate a timetable first."
        );
      }
    } catch (error) {
      console.error("Error fetching timetable:", error.message);
      setError(error.message);
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.department && filters.semester && filters.shift) {
      fetchTimetable();
    } else {
      setTimetable([]);
    }
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEditEntry = async (entryId, updateData) => {
    try {
      setLoading(true);
      setError("");
      await editTimetableEntry(entryId, updateData);
      alert("Timetable entry updated successfully!");

      // Refresh the timetable data after edit
      await fetchTimetable();
      setEditingEntry(null);
    } catch (err) {
      alert("Failed to edit timetable entry: " + err.message);
      console.error("Error editing timetable entry:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToStudents = async () => {
    try {
      setLoading(true);
      setError("");
      await sendTimetableEmailToAll();
      alert("Timetable sent to students successfully!");
    } catch (err) {
      alert("Failed to send timetable: " + err.message);
      console.error("Error sending timetable:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!filters) {
        alert("No filter selected");
        return;
      }

      const { department, semester, shift } = filters;

      const result = await downloadTimetablePDF({
        department,
        semester,
        shift,
      });

      const blob = result.blob;
      const filename = result.filename || "timetable.pdf";

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download PDF: " + (err.message || "Unknown error"));
    }
  };

  const handleExportExcel = () => {
    try {
      if (filteredItems.length === 0) {
        alert("No data to export");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(filteredItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
      XLSX.writeFile(workbook, "timetable.xlsx");
    } catch (err) {
      alert("Failed to export Excel file: " + err.message);
      console.error("Error exporting Excel:", err);
    }
  };

  const filteredItems = timetable;

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold pt-10 mb-6 text-blue-800">
        Manage Timetable
      </h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <input
          type="text"
          name="department"
          placeholder="Filter by Department"
          value={filters.department}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="semester"
          placeholder="Filter by Semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="shift"
          placeholder="Filter by Shift"
          value={filters.shift}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={() => fetchTimetable()}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Generate Timetable
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={loading || filteredItems.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
        <button
          onClick={handleExportExcel}
          disabled={loading || filteredItems.length === 0}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Export to Excel
        </button>
        <button
          onClick={handleSendToStudents}
          disabled={loading || filteredItems.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send to Students"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <TimetableModalForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={(formData) => {
            setFilters(formData); // ✅ yahan save ho gaya
            fetchTimetable(formData); // agar table bhi render karni ho
          }}
        />
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Timetable Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Code</th>
              <th className="py-3 px-4 text-left">Instructor</th>
              <th className="py-3 px-4 text-left">Room</th>
              <th className="py-3 px-4 text-left">Day</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Credits</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-500">
                  {loading
                    ? "Loading..."
                    : error
                    ? error
                    : "No timetable entries found. Please generate a timetable first or check your filters."}
                </td>
              </tr>
            ) : (
              currentItems.map((entry) => (
                <tr
                  key={entry.id || entry._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{entry.classes[0]?.courseName}</td>
                  <td className="py-3 px-4">{entry.classes[0]?.courseCode}</td>
                  <td className="py-3 px-4">
                    {entry.classes[0].instructorName}
                  </td>
                  <td className="py-3 px-4">{entry.classes[0]?.roomNumber}</td>
                  <td className="py-3 px-4">{entry.day}</td>
                  <td className="py-3 px-4">{entry.classes[0]?.timeSlot}</td>
                  <td className="py-3 px-4">{entry.classes[0]?.creditHours}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-sm"
                      disabled={loading}
                    >
                      Edit
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
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${
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
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Timetable Entry</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updateData = Object.fromEntries(formData.entries());
                handleEditEntry(
                  editingEntry.id || editingEntry._id,
                  updateData
                );
              }}
            >
              <div className="space-y-4">
                <input
                  name="courseName"
                  defaultValue={editingEntry.courseName}
                  placeholder="Course Name"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  name="courseCode"
                  defaultValue={editingEntry.courseCode}
                  placeholder="Course Code"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  name="instructorName"
                  defaultValue={editingEntry.instructorName}
                  placeholder="Instructor Name"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  name="roomNumber"
                  defaultValue={editingEntry.roomNumber}
                  placeholder="Room Number"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <select
                  name="day"
                  defaultValue={editingEntry.day}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
                <input
                  name="timeSlot"
                  defaultValue={editingEntry.timeSlot}
                  placeholder="Time Slot (e.g., 09:00-10:00)"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
                <input
                  name="creditHours"
                  type="number"
                  defaultValue={editingEntry.creditHours}
                  placeholder="Credit Hours"
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;

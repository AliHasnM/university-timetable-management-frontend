/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  getStudentTimetable,
  downloadStudentTimetablePDF,
} from "../../services/timetableAPIs";
import "jspdf-autotable";
import * as XLSX from "xlsx";
const ITEMS_PER_PAGE = 10;

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    department: "",
    semester: "",
    shift: "",
  });

  const fetchTimetable = async () => {
    const { department, semester, shift } = filters;
    console.log("Fetching timetable with filters:", filters);
    // Validate filters
    if (!department || !semester || !shift) {
      console.warn("Missing department, semester, or shift");
      setTimetable([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getStudentTimetable(filters); // calls backend
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
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    console.log("Updated Filters:", newFilters); // ✅ Check this in console
  };

  const handleDownloadPDF = async () => {
    try {
      if (!filters) {
        alert("No filter selected");
        return;
      }

      const { department, semester, shift } = filters;

      const result = await downloadStudentTimetablePDF({
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

  const handleExportExcel = ({ department, semester, shift }) => {
    try {
      if (!filteredItems || filteredItems.length === 0) {
        alert("No timetable data found to export.");
        return;
      }

      // ✅ Flatten timetable data
      const flattenedData = filteredItems.flatMap((dayBlock) =>
        dayBlock.classes.map((cls, index) => ({
          "Sr No": index + 1,
          Day: dayBlock.day,
          "Course Code": cls.courseCode,
          "Course Name": cls.courseName,
          "Time Slot": cls.timeSlot,
          "Instructor Name": cls.instructorName,
          "Room No": cls.roomNumber,
          "Credit Hours": cls.creditHours || "",
        }))
      );

      if (flattenedData.length === 0) {
        alert("No classes found to export.");
        return;
      }

      // ✅ Step 1: Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(flattenedData, {
        origin: "A6", // Data will start from A6
      });

      // ✅ Step 2: Add title and metadata rows
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          ["University Class Timetable"], // A1
          [], // A2 (blank)
          [
            `Department: ${department}`,
            `Semester: ${semester}`,
            `Shift: ${shift}`,
          ], // A3
          [], // A4 (blank)
        ],
        { origin: "A1" }
      );

      // ✅ Step 3: Style enhancements
      worksheet["!cols"] = [
        { wch: 8 }, // Sr No
        { wch: 12 }, // Day
        { wch: 14 }, // Course Code
        { wch: 30 }, // Course Name
        { wch: 16 }, // Time Slot
        { wch: 25 }, // Instructor Name
        { wch: 10 }, // Room No
        { wch: 14 }, // Credit Hours
      ];

      // ✅ Step 4: Create and save workbook
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
        View Timetable
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
          onClick={handleDownloadPDF}
          disabled={loading || filteredItems.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
        <button
          onClick={() =>
            handleExportExcel({
              department: filters.department,
              semester: filters.semester,
              shift: filters.shift,
            })
          }
          disabled={loading || filteredItems.length === 0}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Export Excel
        </button>
      </div>

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
                    : "No timetable entries found. Please check your filters."}
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
    </div>
  );
};

export default StudentTimetable;

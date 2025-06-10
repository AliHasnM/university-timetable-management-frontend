import React, { useEffect, useState } from "react";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../../services/coursesAPIs";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal/Modal";
import DeleteConfirmModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { handleSubmit, reset, setValue, register } = useForm({
    defaultValues: {
      courseName: "",
      courseCode: "",
      creditHours: "",
      classType: "Lecture",
      semester: "",
      department: "",
      status: "Active",
    },
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getAllCourses();
      setCourses(res?.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddNew = () => {
    reset({
      courseName: "",
      courseCode: "",
      creditHours: "",
      classType: "Lecture",
      semester: "",
      department: "",
      status: "Active",
    });
    setEditId(null);
    setModalOpen(true);
  };

  const handleEdit = (course) => {
    setEditId(course._id);
    setValue("courseName", course.courseName || "");
    setValue("courseCode", course.courseCode || "");
    setValue("creditHours", course.creditHours || "");
    setValue("classType", course.classType || "Lecture");
    setValue("semester", course.semester || "");
    setValue("department", course.department || "");
    setValue("status", course.status || "Active");
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editId) {
        await updateCourse(editId, data);
      } else {
        await createCourse(data);
      }
      reset();
      setEditId(null);
      setModalOpen(false);
      fetchCourses();
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save course."
      );
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mt-8 mb-4">Course Management</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by course name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-md w-full max-w-sm"
        />
        <button
          onClick={handleAddNew}
          className="ml-4 bg-blue-600 font-semibold text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Course
        </button>
      </div>

      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 border-r text-sm font-semibold uppercase ">
                Course Name
              </th>
              <th className="py-2 px-4 border-r text-sm font-semibold uppercase">
                Course Code
              </th>
              <th className="py-2 px-4 border-r text-sm font-semibold uppercase">
                Credit Hours
              </th>
              <th className="py-2 px-4 border-r text-sm font-semibold uppercase">
                Semester
              </th>
              <th className="py-2 px-4 border-r text-sm font-semibold uppercase">
                Department
              </th>
              <th className="py-2 px-4 border-r text-sm font-semibold uppercase">
                Class Type
              </th>
              <th className="py-2 px-4 border-r text-sm font-semibold uppercase">
                Status
              </th>
              <th className="py-2 px-4 text-sm font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCourses.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No courses found.
                </td>
              </tr>
            ) : (
              paginatedCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{course.courseName}</td>
                  <td className="border px-4 py-2">{course.courseCode}</td>
                  <td className="border px-4 py-2">{course.creditHours}</td>
                  <td className="border px-4 py-2">{course.semester}</td>
                  <td className="border px-4 py-2">{course.department}</td>
                  <td className="border px-4 py-2">{course.classType}</td>
                  <td className="border px-4 py-2">{course.status}</td>
                  <td className="border px-4 py-2 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(course._id);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 m-2 text-white px-3 py-1 rounded hover:bg-red-600"
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

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Update Course" : "Add Course"}
        </h2>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Course Name</label>
              <input
                {...register("courseName", { required: true })}
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Course Name"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Course Code</label>
              <input
                {...register("courseCode", { required: true })}
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Course Code"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Credit Hours</label>
              <input
                {...register("creditHours", { required: true })}
                className="w-full border p-2 rounded"
                type="number"
                placeholder="Credit Hours"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Class Type</label>
              <select
                {...register("classType")}
                className="w-full border p-2 rounded"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Semester</label>
              <input
                {...register("semester", { required: true })}
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Semester"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Department</label>
              <input
                {...register("department", { required: true })}
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Department"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                {...register("status")}
                className="w-full border p-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  reset();
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CoursesPage;

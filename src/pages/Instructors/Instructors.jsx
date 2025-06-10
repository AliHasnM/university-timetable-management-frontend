import React, { useEffect, useState } from "react";
import {
  createInstructor,
  getAllInstructors,
  updateInstructor,
  deleteInstructor,
} from "../../services/instructorsAPIs";

import { useForm, useFieldArray } from "react-hook-form";
import Modal from "../../components/Modal/Modal";

import { getAllCourses } from "../../services/coursesAPIs";

import DeleteConfirmModal from "../../components/DeleteConfirmationModal/DeleteConfirmationModal";

// Days of the week options
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const InstructorPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subjects: [],
      availability: [{ day: "", timeSlots: [""] }],
    },
  });

  // Manage dynamic availability fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  // Fetch instructors
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const res = await getAllInstructors();
      setInstructors(res?.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      const res = await getAllCourses();
      setSubjects(res?.data || []);
    } catch (err) {
      setError("Failed to fetch subjects", err);
    }
  };

  useEffect(() => {
    fetchInstructors();
    fetchSubjects();
  }, []);

  // Prefill form for editing an instructor
  const handleEdit = (instructor) => {
    setEditId(instructor._id);
    setValue("name", instructor.name || "");
    setValue("email", instructor.email || "");
    setValue(
      "subjects",
      instructor.subjects?.map((s) => (typeof s === "string" ? s : s._id)) || []
    );
    setValue(
      "availability",
      instructor.availability?.length
        ? instructor.availability
        : [{ day: "", timeSlots: [""] }]
    );
    setModalOpen(true);
  };

  // Reset form and open modal for new instructor
  const handleAddNew = () => {
    reset({
      name: "",
      email: "",
      subjects: [],
      availability: [{ day: "", timeSlots: [""] }],
    });
    setEditId(null);
    setModalOpen(true);
  };

  // Handle form submit for create or update
  const onSubmit = async (data) => {
    try {
      // Clean availability by removing empty time slots
      const formattedData = {
        ...data,
        availability: data.availability.map((slot) => ({
          day: slot.day,
          timeSlots: slot.timeSlots.filter(Boolean),
        })),
      };

      if (editId) {
        await updateInstructor(editId, formattedData);
      } else {
        await createInstructor(formattedData);
      }

      reset();
      setEditId(null);
      setModalOpen(false);
      fetchInstructors();
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save instructor."
      );
    }
  };

  // Handle delete instructor
  const handleDelete = async () => {
    try {
      await deleteInstructor(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchInstructors();
    } catch (err) {
      setError(err.message);
    }
  };

  // Pagination and search filter
  const filteredInstructors = instructors.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mt-8 mb-6 text-gray-800">
        Instructor Management
      </h1>

      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-500 rounded-md p-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
        >
          Add Instructor
        </button>
      </div>

      {loading && <p>Loading instructors...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto border rounded-md shadow">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Subjects
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedInstructors.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No instructors found.
                </td>
              </tr>
            )}
            {paginatedInstructors.map((instructor) => (
              <tr
                key={instructor._id}
                className="hover:bg-blue-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                  {instructor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {instructor.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {instructor.subjects
                    ?.map((s) =>
                      typeof s === "string"
                        ? s
                        : s.courseName || s.name || s._id
                    )
                    .join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {instructor.availability?.map((a, index) => (
                    <div key={index}>
                      <strong>{a.day}:</strong> {a.timeSlots?.join(", ")}
                    </div>
                  ))}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(instructor)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(instructor._id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 m-2 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-blue-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal code remains the same */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Update Instructor" : "Add Instructor"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-auto"
        >
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Subjects multi-select */}
          <div>
            <label className="block mb-1 font-medium">Subjects</label>
            <select
              multiple
              {...register("subjects", {
                required: "Select at least one subject",
              })}
              className="w-full p-2 border rounded"
              size={subjects.length > 5 ? 5 : subjects.length}
              style={{ height: "auto" }}
            >
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.courseName || subject.name || subject._id}
                </option>
              ))}
            </select>

            {errors.subjects && (
              <p className="text-red-600 text-sm mt-1">
                {errors.subjects.message}
              </p>
            )}
          </div>

          {/* Availability */}
          <div>
            <label className="block mb-1 font-medium">Availability</label>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded p-3 mb-3 space-y-2 bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <select
                    {...register(`availability.${index}.day`, {
                      required: "Select a day",
                    })}
                    className="p-2 border rounded flex-1"
                    defaultValue={field.day || ""}
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>

                {/* Time slots */}
                <TimeSlotsInput
                  control={control}
                  index={index}
                  register={register}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ day: "", timeSlots: [""] })}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Availability
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Component for managing multiple time slots inside each availability day
const TimeSlotsInput = ({ control, index, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `availability.${index}.timeSlots`,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div key={field.id} className="flex items-center gap-2">
          <input
            type="time"
            {...register(`availability.${index}.timeSlots.${i}`, {
              required: "Time slot is required",
            })}
            className="p-2 border rounded flex-1"
            placeholder="Time slot (e.g. 9am - 11am)"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append("")}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        Add Time Slot
      </button>
    </div>
  );
};

export default InstructorPage;

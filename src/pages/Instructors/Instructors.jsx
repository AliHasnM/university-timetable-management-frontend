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
    // Map subjects: either strings or objects with _id
    setValue(
      "subjects",
      instructor.subjects?.map((s) => (typeof s === "string" ? s : s._id)) || []
    );
    // If availability is empty, initialize with one empty slot
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mt-8 mb-4">Instructor Management</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-md w-full max-w-sm"
        />
        <button
          onClick={handleAddNew}
          className="ml-4 bg-blue-600 font-semibold text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Instructor
        </button>
      </div>

      {loading && <p>Loading instructors...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {paginatedInstructors.map((instructor) => (
          <div
            key={instructor._id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded shadow"
          >
            <div>
              <p className="font-semibold">{instructor.name}</p>
              <p className="text-gray-600">{instructor.email}</p>
              <p className="text-sm mt-1">
                Subjects:{" "}
                {instructor.subjects
                  ?.map((s) => (typeof s === "string" ? s : s.name || s._id))
                  .join(", ")}
              </p>
            </div>
            <div className="space-x-2">
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
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Subjects (multi-select) */}
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
              <p className="text-red-500 text-sm mt-1">
                {errors.subjects.message}
              </p>
            )}
          </div>

          {/* Availability (dynamic) */}
          <div>
            <label className="block mb-1 font-medium">Availability</label>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 p-2 border rounded bg-gray-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <select
                    {...register(`availability.${index}.day`, {
                      required: "Day is required",
                    })}
                    className="p-2 border rounded flex-grow"
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
                    className="text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100"
                  >
                    Remove Day
                  </button>
                </div>

                <TimeSlotsControl
                  control={control}
                  index={index}
                  register={register}
                  errors={errors}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ day: "", timeSlots: [""] })}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Add Availability Day
            </button>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setModalOpen(false);
                setEditId(null);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Component to manage multiple time slots for a day
const TimeSlotsControl = ({ control, index, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `availability.${index}.timeSlots`,
  });

  return (
    <div>
      {fields.map((field, idx) => (
        <div key={field.id} className="flex items-center gap-2 mb-2">
          <input
            type="time"
            {...register(`availability.${index}.timeSlots.${idx}`, {
              required: "Time slot is required",
            })}
            className="p-2 border rounded flex-grow"
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            className="text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append("")}
        className="text-green-700 font-semibold text-sm hover:underline"
      >
        + Add Time Slot
      </button>
      {/* Errors for timeSlots can be shown here */}
    </div>
  );
};

export default InstructorPage;

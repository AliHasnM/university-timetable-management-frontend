// Import at top
import React, { useEffect, useState } from "react";
import {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from "../../services/roomsAPIs";
import { useForm, useFieldArray } from "react-hook-form";
import Modal from "../../components/Modal/Modal";
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

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { handleSubmit, reset, register, control } = useForm({
    defaultValues: {
      roomNumber: "",
      roomType: "Room",
      capacity: "",
      location: "Main Campus",
      equipment: "Lecture",
      isActive: true,
      availability: [{ day: "", timeSlots: [""] }],
    },
  });

  const {
    fields: availabilityFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "availability",
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getAllRooms();
      setRooms(res?.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddNew = () => {
    reset();
    setEditId(null);
    setModalOpen(true);
  };

  const handleEdit = (room) => {
    setEditId(room._id);
    reset({
      ...room,
      availability: room.availability.length
        ? room.availability
        : [{ day: "", timeSlots: [""] }],
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteRoom(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editId) {
        await updateRoom(editId, data);
      } else {
        await createRoom(data);
      }
      reset();
      setEditId(null);
      setModalOpen(false);
      fetchRooms();
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save room."
      );
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mt-8 mb-4">Room Management</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by room number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-md w-full max-w-sm"
        />
        <button
          onClick={handleAddNew}
          className="ml-4 bg-blue-600 font-semibold text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Room
        </button>
      </div>

      {loading && <p>Loading rooms...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Room Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Equipment
              </th>{" "}
              {/* NEW */}
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Active
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Availability
              </th>{" "}
              {/* NEW */}
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedRooms.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No rooms found.
                </td>
              </tr>
            ) : (
              paginatedRooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{room.roomNumber}</td>
                  <td className="border px-4 py-2">{room.roomType}</td>
                  <td className="border px-4 py-2">{room.capacity}</td>
                  <td className="border px-4 py-2">{room.location}</td>
                  <td className="border px-4 py-2">{room.equipment}</td>{" "}
                  {/* NEW */}
                  <td className="border px-4 py-2">
                    {room.isActive ? "Yes" : "No"}
                  </td>
                  <td className="border px-4 py-2 text-sm whitespace-pre-line">
                    {room.availability && room.availability.length > 0
                      ? room.availability
                          .map(
                            (slot) =>
                              `${slot.day}: ${slot.timeSlots
                                .filter(Boolean)
                                .join(", ")}`
                          )
                          .join("\n")
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(room)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(room._id);
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

      {/* Pagination */}
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

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Update Room" : "Add Room"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div>
            <label className="block mb-1 font-medium">Room Number</label>
            <input
              {...register("roomNumber", { required: true })}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Room Type</label>
            <select
              {...register("roomType")}
              className="w-full border p-2 rounded"
            >
              <option value="Room">Room</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Seminar Room">Seminar Room</option>
              <option value="Computer Lab">Computer Lab</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Capacity</label>
            <input
              {...register("capacity", { required: true })}
              className="w-full border p-2 rounded"
              type="number"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <select
              {...register("location")}
              className="w-full border p-2 rounded"
            >
              <option value="Main Campus">Main Campus</option>
              <option value="Sub Campus">Sub Campus</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Equipment</label>
            <select
              {...register("equipment")}
              className="w-full border p-2 rounded"
            >
              <option value="Lecture">Lecture</option>
              <option value="Lab">Lab</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Active Status</label>
            <select
              {...register("isActive")}
              className="w-full border p-2 rounded"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          {/* Availability Field */}
          <div>
            <label className="block mb-1 font-medium">Availability</label>
            {availabilityFields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 p-3 border rounded bg-gray-50"
              >
                <div className="flex gap-2 mb-2">
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
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Remove
                  </button>
                </div>

                {/* Nested Time Slots */}
                <div className="space-y-2">
                  {field.timeSlots?.map((_, timeIndex) => (
                    <div key={timeIndex} className="flex gap-2">
                      <input
                        type="time"
                        {...register(
                          `availability.${index}.timeSlots.${timeIndex}`
                        )}
                        placeholder="Time Slot (e.g., 9:00-10:00)"
                        className="border p-2 rounded w-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedAvailability = [
                            ...control._formValues.availability,
                          ];
                          updatedAvailability[index].timeSlots.splice(
                            timeIndex,
                            1
                          );
                          reset({
                            ...control._formValues,
                            availability: updatedAvailability,
                          });
                        }}
                        className="bg-red-400 text-white px-2 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Time Slot Button */}
                <button
                  type="button"
                  onClick={() => {
                    const updatedAvailability = [
                      ...control._formValues.availability,
                    ];
                    updatedAvailability[index].timeSlots.push("");
                    reset({
                      ...control._formValues,
                      availability: updatedAvailability,
                    });
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                >
                  + Add Time Slot
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ day: "", timeSlots: [""] })}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
            >
              + Add Day
            </button>
          </div>
          {/* Add Room & Cancel Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setModalOpen(false);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {editId ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomsPage;

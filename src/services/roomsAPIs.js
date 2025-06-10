import api from "../utils/axiosInstance.js";
/**
 * Create a new room
 * @param {Object} roomData - Data for the new room
 * @returns {Promise<Object>} - Created room details
 */
export const createRoom = async (roomData) => {
  try {
    const { data } = await api.post("/rooms/admin/add-room", roomData);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create room.";
    console.error("Error in createRoom:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get room by ID
 * @param {String} roomId - ID of the room
 * @returns {Promise<Object>} - Room details
 */
export const getRoomById = async (roomId) => {
  try {
    const { data } = await api.get(`/rooms/admin/get-room/${roomId}`);
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to get room.";
    console.error("Error in getRoomById:", errorMessage);
    throw new Error(errorMessage);
  }
};
/**
 * Get all rooms
 * @returns {Promise<Object>} - List of all rooms
 */
export const getAllRooms = async () => {
  try {
    const { data } = await api.get("/rooms/admin/get-all-room");
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to get rooms.";
    console.error("Error in getAllRooms:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Update a room
 * @param {String} roomId - ID of the room
 * @param {Object} updateData - Updated room data
 * @returns {Promise<Object>} - Updated room details
 */
export const updateRoom = async (roomId, updateData) => {
  try {
    const { data } = await api.patch(
      `/rooms/admin/update-room/${roomId}`,
      updateData
    );
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update room.";
    console.error("Error in updateRoom:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Delete a room
 * @param {String} roomId - ID of the room
 * @returns {Promise<Object>} - Confirmation of deletion
 */
export const deleteRoom = async (roomId) => {
  try {
    const { data } = await api.delete(`/rooms/admin/delete-room/${roomId}`);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete room.";
    console.error("Error in deleteRoom:", errorMessage);
    throw new Error(errorMessage);
  }
};

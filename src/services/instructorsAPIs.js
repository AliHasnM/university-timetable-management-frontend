// src/api/instructorsAPIs.js
import api from "../utils/axiosInstance";

/**
 * Create a new instructor
 * @param {Object} instructorData - Data for the new instructor
 * @returns {Promise<Object>} - Created instructor details
 */
export const createInstructor = async (instructorData) => {
  try {
    const { data } = await api.post(
      "/instructors/admin/add-instructor",
      instructorData
    );
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create instructor.";
    console.error("Error in createInstructor:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get instructor by ID
 * @param {String} instructorId - ID of the instructor
 * @returns {Promise<Object>} - Instructor details
 */
export const getInstructorById = async (instructorId) => {
  try {
    const { data } = await api.get(
      `/instructors/admin/get-instructor/${instructorId}`
    );
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to get instructor.";
    console.error("Error in getInstructorById:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get all instructors
 * @returns {Promise<Object>} - List of all instructors
 */
export const getAllInstructors = async () => {
  try {
    const { data } = await api.get("/instructors/admin/get-all-instructor");
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to get instructors.";
    console.error("Error in getAllInstructors:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Update an instructor
 * @param {String} instructorId - ID of the instructor
 * @param {Object} updateData - Updated instructor data
 * @returns {Promise<Object>} - Updated instructor details
 */
export const updateInstructor = async (instructorId, updateData) => {
  try {
    const { data } = await api.patch(
      `/instructors/admin/update-instructor/${instructorId}`,
      updateData
    );
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update instructor.";
    console.error("Error in updateInstructor:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Delete an instructor
 * @param {String} instructorId - ID of the instructor
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteInstructor = async (instructorId) => {
  try {
    const { data } = await api.delete(
      `/instructors/admin/delete-instructor/${instructorId}`
    );
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete instructor.";
    console.error("Error in deleteInstructor:", errorMessage);
    throw new Error(errorMessage);
  }
};

// src/api/coursesAPIs.js
import api from "../utils/axiosInstance.js";

/**
 * Create a new course
 * @param {Object} courseData - Data for the new course
 * @returns {Promise<Object>} - Created course details
 */
export const createCourse = async (courseData) => {
  try {
    const { data } = await api.post("/courses/admin/add-course", courseData);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create course.";
    console.error("Error in createCourse:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get course by ID
 * @param {String} courseId - ID of the course
 * @returns {Promise<Object>} - Course details
 */
export const getCourseById = async (courseId) => {
  try {
    const { data } = await api.get(`/courses/admin/get-course/${courseId}`);
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to get course.";
    console.error("Error in getCourseById:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get all courses
 * @returns {Promise<Object>} - List of all courses
 */
export const getAllCourses = async () => {
  try {
    const { data } = await api.get("/courses/admin/get-all-course");
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to get courses.";
    console.error("Error in getAllCourses:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Update a course
 * @param {String} courseId - ID of the course
 * @param {Object} updateData - Updated course data
 * @returns {Promise<Object>} - Updated course details
 */
export const updateCourse = async (courseId, updateData) => {
  try {
    const { data } = await api.patch(
      `/courses/admin/update-course/${courseId}`,
      updateData
    );
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update course.";
    console.error("Error in updateCourse:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Delete a course
 * @param {String} courseId - ID of the course
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteCourse = async (courseId) => {
  try {
    const { data } = await api.delete(
      `/courses/admin/delete-course/${courseId}`
    );
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete course.";
    console.error("Error in deleteCourse:", errorMessage);
    throw new Error(errorMessage);
  }
};

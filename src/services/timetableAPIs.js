import api from "../utils/axiosInstance";

/**
 * ✅ What's Good
 * - DRY Principle: You're not repeating try-catch in every function — good use of handleApi().
 * - Modular: Each function is separated with a clear purpose and endpoint.
 * - Default Error Handling: Uses fallback messages if backend doesn't respond properly.
 * - Clean Blob Handling: Correctly handles file download with responseType: "blob".
 * - Easy Maintenance: Centralized error handling makes future updates easier.
 */

/**
 * Generic API handler for cleaner try-catch
 */
const handleApi = async (apiCall, defaultError = "Something went wrong") => {
  try {
    const { data } = await apiCall();
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || defaultError;
    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Create/Generate a new timetable (Admin)
 */
export const generateTimetable = (timetableData) =>
  handleApi(
    () => api.post("/timetables/admin/generate-timetable", timetableData),
    "Failed to generate timetable."
  );

/**
 * Get timetable for Admin with optional filters
 * @param {Object} query - optional query like { department, semester, shift }
 */
export const getTimetable = async (filters = {}) => {
  try {
    const res = await api.get("/timetables/admin/get-timetable", {
      params: filters,
    });
    return res;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

/**
 * Edit a timetable entry (Admin)
 */
export const editTimetableEntry = (entryId, updateData) =>
  handleApi(
    () => api.patch(`/timetables/admin/edit-timetable/${entryId}`, updateData),
    "Failed to edit timetable entry."
  );

/**
 * Download timetable as PDF (Admin or Student)
 */
export const downloadTimetablePDF = async ({ department, semester, shift }) => {
  try {
    const { data } = await api.get("/timetables/admin/download-timetable", {
      params: { department, semester, shift },
      responseType: "blob",
    });

    return {
      blob: data,
      filename: "admin-timetable.pdf",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to download timetable PDF.";
    console.error("Error in downloadTimetablePDF:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Send timetable via email to a specific student (Admin)
 */
export const sendTimetableEmail = (emailPayload) =>
  handleApi(
    () => api.post("/timetables/admin/send-timetable", emailPayload),
    "Failed to send timetable email."
  );

/**
 * Send timetable to all students (Admin)
 */
export const sendTimetableEmailToAll = () =>
  handleApi(
    () => api.post("/timetables/admin/send-timetable-to-all"),
    "Failed to send timetable to all students."
  );

/**
 * Get timetable for currently logged-in student
 */
export const getStudentTimetable = async (filters = {}) => {
  try {
    const res = await api.get("/timetables/student/view-timetable", {
      params: filters,
    });
    return res;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
/**
 * Download timetable for student as PDF
 */
export const downloadStudentTimetablePDF = async ({
  department,
  semester,
  shift,
}) => {
  try {
    const { data } = await api.get("/timetables/student/download-timetable", {
      params: { department, semester, shift },
      responseType: "blob",
    });

    return {
      blob: data,
      filename: "admin-timetable.pdf",
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to download timetable PDF.";
    console.error("Error in downloadTimetablePDF:", errorMessage);
    throw new Error(errorMessage);
  }
};

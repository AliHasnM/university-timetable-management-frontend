import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import usersAPIs from "../../services/usersAPIs";

const SignupPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    registrationNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Generic handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const dataToSend = {
        ...userData,
        role: "Student", // fixed role
      };

      console.log("Sending signup request with data:", dataToSend);

      const result = await usersAPIs.registerUser(dataToSend);

      if (result.success) {
        console.log("Signup successful, redirecting...");
        setUserData({
          username: "",
          email: "",
          password: "",
          registrationNumber: "",
        });
        navigate("/login");
      } else {
        setError(result.message || "Signup Failed");
      }
    } catch (error) {
      console.error(
        "Error during signup:",
        error.message || "An error occurred"
      );
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Student Sign Up</h2>

        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
          value={userData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={userData.email}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          className="w-full p-2 mb-4 border rounded"
          value={userData.registrationNumber}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border rounded"
          value={userData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;

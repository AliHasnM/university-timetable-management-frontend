import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import usersAPIs from "../../services/usersAPIs";
import useAuth from "../../contexts/useAuth"; // ✅ Add this line

const LoginPage = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Extract login method from context

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await usersAPIs.loginUser({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });

      if (result.success) {
        login(result.data); // ✅ Set user in context BEFORE navigation
        navigate("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}

        <input
          type="text"
          name="usernameOrEmail"
          placeholder="Email or Username"
          className="w-full p-2 mb-4 border rounded"
          value={formData.usernameOrEmail}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-6 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

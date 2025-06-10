import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ added loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false); // ✅ done checking localStorage
  }, []);

  const login = (data) => {
    const userData = data?.user || data;
    const accessToken = data?.accessToken;

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

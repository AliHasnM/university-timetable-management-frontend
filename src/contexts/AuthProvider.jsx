import { useEffect, useState } from "react";
import AuthContext from "./AuthContext"; // ✅ path correct hona chahiye

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Set the user if valid
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem("user"); // Clean up invalid data
      }
    }
  }, []);

  // 🟡 Accepts either only `user` or full { user, accessToken } object
  const login = (data) => {
    const userData = data?.user || data;
    const accessToken = data?.accessToken;

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      setUser(userData); // ✅ this should trigger re-render in Navbar
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// import { useEffect, useState } from "react";
// import AuthContext from "./AuthContext"; // ✅ path correct hona chahiye

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser); // Set the user if valid
//       } catch (error) {
//         console.error("Failed to parse user data from localStorage:", error);
//         localStorage.removeItem("user"); // Clean up invalid data
//       }
//     }
//   }, []);

//   const login = (userData) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

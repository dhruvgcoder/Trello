import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("tb_token") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("tb_user") || "");

  const handleAuth = useCallback((t, u) => {
    setToken(t);
    setUsername(u);
    localStorage.setItem("tb_token", t);
    localStorage.setItem("tb_user", u);
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUsername("");
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, handleAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

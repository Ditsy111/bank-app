import { fetchCurrentUser } from "../api/userApi";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  user: CurrentUser | null;

  login: (token: string) => void;

  logout: () => void;

  updateUser: (user: CurrentUser) => void;

  isAuthenticated: boolean;
};

type CurrentUser = {
  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  role: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [user, setUser] = useState<CurrentUser | null>(null);

  async function login(token: string) {
    localStorage.setItem("token", token);

    setToken(token);

    try {
      const currentUser = await fetchCurrentUser();

      setUser(currentUser);
    } catch (error) {
      console.error("Failed to load current user", error);
    }
  }

  function logout() {
    localStorage.removeItem("token");

    setToken(null);

    setUser(null);
  }

  function updateUser(user: CurrentUser) {
    setUser(user);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

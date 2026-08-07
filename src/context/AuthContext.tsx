import { fetchCurrentUser } from "../api/userApi";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  token: string | null;
  user: CurrentUser | null;

  login: (token: string) => void;

  logout: () => void;

  updateUser: (user: CurrentUser) => void;

  showSessionWarning: boolean;

  countdown: number;

  hideSessionWarning: () => void;

  isAuthenticated: boolean;
};

type CurrentUser = {
  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  role: string;
};

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [user, setUser] = useState<CurrentUser | null>(null);

  const [showSessionWarning, setShowSessionWarning] = useState(false);

  const [countdown, setCountdown] = useState(60);

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

    setShowSessionWarning(false);   // ✅ Hide popup

    setCountdown(60);                  //reset countdown
  }

  function hideSessionWarning() {
    setShowSessionWarning(false);
}

  useEffect(() => {

    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);

    const expiresAt = decoded.exp * 1000;

    const remainingTime = expiresAt - Date.now();

    if (remainingTime <= 0) {

        logout();

        return;
    }

    const warningTime = remainingTime - 60000;

    let warningTimer: number | undefined;

    if (warningTime > 0) {

        warningTimer = window.setTimeout(() => {

            setShowSessionWarning(true);

        }, warningTime);

    }

    const logoutTimer = window.setTimeout(() => {

        logout();

    }, remainingTime);

    return () => {

        if (warningTimer) {
            clearTimeout(warningTimer);
        }

        clearTimeout(logoutTimer);

    };

}, [token]);

useEffect(() => {

    if (!showSessionWarning) return;

    setCountdown(60);

    const interval = setInterval(() => {

        setCountdown(prev => {

            if (prev <= 1) {

                clearInterval(interval);

                return 0;

            }

            return prev - 1;

        });

    },1000);

    return ()=>clearInterval(interval);

},[showSessionWarning]);

useEffect(() => {

    if (!token) return;

    let inactivityTimer: number;

    function resetTimer() {

        clearTimeout(inactivityTimer);

        inactivityTimer = window.setTimeout(() => {

            alert("Logged out due to inactivity.");

            logout();

        }, 15 * 60 * 1000);   // 15 minutes

    }

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Start timer immediately
    resetTimer();

    return () => {

        clearTimeout(inactivityTimer);

        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
        window.removeEventListener("click", resetTimer);
        window.removeEventListener("scroll", resetTimer);

    };

}, [token]);

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
        showSessionWarning,
        countdown,
        hideSessionWarning,
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

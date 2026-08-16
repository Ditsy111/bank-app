import { fetchCurrentUser } from "../api/userApi";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshApi } from "../api/authApi";

type AuthContextType = {
  token: string | null;
  user: CurrentUser | null;

  refreshToken: string | null;

  login: (token: string, refreshToken: string) => Promise<void>;

  logout: () => void;

  updateUser: (user: CurrentUser) => void;

  showSessionWarning: boolean;

  countdown: number;

  hideSessionWarning: () => void;

  inactivityWarning: boolean;

  isAuthenticated: boolean;

  refreshAccessToken: () => Promise<void>;
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

  const [refreshToken, setRefreshToken] = useState<string | null>(
  localStorage.getItem("refreshToken")
);

  const [user, setUser] = useState<CurrentUser | null>(null);

  const [showSessionWarning, setShowSessionWarning] = useState(false);

  const [countdown, setCountdown] = useState(60);

  const [inactivityWarning, setInactivityWarning] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  async function login(token: string, refreshToken: string) {
    localStorage.setItem("token", token);
    setToken(token);
    localStorage.setItem("refreshToken", refreshToken);
    setRefreshToken(refreshToken);

    try {
      const currentUser = await fetchCurrentUser();

      setUser(currentUser);
    } catch (error) {
      console.error("Failed to load current user", error);
    }
  }


  // =====================================================
  // LOGOUT
  // =====================================================


  function logout() {
    localStorage.removeItem("token");

    localStorage.removeItem("refreshToken");

    setToken(null);

    setRefreshToken(null);

    setUser(null);

    // Hide JWT warning
    setShowSessionWarning(false); // ✅ Hide popup

    // ⭐ NEW
    // Hide inactivity warning also
    setInactivityWarning(false);

    setCountdown(60);                  //reset countdown
  }

  async function refreshAccessToken() {

  if (!refreshToken) {
    logout();
    return;
  }

  try {

    const response =
      await refreshApi(refreshToken);

    localStorage.setItem(
      "token",
      response.accessToken
    );

    setToken(response.accessToken);

    // Keep the same refresh token
    localStorage.setItem(
      "refreshToken",
      response.refreshToken
    );

    setRefreshToken(
      response.refreshToken
    );

    // Hide warning
    setShowSessionWarning(false);
    setInactivityWarning(false);
    setCountdown(60);

  } catch (error) {

    console.error(
      "Token refresh failed",
      error
    );

    logout();
  }
}

   // =====================================================
  // HIDE JWT WARNING
  // =====================================================

  function hideSessionWarning() {
    setShowSessionWarning(false);
}


  // =====================================================
  // 1️⃣ JWT EXPIRATION TIMER
  // =======================================================

  useEffect(() => {

    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);

    const expiresAt = decoded.exp * 1000;

    const remainingTime = expiresAt - Date.now();

    if (remainingTime <= 0) {

        logout();

        return;
    }

     // Warn 60 seconds before JWT expires
    const warningTime = remainingTime - 60000;

    let warningTimer: number | undefined;

    if (warningTime > 0) {

        warningTimer = window.setTimeout(() => {

            setCountdown(60);
            setShowSessionWarning(true);

        }, warningTime);

    }
    
    // Actual JWT logout timer
    const logoutTimer = window.setTimeout(() => {

        logout();

    }, remainingTime);
    
    // Cleanup
    return () => {

        if (warningTimer) {
            clearTimeout(warningTimer);
        }

        clearTimeout(logoutTimer);

    };

}, [token]);

// =====================================================
  // 2️⃣ COUNTDOWN TIMER
  // =====================================================

useEffect(() => {

    if (
      !showSessionWarning &&
      !inactivityWarning
    ) {
      return;
    }

      // Start countdown from 60 seconds

    const interval = setInterval(() => {

        setCountdown(prev => {

            if (prev <= 1) {

                clearInterval(interval);

                return 0;

            }

            return prev - 1;

        });

    },1000);


    // Cleanup interval
    return ()=>clearInterval(interval);

},[showSessionWarning, inactivityWarning]);

// =====================================================
  // 3️⃣ INACTIVITY TIMER
  // =====================================================

useEffect(() => {

    console.log("INACTIVITY EFFECT RUNNING");

    if (!token) {
        console.log("NO TOKEN - inactivity timer not started");
        return;
    }

    console.log("TOKEN EXISTS - starting 30 second timer");

    let inactivityTimer: number;

    function resetTimer() {

        console.log("USER ACTIVITY DETECTED - resetting timer");

        setInactivityWarning(false);

        clearTimeout(inactivityTimer);

        inactivityTimer = window.setTimeout(() => {

            console.log("🔥 30 SECONDS PASSED - SHOWING WARNING");

            setCountdown(60);
            setInactivityWarning(true);

        }, 30 * 1000);
    }


    // Start initial timer
    inactivityTimer = window.setTimeout(() => {

        console.log("🔥 INITIAL 30 SECOND TIMER FINISHED");

        setCountdown(60);
        setInactivityWarning(true);

    }, 30 * 1000);


    window.addEventListener(
        "mousemove",
        resetTimer
    );

    window.addEventListener(
        "keydown",
        resetTimer
    );

    window.addEventListener(
        "click",
        resetTimer
    );

    window.addEventListener(
        "scroll",
        resetTimer
    );


    return () => {

        console.log("🧹 CLEANING INACTIVITY TIMER");

        clearTimeout(inactivityTimer);

        window.removeEventListener(
            "mousemove",
            resetTimer
        );

        window.removeEventListener(
            "keydown",
            resetTimer
        );

        window.removeEventListener(
            "click",
            resetTimer
        );

        window.removeEventListener(
            "scroll",
            resetTimer
        );

    };

}, [token]);

// =====================================================
  // 4️⃣ INACTIVITY WARNING → 60 SECOND TIMER
  // =====================================================

  // ⭐ THIS IS THE NEW useEffect
  //
  // IMPORTANT:
  // It is OUTSIDE the inactivity useEffect above.
  //
  // You accidentally put it INSIDE before.

  useEffect(() => {

    // If there is no inactivity warning,
    // do nothing.

    if (!inactivityWarning) return;


    // Give the user 60 seconds

    const timer =
      window.setTimeout(() => {

        logout();

      }, 60000);


    // If user becomes active again,
    // cancel this timer.

    return () =>
      clearTimeout(timer);


  }, [inactivityWarning]);


 // =====================================================
  // UPDATE USER
  // =====================================================
  function updateUser(user: CurrentUser) {
    setUser(user);
  }


// =====================================================
  // PROVIDER
  // =====================================================
  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        login,
        logout,
        updateUser,
        showSessionWarning,
        countdown,
        hideSessionWarning,
        inactivityWarning,
        isAuthenticated: !!token,
        refreshAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =====================================================
// useAuth
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

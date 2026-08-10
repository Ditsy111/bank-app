import { useAuth } from "../context/AuthContext";

export default function SessionTimeoutModal() {

    const {
        showSessionWarning,
        inactivityWarning,
        countdown,
        logout,
        hideSessionWarning
    } = useAuth();

  // Don't show anything if neither warning is active
    if (!showSessionWarning && !inactivityWarning) {
        return null;
    }

    const isInactivityWarning = inactivityWarning;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl p-6 w-96">

                <h2 className="text-2xl font-bold mb-3">
                    {isInactivityWarning ? "⚠ Inactivity Detected" : "⚠ Session Expiring"}
                </h2>

                <p className="text-gray-600 mb-4">
                     {isInactivityWarning
                        ? "You've been inactive. Your session will expire in:"
                        : "Your session will expire in:"
                    }
                </p>

                <div className="text-5xl font-bold text-center mb-6">
                    {countdown}
                </div>

                <div className="text-center text-gray-600 mb-6">
                    seconds
                </div>

                <div className="flex gap-3">

                    {isInactivityWarning && (

                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="flex-1 bg-primary text-white py-2 rounded-lg"
                        >
                            Continue Session
                        </button>

                    )}

                    <button
                        onClick={logout}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}
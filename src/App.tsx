import { Routes, Route } from "react-router-dom";
import AccountsPage from "./pages/AccountsPage";
import DashboardPage from "./pages/DashboardPage";
import LoansPage from "./pages/LoansPage";
import StatementsPage from "./pages/StatementsPage";
import TransfersPage from "./pages/TransfersPage";
import Sidebar from "./components/Sidebar";

import AccountDetailPage from "./pages/AccountDetailPage";
import LoanDetailPage from "./pages/LoanDetailPage";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";

import { useLocation } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";

import SessionTimeoutModal from "./components/SessionTimeoutModal";

import { useAuth } from "./context/AuthContext";
function App() {

  const { isAuthenticated } = useAuth();

   const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return(
    <div className="flex min-h-screen bg-background text-foreground">

      {isAuthenticated && !isAuthPage && <Sidebar />}
      

      {/* Main Content */}
      <div className="flex-1">
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
          <Route path="/accounts/:accountId" element={<ProtectedRoute><AccountDetailPage /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><TransfersPage /></ProtectedRoute>} />
          <Route path="/loans" element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
          <Route path="/loans/:loanId" element={<ProtectedRoute><LoanDetailPage /></ProtectedRoute>} />
          <Route path="/statements" element={<ProtectedRoute><StatementsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </div>

      <SessionTimeoutModal />

    </div>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import AccountsPage from "./pages/AccountsPage";
import DashboardPage from "./pages/DashboardPage";
import LoansPage from "./pages/LoansPage";
import StatementsPage from "./pages/StatementsPage";
import TransfersPage from "./pages/TransfersPage";
import Sidebar from "./components/Sidebar";

import AccountDetailPage from "./pages/AccountDetailPage";
import LoanDetailPage from "./pages/LoanDetailPage";

function App() {
  return(
    <div className="flex min-h-screen bg-background text-foreground">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:accountId" element={<AccountDetailPage/>} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/loans/:loanId" element={<LoanDetailPage />} />

          <Route path="/statements" element={<StatementsPage />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;

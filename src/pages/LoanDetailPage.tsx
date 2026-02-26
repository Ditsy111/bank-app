import { useParams } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function LoanDetailPage() {
  const { loanId } = useParams();
  const { loans, transfers } = useBank();

  const loan = loans.find(l => l.id === loanId);

  if (!loan) {
    return <div className="p-6">Loan not found.</div>;
  }

  const loanPayments = transfers.filter(
    t => t.to === loanId && t.type === "loan-payment"
  );

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {loan.nickname}
      </h1>

      <div className="mb-6 space-y-2">
        <div>Principal: ${loan.principal.toFixed(2)}</div>
        <div>Outstanding: ${loan.outstanding.toFixed(2)}</div>
        <div>APR: {loan.apr}%</div>
        <div>Term: {loan.termMonths} months</div>
        <div>Status: {loan.status}</div>
      </div>

      <h2 className="text-xl font-semibold mb-3">
        Payment History
      </h2>

      {loanPayments.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          No payments yet.
        </div>
      ) : (
        <div className="space-y-3">
          {loanPayments.map(p => (
            <div
              key={p.id}
              className="border border-border rounded-lg p-3 bg-card"
            >
              <div className="text-sm text-muted-foreground">
                {p.createdAt}
              </div>
              <div className="font-semibold">
                ${p.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
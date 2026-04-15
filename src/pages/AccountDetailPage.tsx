import { useParams } from "react-router-dom";
import { useBank } from "../context/BankContext";
import { useEffect, useState } from "react";
import { fetchTransactions } from "../api/transactionsApi";

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const { accounts } = useBank();

  const [transactions, setTransactions] = useState([]);

  const account = accounts.find(a => a.id === accountId);

  // 🔥 FETCH transactions when accountId changes
  useEffect(() => {
    async function loadTransactions() {
      if (!accountId) return;

      const data = await fetchTransactions(accountId);
      setTransactions(data);
    }

    loadTransactions();
  }, [accountId]);

  if (!account) {
    return <div className="p-6">Account not found.</div>;
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {account.nickname}
      </h1>

      <div className="mb-6">
        <div className="text-muted-foreground">Current Balance</div>
        <div className="text-3xl font-semibold">
          ${account.balance.toFixed(2)}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">
        Recent Activity
      </h2>

      {transactions.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          No transactions yet.
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((t: any) => (
            <div
              key={t.id}
              className="border border-border rounded-lg p-3 bg-card"
            >
              <div className="text-sm text-muted-foreground">
                {t.createdAt}
              </div>
              <div className="font-semibold">
                ${t.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useBank } from "../context/BankContext";

export default function DashboardPage() {
  const { accounts} = useBank();

  const [transactions, setTransactions] = useState([]);
  

useEffect(() => {
  async function loadTransactions() {
    // If you have API for all transactions:
    const res = await fetch("http://localhost:8080/api/transactions");
    const data = await res.json();
    setTransactions(data);
  }

  loadTransactions();
}, []);

const totalBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  const recentTransfersCount = transactions.filter(
    (tx: any) => tx.category === "transfer"
  ).length;

  const netMovement = transactions.reduce((sum: number, t: any) => {
    return t.type === "credit"
      ? sum + t.amount
      : sum - t.amount;
  }, 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          A clean operational overview — balances and recent activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total balance</p>
          <p className="text-2xl font-semibold">${totalBalance.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{accounts.length} accounts</p>
        </div>

        <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Transfers (recent)</p>
          <p className="text-2xl font-semibold">{recentTransfersCount}</p>
          <p className="text-xs text-muted-foreground">Last items loaded</p>
        </div>

        <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Transactions (recent)</p>
          <p className="text-2xl font-semibold">2</p>
          <p className="text-xs text-muted-foreground">Operational activity</p>
        </div>

        <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Net movement</p>
          <p className="text-2xl font-semibold">${netMovement.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">
            Based on latest transactions
          </p>
        </div>
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Recent transactions
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Grocery Store</span>
              <span className="text-destructive">- $54.29</span>
            </div>
            <div className="flex justify-between">
              <span>Payroll Deposit</span>
              <span className="text-emerald-500">+ $1,500.00</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Recent transfers
          </h2>

          <div className="flex justify-between text-sm">
            <span>Monthly savings</span>
            <span>$250.00</span>
          </div>
        </div>
      </div>

    </div>
  );
}

import { useState, useEffect } from "react";
import { useBank } from "../context/BankContext";

export default function StatementsPage() {
  const { accounts, transactions } = useBank();

  const [selectedAccount, setSelectedAccount] = useState("");

  // Auto-select first account safely
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts, selectedAccount]);

  const accountTransactions = transactions
    .filter(t => t.accountId === selectedAccount)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

  // Summary
  const credits = accountTransactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const debits = accountTransactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = credits - debits;

  // Running balance (backwards reconstruction)
  const account = accounts.find(a => a.id === selectedAccount);
  let runningBalance = account?.balance || 0;

  const rowsWithRunning = [...accountTransactions]
    .reverse()
    .map(row => {
      const result = {
        ...row,
        running: runningBalance
      };

      runningBalance -= row.type === "credit"
        ? row.amount
        : -row.amount;

      return result;
    })
    .reverse();

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Statements</h1>

      {/* Account Selector */}
      <select
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
        className="border border-border rounded-lg px-3 py-2 bg-background mb-6"
      >
        {accounts.map(acc => (
          <option key={acc.id} value={acc.id}>
            {acc.nickname}
          </option>
        ))}
      </select>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-card rounded-xl border border-border">
          Credits: ${credits.toFixed(2)}
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          Debits: ${debits.toFixed(2)}
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          Net: ${net.toFixed(2)}
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-3">
        {rowsWithRunning.length === 0 ? (
          <div className="text-muted-foreground">
            No transactions found.
          </div>
        ) : (
          rowsWithRunning.map(row => (
            <div
              key={row.id}
              className="p-4 border border-border rounded-xl bg-card"
            >
              <div className="text-sm text-muted-foreground">
                {row.createdAt}
              </div>
              <div className="font-semibold">
                {row.description}
              </div>
              <div>
                {row.type.toUpperCase()} — $
                {row.amount.toFixed(2)}
              </div>
              <div>
                Running Balance: $
                {row.running.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
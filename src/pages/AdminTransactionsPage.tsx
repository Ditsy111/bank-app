import { useEffect, useState } from "react";
import {
  deleteTransaction,
  fetchAdminTransactions,
  fetchAdminUsers,
} from "../api/transactionsApi";
import type { Transaction } from "../context/BankContext";

type AdminUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");
    setLoading(true);

    try {
      const [transactionData, userData] = await Promise.all([
        fetchAdminTransactions(),
        fetchAdminUsers(),
      ]);
      setTransactions(transactionData);
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    setError("");

    try {
      await deleteTransaction(id);
      setTransactions((current) => current.filter((row) => row.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete transaction");
    }
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Admin</h1>
      <p className="text-muted-foreground mb-6">
        Every customer and every transaction. Delete is limited to the admin role.
      </p>

      {error && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4 text-sm">
          {error}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-3">Users</h2>
      <div className="space-y-3 mb-8">
        {loading ? (
          <div className="text-muted-foreground">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-muted-foreground">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="p-4 border border-border rounded-xl bg-card">
              <div className="font-semibold">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="text-sm">{user.phoneNumber}</div>
              <div className="text-sm font-semibold">{user.role}</div>
            </div>
          ))
        )}
      </div>

      <h2 className="text-xl font-semibold mb-3">All transactions</h2>
      <div className="space-y-3">
        {loading ? (
          <div className="text-muted-foreground">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-muted-foreground">No transactions found.</div>
        ) : (
          transactions.map((row) => (
            <div key={row.id} className="p-4 border border-border rounded-xl bg-card">
              <div className="text-sm text-muted-foreground">{row.createdAt}</div>
              <div className="font-semibold">{(row.category || "other").toUpperCase()}</div>
              <div>
                {(row.type || "").toUpperCase()} — ${Number(row.amount).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Account {row.accountId}</div>
              <button
                onClick={() => handleDelete(row.id)}
                className="mt-3 rounded-lg border border-border px-3 py-1 text-sm hover:bg-muted"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
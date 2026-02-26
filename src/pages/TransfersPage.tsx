import { useState } from "react";
import { useBank } from "../context/BankContext";

export default function TransfersPage() {

  const { accounts, transactions, createTransfer } = useBank();

  // Form state
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
  });

  // Show only transfer-related transactions
  const recentTransfers = transactions
    .filter(t => t.category === "transfer")
    .slice(-6)
    .reverse();

  // Handle input change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Submit transfer
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createTransfer(
      formData.from,
      formData.to,
      Number(formData.amount)
    );

    setFormData({
      from: "",
      to: "",
      amount: "",
    });
  }

  return (
    <div className="p-6 bg-background min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transfers</h1>
        <p className="text-muted-foreground">
          Create transfer and track recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6">

        {/* LEFT SIDE — Recent Transfers */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Recent transfers
          </h2>

          {recentTransfers.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No transfers yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransfers.map((t) => {

                const account = accounts.find(a => a.id === t.accountId);

                return (
                  <div
                    key={t.id}
                    className="border border-border rounded-lg p-3 bg-background"
                  >
                    <div className="font-semibold">
                      {account?.nickname}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {t.category}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {t.createdAt}
                    </div>

                    <div
                      className={`mt-1 font-semibold ${
                        t.type === "debit"
                          ? "text-destructive"
                          : "text-emerald-500"
                      }`}
                    >
                      {t.type === "debit" ? "-" : "+"} $
                      {t.amount.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDE — Create Transfer */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Create transfer
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <select
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              required
            >
              <option value="">From account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.nickname}
                </option>
              ))}
            </select>

            <select
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              required
            >
              <option value="">To account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.nickname}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              required
            />

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold"
            >
              Submit transfer
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
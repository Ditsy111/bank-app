import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Link } from "react-router-dom";

export default function AccountsPage() {

  const { customers, accounts, createAccount, depositMoney, withdrawMoney} = useBank();
  const [nickname, setNickname] = useState("");
const [balance, setBalance] = useState(0);
const [customerId, setCustomerId] = useState("1");
  

  const [selectedCustomer, setSelectedCustomer] = useState("all");

   const filteredAccounts =
  selectedCustomer === "all"
    ? accounts
    : accounts.filter(a => a.customerId === selectedCustomer);

  const totalBalance = filteredAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  const sortedAccounts = [...filteredAccounts].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

  async function handleCreate() {
  if (!nickname) {
    alert("Enter valid data");
    return;
  }

  await createAccount({
    nickname,
    balance,
    customerId
  });

  // reset fields
  setNickname("");
  setBalance(0);
}

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">
            Browse accounts and manage balances.
          </p>
        </div>

        <button onClick={handleCreate}
                  className="bg-primary text-white px-4 py-2 rounded-xl">
          + New account
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Left Section */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          {/* Filter */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Accounts</h2>

            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-background"
            >
              <option value="all">All customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex gap-2">
  <input
    placeholder="Nickname"
    value={nickname}
    onChange={(e) => setNickname(e.target.value)}
    className="border px-2 py-1"
  />

  <input
    type="number"
    placeholder="Balance"
    value={balance}
    onChange={(e) => setBalance(Number(e.target.value))}
    className="border px-2 py-1"
  />

  <button onClick={handleCreate} className="bg-green-500 text-white px-3">
    Create
  </button>
</div>

          {/* Account Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAccounts.map((account) => (
              <div
                key={account.id}
                className="rounded-xl border border-border p-4 bg-background shadow-sm"
              >
                <div className="font-semibold">{account.nickname}</div>

                <div className="mt-3 text-lg font-semibold">
                  ${account.balance.toFixed(2)}
                </div>

                <div className="mt-3 flex gap-2">
      <button
        onClick={() => depositMoney(account.id, 100)}
        className="bg-green-500 text-white px-2 py-1 rounded"
      >
        + Deposit
      </button>

      <button
        onClick={() => withdrawMoney(account.id, 50)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        - Withdraw
      </button>
    </div>

                <Link
  to={`/accounts/${account.id}`}
  className="mt-2 text-primary text-sm font-semibold"
>
  Open detail →
</Link>
              </div>
            ))}
          </div>
        </div>
          
        </div>

        {/* Right Section - Portfolio */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Portfolio</h2>

          <div className="text-sm text-muted-foreground">
            Total balance
          </div>

          <div className="text-3xl font-bold mt-2">
            ${totalBalance.toFixed(2)}
          </div>

          <div className="mt-4 rounded-lg bg-background border border-border p-3 text-sm text-muted-foreground">
            Balance values are shown for demo purposes.
          </div>
        </div>
      </div>
  );
}

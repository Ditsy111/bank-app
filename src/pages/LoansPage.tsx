import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Link } from "react-router-dom";

export default function LoansPage() {

const { loans, createLoan, accounts } = useBank();

const [formData, setFormData] = useState({
  accountId: "",
  nickname: "",
  principal: "",
  apr: "7.5",
  termMonths: ""
});

  const [selectedCustomer, setSelectedCustomer] = useState("all");

  // Filter loans
  const filteredLoans =
  selectedCustomer === "all"
    ? loans
    : loans.filter(l => l.customerId === selectedCustomer);


  // Total outstanding
  const totalOutstanding = filteredLoans.reduce(
    (sum, loan) => sum + loan.outstanding,
    0
  );

  async function handleCreateLoan(e: React.FormEvent) {
  e.preventDefault();

  await createLoan(formData.accountId, {
    nickname: formData.nickname,
    principal: Number(formData.principal),
    outstanding: Number(formData.principal),
    apr: Number(formData.apr),
    termMonths: Number(formData.termMonths),
    status: "active",
    customerId: "1"
  });

  setFormData({
    accountId: "",
    nickname: "",
    principal: "",
    apr: "",
    termMonths: ""
  });
}

  return (
    <div className="p-6 bg-background min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Loans</h1>
          <p className="text-muted-foreground">
            Track outstanding balances and manage loan profiles.
          </p>
        </div>

        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold">
          + New loan
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* LEFT SIDE - Loans */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">

          <form onSubmit={handleCreateLoan} className="space-y-3 mb-6">

  <select
    value={formData.accountId}
    onChange={(e) =>
      setFormData({ ...formData, accountId: e.target.value })
    }
    className="border px-2 py-2 w-full"
    required
  >
    <option value="">Select account</option>

    {accounts.map((acc) => (
      <option key={acc.id} value={acc.id}>
        {acc.nickname}
      </option>
    ))}
  </select>

  <input
    placeholder="Loan nickname"
    value={formData.nickname}
    onChange={(e) =>
      setFormData({ ...formData, nickname: e.target.value })
    }
    className="border px-2 py-2 w-full"
    required
  />

  <input
    type="number"
    placeholder="Principal"
    value={formData.principal}
    onChange={(e) =>
      setFormData({ ...formData, principal: e.target.value })
    }
    className="border px-2 py-2 w-full"
    required
  />

  <input
    type="number"
    placeholder="APR"
    value={formData.apr}
    onChange={(e) =>
      setFormData({ ...formData, apr: e.target.value })
    }
    className="border px-2 py-2 w-full"
    required
  />

  <input
    type="number"
    placeholder="Term months"
    value={formData.termMonths}
    onChange={(e) =>
      setFormData({ ...formData, termMonths: e.target.value })
    }
    className="border px-2 py-2 w-full"
    required
  />

  <button
    type="submit"
    className="bg-primary text-white px-4 py-2 rounded"
  >
    Create Loan
  </button>

</form>

          {/* Loan Cards */}
          {filteredLoans.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No loans found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="rounded-xl border border-border p-4 bg-background shadow-sm"
                >

                  <div className="text-sm text-muted-foreground">
                    Customer: <span className="font-semibold">{loan.nickname}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Status: <span className="font-semibold">{loan.status}</span>
                  </div>

                  <div className="text-sm text-muted-foreground mt-1">
                    APR: {loan.apr}%
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Term: {loan.termMonths} months
                  </div>

                  <div className="mt-3 text-lg font-semibold">
                    ${loan.outstanding.toFixed(2)}
                  </div>
                  <Link
  to={`/loans/${loan.id}`}
  className="mt-2 text-primary text-sm font-semibold"
>
  Open detail →
</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Outstanding Summary */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm h-fit">

          <h2 className="text-xl font-semibold mb-4">
            Outstanding
          </h2>

          <div className="text-sm text-muted-foreground">
            Total
          </div>

          <div className="text-3xl font-bold mt-2">
            ${totalOutstanding.toFixed(2)}
          </div>

          <div className="mt-4 rounded-lg bg-background border border-border p-3 text-sm text-muted-foreground">
            Keep status values consistent (active, closed, delinquent).
          </div>
        </div>
      </div>
    </div>
  );
}

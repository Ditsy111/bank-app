import { useState } from "react";
import { useBank } from "../context/BankContext";
import { Link } from "react-router-dom";

export default function LoansPage() {

const { loans } = useBank();

  // Dummy customers
  const customers = [
    { id: "1", name: "Darshana" },
    { id: "2", name: "Rahul" },
    { id: "3", name: "Anita" },
  ];

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

          {/* Filter */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Loans</h2>

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

import { createContext, useContext, useState, useEffect } from "react";
import { getAccounts, saveAccounts } from "../api/accountsApi";
import { getTransactions, saveTransactions } from "../api/transactionsApi";
import { getLoans, saveLoans } from "../api/loansApi";

type Customer = {
  id: string;
  name: string;
};

export type Account = {
  id: string;
  nickname: string;
  balance: number;
  customerId: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  type: "credit" | "debit";
  amount: number;
  category: "transfer"|"expenses"|"loan-payment"|"other",
  createdAt: string;
};

export type Loan = {
  id: string;
  nickname: string;
  principal: number;
  outstanding: number;
  apr: number;
  termMonths: number;
  status: string;
};

type BankContextType = {
  customers: Customer[];
  accounts: Account[];
  loans: Loan[];
  transactions: Transaction[];
  createTransfer: (from: string, to: string, amount: number) => void;
  makeLoanPayment: (loanId: string, fromAccount: string, amount: number) => void;
};

const BankContext = createContext<BankContextType | null>(null);

export function BankProvider({ children }: { children: React.ReactNode }) {

  const [customers] = useState<Customer[]>([
  { id: "1", name: "Darshana" },
  { id: "2", name: "Rahul" },
  { id: "3", name: "Anita" },
]);
  
const [accounts, setAccounts] = useState<Account[]>([]);


 const [transactions, setTransactions] = useState<Transaction[]>([]);

 const [loans, setLoans] = useState<Loan[]>([]);

 const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    const accountsData = await getAccounts();
    const transactionsData = await getTransactions();
    const loansData = await getLoans();

    setAccounts(accountsData);
    setTransactions(transactionsData);
    setLoans(loansData);

    setLoading(false);
  }

  loadData();
}, []);

useEffect(() => {
  saveAccounts(accounts);
}, [accounts]);

useEffect(() => {
  saveTransactions(transactions);
}, [transactions]);

useEffect(() => {
  saveLoans(loans);
}, [loans]);

  function createTransfer(from: string, to: string, amount: number) {
  if (!from || !to) {
    throw new Error("Both accounts must be selected.");
  }

  if (from === to) {
    throw new Error("Cannot transfer to the same account.");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const fromAccount = accounts.find(acc => acc.id === from);

  if (!fromAccount) {
    throw new Error("From account not found.");
  }

  if (fromAccount.balance < amount) {
    throw new Error("Insufficient balance.");
  }

  // Update balances
  setAccounts(prev =>
    prev.map(acc => {
      if (acc.id === from) {
        return { ...acc, balance: acc.balance - amount };
      }
      if (acc.id === to) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    })
  );

  const now = new Date().toLocaleString();

  // Create TWO transactions
  setTransactions(prev => [
    ...prev,
    {
      id: "tx" + (prev.length + 1),
      accountId: from,
      type: "debit",
      amount,
      category: "transfer",
      createdAt: now,
    },
    {
      id: "tx" + (prev.length + 2),
      accountId: to,
      type: "credit",
      amount,
      category: "transfer",
      createdAt: now,
    }
  ]);
}


function makeLoanPayment(
  loanId: string,
  fromAccountId: string,
  amount: number
) {
  if (amount <= 0) {
    throw new Error("Payment must be greater than zero.");
  }

  const account = accounts.find(acc => acc.id === fromAccountId);
  const loan = loans.find(l => l.id === loanId);

  if (!account) throw new Error("Account not found.");
  if (!loan) throw new Error("Loan not found.");

  if (account.balance < amount) {
    throw new Error("Insufficient balance.");
  }

  if (amount > loan.outstanding) {
    throw new Error("Payment exceeds outstanding amount.");
  }

  // Deduct from account
  setAccounts(prev =>
    prev.map(acc =>
      acc.id === fromAccountId
        ? { ...acc, balance: acc.balance - amount }
        : acc
    )
  );

  // Reduce loan outstanding
  setLoans(prev =>
    prev.map(l =>
      l.id === loanId
        ? {
            ...l,
            outstanding: l.outstanding - amount,
            status: l.outstanding - amount === 0 ? "closed" : "active"
          }
        : l
    )
  );

  const now = new Date().toLocaleString();

  // Add ONE transaction (debit from account)
  setTransactions(prev => [
    ...prev,
    {
      id: "tx" + (prev.length + 1),
      accountId: fromAccountId,
      type: "debit",
      amount,
      category: "loan-payment",
      createdAt: now,
    }
  ]);
}

if (loading) {
  return <div>Loading...</div>;
}
  return (
    <BankContext.Provider
      value={{ customers, accounts, transactions, loans, createTransfer, makeLoanPayment }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error("useBank must be used inside BankProvider");
  }
  return context;
}

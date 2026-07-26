import { createAccount as createAccountApi , fetchAccounts } from "../api/accountsApi";
import { fetchLoans, payLoan, createLoan as createLoanApi} from "../api/loansApi";
import { transferMoney } from "../api/transferApi";
import { useEffect, useState, useContext, createContext } from "react";
import { deposit, withdraw } from "../api/accountsApi";
import { useAuth } from "./AuthContext";

export type Account = {
  id: string;
  nickname: string;
  balance: number;
  customerId: string;
  createdAt: string;
};

export type CreateAccountRequest = {
  nickname: string;
  balance: number;
};


export type Loan = {
  id: string;
  nickname: string;
  principal: number;
  outstanding: number;
  apr: number;
  termMonths: number;
  status: string;
  customerId: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  loanId: string;
  type: "credit" | "debit";
  amount: number;
  category: string;
  createdAt: string;
};

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error("useBank must be used inside BankProvider");
  }
  return context;
}


type BankContextType = {
  accounts: Account[];
  loans: Loan[];
  createAccount: (data: CreateAccountRequest) => Promise<void>;
  createTransfer: (from: string, to: string, amount: number) => void;
  makeLoanPayment: (loanId: string, fromAccount: string, amount: number) => void;
  depositMoney: (id: string, amount: number) => Promise<void>;
  withdrawMoney: (id: string, amount: number) => Promise<void>;
  createLoan: (accountId: string, data: any) => Promise<void>;
  refreshData: () => Promise<void>;
};


const BankContext = createContext<BankContextType | null>(null);


export function BankProvider({ children }: { children: React.ReactNode }) {
  
const [accounts, setAccounts] = useState<Account[]>([]);

 const [loans, setLoans] = useState<Loan[]>([]);

 const [loading, setLoading] = useState(true);

  async function loadData() {

    setLoading(true);

    try {

        const accountsData = await fetchAccounts();
        setAccounts(accountsData);

        const loansData = await fetchLoans();
        setLoans(loansData);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

}

const { isAuthenticated } = useAuth();

useEffect(() => {
    if (isAuthenticated) {
        void loadData();
    } else {
        setAccounts([]);
        setLoans([]);
        setLoading(false);
    }
}, [isAuthenticated]);


  async function createTransfer(from: string, to: string, amount: number) {
  try {
    await transferMoney(from, to, amount);
    await loadData(); // refresh accounts
  } catch {
    throw new Error("Transfer failed");
  }
}

async function createAccountHandler(data: CreateAccountRequest) {
  try {
    await createAccountApi(data); // API call
    await loadData(); // 🔥 refresh UI
  } catch (error) {
    console.error("Create account failed", error);
  }
}

async function depositMoney(id: string, amount: number) {
  try {
    await deposit(id, amount);
    await loadData(); // 🔥 refresh UI
  } catch (error) {
    console.error("Deposit failed", error);
  }
}

async function withdrawMoney(id: string, amount: number) {
  try {
    await withdraw(id, amount);
    await loadData();
  } catch (error) {
    console.error("Withdraw failed", error);
  }
}

async function createLoanHandler(accountId: string, data: any) {
  try {
    await createLoanApi(accountId, data);

    await loadData(); // refresh loans + accounts
  } catch (error) {
    console.error("Loan creation failed", error);
  }
}

async function makeLoanPayment(
 loanId: string,
  fromAccountId: string,
  amount: number
){
  await payLoan({loanId, fromAccount: fromAccountId, amount});

  await loadData();
}

if (loading) {
  return <div>Loading...</div>;
}
  return (
    <BankContext.Provider
      value={{ accounts, loans, createTransfer, makeLoanPayment, createAccount: createAccountHandler,
         depositMoney, withdrawMoney, createLoan: createLoanHandler, refreshData: loadData }}
    >
      {children}
    </BankContext.Provider>
  );
}


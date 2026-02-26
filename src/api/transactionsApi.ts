import type { Transaction } from "../context/BankContext";

// Get all transactions
export function getTransactions(): Transaction[] {
  const stored = localStorage.getItem("transactions");
  return stored ? JSON.parse(stored) : [];
}

// Save transactions
export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
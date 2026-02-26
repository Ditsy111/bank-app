import type { Loan } from "../context/BankContext";

// Get loans
export function getLoans(): Loan[] {
  const stored = localStorage.getItem("loans");
  return stored ? JSON.parse(stored) : [];
}

// Save loans
export function saveLoans(loans: Loan[]) {
  localStorage.setItem("loans", JSON.stringify(loans));
}
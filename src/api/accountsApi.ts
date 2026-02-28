// This file handles ALL account data operations

import type { Account} from "../context/BankContext";

// Get all accounts
export async function getAccounts(): Promise<Account[]> {
  const stored = localStorage.getItem("accounts");
  return stored ? JSON.parse(stored) : [];
}

// Save updated accounts
export async function saveAccounts(accounts: Account[]): Promise<void> {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}
// This file handles ALL account data operations

import type { Account} from "../context/BankContext";

// Get all accounts
export function getAccounts(): Account[] {
  const stored = localStorage.getItem("accounts");
  return stored ? JSON.parse(stored) : [];
}

// Save updated accounts
export function saveAccounts(accounts: Account[]) {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}
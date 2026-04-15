// This file handles ALL account data operations
const BASE_URL = "http://localhost:8080/api";

export async function fetchAccounts() {
  const res = await fetch(`${BASE_URL}/accounts`);

  if (!res.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return res.json();
}

export async function createAccount(data: any) {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Failed to create account");
  }

  return res.json();
}

export async function deposit(accountId: string, amount: number) {
  const res = await fetch(
    `http://localhost:8080/api/accounts/${accountId}/deposit?amount=${amount}`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Deposit failed");
  }

  return res.json();
}

export async function withdraw(accountId: string, amount: number) {
  const res = await fetch(
    `http://localhost:8080/api/accounts/${accountId}/withdraw?amount=${amount}`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Withdraw failed");
  }

  return res.json();
}
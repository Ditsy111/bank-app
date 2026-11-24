import { getAuthHeaders } from "./apiUtils";

const BASE_URL = "http://localhost:8080/api";

export async function fetchAllTransactions() {

  const res = await fetch(
    `${BASE_URL}/transactions`,
    {
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
}

export async function fetchTransactionsByAccount(accountId: string) {

  const res = await fetch(
    `${BASE_URL}/transactions/account/${accountId}`,
    {
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch account transactions");
  }

  return res.json();
}

export async function fetchAdminTransactions() {
  const res = await fetch(`${BASE_URL}/admin/transactions`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 403) {
    throw new Error("Admin access required");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch all transactions");
  }

  return res.json();
}

export async function fetchAdminUsers() {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 403) {
    throw new Error("Admin access required");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function deleteTransaction(id: string) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (res.status === 403) {
    throw new Error("Admin access required");
  }

  if (!res.ok) {
    throw new Error("Failed to delete transaction");
  }
}
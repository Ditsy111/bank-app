import { getAuthHeaders } from "./apiUtils";

const BASE_URL = "http://localhost:8080/api";

export async function fetchLoans() {
  const res = await fetch(`${BASE_URL}/loans`);
  return res.json();
}

export async function payLoan(data: any) {
  const res = await fetch(`${BASE_URL}/loans/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.text();
}

export async function createLoan(accountId: string, data: any) {
  const res = await fetch(`${BASE_URL}/loans/${accountId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Failed to create loan");
  }

  return res.text();
}
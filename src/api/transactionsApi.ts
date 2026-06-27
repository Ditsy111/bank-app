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
    throw new Error(
      "Failed to fetch transactions"
    );
  }

  return res.text();
}
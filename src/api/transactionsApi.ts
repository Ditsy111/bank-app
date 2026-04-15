const BASE_URL = "http://localhost:8080/api";

export async function fetchTransactions(accountId: string) {
  const res = await fetch(`${BASE_URL}/transactions/account/${accountId}`);
  return res.json();
}
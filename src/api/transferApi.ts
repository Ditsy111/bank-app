const BASE_URL = "http://localhost:8080/api";

export async function transferMoney(from: string, to: string, amount: number) {
  const res = await fetch(`${BASE_URL}/transfers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID()
    },
    body: JSON.stringify({ from, to, amount })
  });

  return res.text();
}
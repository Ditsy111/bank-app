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
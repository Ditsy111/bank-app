const BASE_URL = "http://localhost:8080/auth";

export async function loginApi(
  email: string,
  password: string
) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
     headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.text();
}

export async function registerApi(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
     headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    })
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.text();
}
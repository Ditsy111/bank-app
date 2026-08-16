const BASE_URL = "http://localhost:8080/auth";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginApi(
  email: string,
  password: string
) : Promise<AuthResponse>{
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

  return res.json();
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


export async function refreshApi(
  refreshToken: string
): Promise<AuthResponse> {

  const res = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      refreshToken
    })
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  return res.json();
}
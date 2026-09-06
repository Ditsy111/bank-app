const BASE_URL = "http://localhost:8080/auth";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  message: string;
};


// =========================
// OTP REQUEST
// =========================

export async function requestOtp(
  phoneNumber: string,
  purpose: string
): Promise<string> {

  const res = await fetch(`${BASE_URL}/otp/request`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      phoneNumber,
      purpose
    })
  });

  if (!res.ok) {
    throw new Error("OTP request failed");
  }

  return res.text();
}


// =========================
// PASSWORD LOGIN
// =========================

export async function loginApi(
  email: string,
  password: string
): Promise<AuthResponse> {

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

  return res.json();   //this takes email and password as input and returns accessToken and refreshToken as output
}


// =========================
// OTP VERIFY
// =========================

export async function verifyOtpApi(
  phoneNumber: string,
  otp: string,
  purpose: string
): Promise<AuthResponse> {

  const res = await fetch(`${BASE_URL}/otp/verify`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      phoneNumber,
      otp,
      purpose
    })
  });

  if (!res.ok) {
    throw new Error("Invalid OTP");
  }

  return res.json();
}


// =========================
// REGISTER
// =========================

export async function registerApi(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
): Promise<string> {

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


// =========================
// REFRESH TOKEN
// =========================

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


// =========================
// LOGOUT
// =========================

export async function logoutApi(
  refreshToken: string
): Promise<void> {

  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      refreshToken
    })
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}
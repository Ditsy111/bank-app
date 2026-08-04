import { getAuthHeaders } from "./apiUtils";

const BASE_URL = "http://localhost:8080/api/users";

export type CurrentUser = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
};

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return res.json();
}

export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) {

  const res = await fetch(
    "http://localhost:8080/api/users/profile",
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}
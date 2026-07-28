const BASE_URL = "http://localhost:8080/api/users";

export type CurrentUser = {
  email: string;
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
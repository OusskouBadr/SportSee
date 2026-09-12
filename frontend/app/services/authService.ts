type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  token: string;
  userId: string;
};

const API_URL = "http://localhost:8000";

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Identifiants incorrects");
  }

  return response.json();
}
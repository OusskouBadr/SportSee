import type { UserActivity, UserInfo } from "../types/user";

const API_URL = "http://localhost:8000";

export async function getUserInfo(token: string): Promise<UserInfo> {
  const response = await fetch(`${API_URL}/api/user-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les informations utilisateur.");
  }

  return response.json();
}

export async function getUserActivity(
  token: string,
  startWeek: string,
  endWeek: string
): Promise<UserActivity[]> {
  const params = new URLSearchParams({
    startWeek,
    endWeek,
  });

  const response = await fetch(
    `${API_URL}/api/user-activity?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les activités.");
  }

  return response.json();
}
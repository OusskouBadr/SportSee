import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  getUserActivity,
  getUserInfo,
} from "../services/userService";

import {
  adaptUserActivity,
  adaptUserInfo,
  type DashboardActivity,
  type DashboardUser,
} from "../adapters/userAdapter";

export function useDashboardData() {
  const { token } = useAuth();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [userInfo, userActivities] = await Promise.all([
          getUserInfo(token),

          getUserActivity(
            token,
            "2025-06-01",
            "2025-06-30"
          ),
        ]);

        setUser(adaptUserInfo(userInfo));
        setActivities(adaptUserActivity(userActivities));
      } catch {
        setError("Impossible de charger les données du dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [token]);

  return {
    user,
    activities,
    isLoading,
    error,
  };
}
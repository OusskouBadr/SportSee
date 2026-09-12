import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  getUserActivity,
  getUserInfo,
} from "../services/userService";

import {
  adaptUserProfile,
  type ProfileUser,
} from "../adapters/userAdapter";

export function useProfileData() {
  const { token } = useAuth();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfileData() {
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

        setUser(
          adaptUserProfile(
            userInfo,
            userActivities
          )
        );
      } catch {
        setError("Impossible de charger les données du profil.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfileData();
  }, [token]);

  return {
    user,
    isLoading,
    error,
  };
}
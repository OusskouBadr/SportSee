import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await loginUser({
        username,
        password,
      });

      login(data.token, data.userId);

      return true;
    } catch {
      setError("Identifiants incorrects.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    authenticate,
    isLoading,
    error,
  };
}
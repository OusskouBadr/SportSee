import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateTrainingPlan } from "../services/aiService";

export function useTrainingPlan() {
  const { token } = useAuth();

  const [trainingPlan, setTrainingPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(objective: string, availability: string) {
    if (!token) {
      setError("Utilisateur non authentifié.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const data = await generateTrainingPlan(token, {
        objective,
        availability,
      });

      setTrainingPlan(data.trainingPlan);
    } catch {
      setError("Impossible de générer le plan d'entraînement.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    trainingPlan,
    isLoading,
    error,
    generate,
  };
}
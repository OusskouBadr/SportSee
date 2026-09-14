const API_URL = "http://localhost:8000";

type TrainingPlanRequest = {
  objective: string;
  availability: string;
};

type TrainingPlanResponse = {
  trainingPlan: string;
};

export async function generateTrainingPlan(
  token: string,
  data: TrainingPlanRequest
): Promise<TrainingPlanResponse> {
  const response = await fetch(`${API_URL}/api/training-plan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Impossible de générer le plan d'entraînement.");
  }

  return response.json();
}
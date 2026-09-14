import { useState ,type SyntheticEvent } from "react";
import ReactMarkdown from "react-markdown";
import "./TrainingPlan.css";
import { useTrainingPlan } from "~/hooks/useTrainingPlan";

export default function TrainingPlan() {
  const [objective, setObjective] = useState(
    "Préparer un semi-marathon dans 6 semaines"
  );

  const [availability, setAvailability] = useState(
    "Mardi, jeudi et dimanche"
  );

  const { trainingPlan, isLoading, error, generate } = useTrainingPlan();

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    generate(objective, availability);
  };

  return (
    <section className="training-plan">
      <div className="training-plan-header">
        <div>
          <p className="training-plan-label">Coach IA</p>
          <h2>Votre plan personnalisé</h2>
        </div>
      </div>

      <form className="training-plan-form" onSubmit={handleSubmit}>
        <label>
          Objectif
          <input
            type="text"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
          />
        </label>

        <label>
          Disponibilités
          <input
            type="text"
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Génération..." : "Générer mon plan"}
        </button>
      </form>

      {error && <p className="training-plan-error">{error}</p>}

      {trainingPlan && (
        <div className="training-plan-result">
          <h3>Plan proposé par SportSee IA</h3>
          <ReactMarkdown>{trainingPlan}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}
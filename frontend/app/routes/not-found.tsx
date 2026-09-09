import { Link } from "react-router";

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Page introuvable.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
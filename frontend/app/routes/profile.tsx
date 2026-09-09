import { Link } from "react-router";

export default function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <Link to="/dashboard">Retour au dashboard</Link>
    </div>
  );
}
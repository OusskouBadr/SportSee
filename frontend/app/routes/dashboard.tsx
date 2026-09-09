import { Link } from "react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/profile">Aller au profil</Link>
    </div>
  );
}
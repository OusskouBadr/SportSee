import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";

import "./Header.css";

export function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      <img
        src="/icons/sportsee-logo.svg"
        alt="SportSee"
        className="app-header-logo"
      />

      <nav className="app-header-nav">
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/profile">
          Mon profil
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
        >
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
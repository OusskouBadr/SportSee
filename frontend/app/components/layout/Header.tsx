import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Appelle la fonction dans AuthContext ( remove token et userid localstorage )
    logout();
    // ramène immédiatement l'utilisateur au login
    navigate("/login", { replace: true });
  };

  return (
    <header>
      <img
        src="/icons/sportsee-logo.svg"
        alt="SportSee"
      />

      <nav>
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/profile">
          Mon profil
        </NavLink>

        <button type="button" onClick={handleLogout}>
          Se déconnecter
        </button>
      </nav>
    </header>
  );
}
import { useState, type SyntheticEvent  } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useLogin";

import "./LoginForm.css";

export function LoginForm() {
  // username = valeur actuelle de l'input / setUsername permet de modifier la valeur
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { authenticate, isLoading, error } = useLogin()

  const navigate = useNavigate()

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    // attends(await) le résultat useLogin pour authService et POST /api/login
    const success = await authenticate(username, password)

    if(success) {
      // si tout est bon envoie sur le dashboard du profil
      navigate("/dashboard")
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Adresse email</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error && <p className="login-error">{error}</p>}

      <button type="submit" className="login-button" disabled={isLoading}>
        Se connecter
      </button>

      <button type="button" className="forgot-password">
        Mot de passe oublié ?
      </button>
    </form>
  );
}
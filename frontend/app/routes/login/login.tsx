import { LoginForm } from "../../components/login/LoginForm";
import "./login.css";

export default function Login() {
  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-content">
          <img
            src="/icons/sportsee-logo.svg"
            alt="SportSee"
            className="login-logo"
          />

          <div className="login-card">
            <h1 className="login-card-title">
              Transformez
              <br />
              vos stats en résultats
            </h1>

            <h2 className="login-card-subtitle">Se connecter</h2>

            <LoginForm />
          </div>
        </div>
      </section>

      <section className="login-right">
        <img
          src="/images/login-running.png"
          alt="Course à pied"
          className="login-image"
        />

      <p className="login-tagline">
        Analysez vos performances en un clin d'œil,
        <br />
        suivez vos progrès et atteignez vos objectifs.
      </p>
      </section>
    </main>
  );
}
import { Header } from "../../components/layout/Header/Header";
import { Footer } from "../../components/layout/Footer/Footer";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { useProfileData } from "../../hooks/useProfileData";

import "./profile.css";

function formatMemberSince(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return {
    hours,
    minutes: remainingMinutes,
  };
}

export default function Profile() {
  const { user, isLoading, error } = useProfileData();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="profile-page">
          <Header />

          <main className="profile-main">
            <p>Chargement du profil...</p>
          </main>

          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !user) {
    return (
      <ProtectedRoute>
        <div className="profile-page">
          <Header />

          <main className="profile-main">
            <p>{error ?? "Utilisateur introuvable."}</p>
          </main>

          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  const duration = formatDuration(user.totalDuration);

  return (
    <ProtectedRoute>
      <div className="profile-page">
        <Header />

        <main className="profile-main">
          <div className="profile-layout">

            {/* COLONNE GAUCHE */}
            <div className="profile-left-column">

              <section className="profile-user-card">
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="profile-picture"
                />

                <div>
                  <h1>{user.fullName}</h1>

                  <p>
                    Membre depuis le{" "}
                    {formatMemberSince(user.createdAt)}
                  </p>
                </div>
              </section>

              <section className="profile-details-card">
                <h2>Votre profil</h2>

                <div className="profile-separator" />

                <p>
                  Âge : <span>{user.age}</span>
                </p>

                <p>
                  Taille : <span>{user.height} cm</span>
                </p>

                <p>
                  Poids : <span>{user.weight} kg</span>
                </p>
              </section>

            </div>

            {/* COLONNE DROITE */}
            <section className="profile-statistics">
              <div className="profile-statistics-title">
                <h2>Vos statistiques</h2>

                <p>
                  depuis le {formatMemberSince(user.createdAt)}
                </p>
              </div>

              <div className="profile-statistics-grid">

                <article className="profile-stat-card">
                  <span>Temps total couru</span>

                  <div>
                    <strong>{duration.hours}h</strong>

                    {duration.minutes > 0 && (
                      <small>{duration.minutes}min</small>
                    )}
                  </div>
                  
                </article>
                <article className="profile-stat-card">
                  <span>Calories brûlées</span>

                  <div>
                    <strong>{user.totalCalories}</strong>
                    <small> cal</small>
                  </div>
                </article>

                <article className="profile-stat-card">
                  <span>Distance totale parcourue</span>

                  <div>
                    <strong>
                      {Math.round(user.totalDistance)}
                    </strong>

                    <small> km</small>
                  </div>
                </article>

                <article className="profile-stat-card">
                  <span>Nombre de sessions</span>

                  <div>
                    <strong>{user.totalSessions}</strong>
                    <small> sessions</small>
                  </div>
                </article>

              </div>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
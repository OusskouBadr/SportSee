import { useState } from "react";

import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Header } from "../../components/layout/Header/Header";
import { Footer } from "../../components/layout/Footer/Footer";

import { DistanceChart } from "../../components/charts/DistanceChart/DistanceChart";
import { HeartRateChart } from "../../components/charts/HeartRateChart/HeartRateChart";
import { WeeklyGoalChart } from "../../components/charts/WeeklyGoalChart/WeeklyGoalChart";

import { useDashboardData } from "../../hooks/useDashboardData";

import "./dashboard.css";

/* =========================
   FORMATAGE DES DATES
   ========================= */

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR").format(date);
}

function formatMemberSince(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatPeriodDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

/* =========================
   PÉRIODE DU DISTANCE CHART
   ========================= */

function getDistancePeriodLabel(
  activities: { date: string }[],
  periodOffset: number
) {
  if (activities.length === 0) {
    return "";
  }

  const sortedActivities = [...activities].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  const latestDate = new Date(
    `${sortedActivities[sortedActivities.length - 1].date}T12:00:00`
  );

  const daysSinceMonday =
    (latestDate.getDay() + 6) % 7;

  const currentWeekStart = new Date(latestDate);

  currentWeekStart.setDate(
    latestDate.getDate() - daysSinceMonday
  );

  currentWeekStart.setDate(
    currentWeekStart.getDate() + periodOffset * 28
  );

  const periodStart = new Date(currentWeekStart);

  periodStart.setDate(
    currentWeekStart.getDate() - 21
  );

  const periodEnd = new Date(currentWeekStart);

  periodEnd.setDate(
    currentWeekStart.getDate() + 6
  );

  return `${formatPeriodDate(periodStart)} - ${formatPeriodDate(
    periodEnd
  )}`;
}

/* =========================
   DASHBOARD
   ========================= */

export default function Dashboard() {
  const {
    user,
    activities,
    isLoading,
    error,
  } = useDashboardData();

  const [
    distancePeriodOffset,
    setDistancePeriodOffset,
  ] = useState(0);

  /* =========================
     LOADING
     ========================= */

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="dashboard-page">
          <Header />

          <main className="dashboard-main">
            <p>Chargement des données...</p>
          </main>

          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  /* =========================
     ERREUR
     ========================= */

  if (error || !user) {
    return (
      <ProtectedRoute>
        <div className="dashboard-page">
          <Header />

          <main className="dashboard-main">
            <p>
              {error ??
                "Utilisateur introuvable."}
            </p>
          </main>

          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  /* =========================
     PÉRIODES
     ========================= */

  const distancePeriod =
    getDistancePeriodLabel(
      activities,
      distancePeriodOffset
    );

  const firstActivity = activities[0];

  const lastActivity =
    activities[activities.length - 1];

  const heartRatePeriod =
    firstActivity && lastActivity
      ? `${formatPeriodDate(
          new Date(
            `${firstActivity.date}T12:00:00`
          )
        )} - ${formatPeriodDate(
          new Date(
            `${lastActivity.date}T12:00:00`
          )
        )}`
      : "";

  /* =========================
     MOYENNES
     ========================= */

  const averageDistance =
    activities.length > 0
      ? activities.reduce(
          (total, activity) =>
            total + activity.distance,
          0
        ) / activities.length
      : 0;

  const averageHeartRate =
    activities.length > 0
      ? activities.reduce(
          (total, activity) =>
            total +
            activity.averageHeartRate,
          0
        ) / activities.length
      : 0;

  /* =========================
     DERNIÈRE SEMAINE
     ========================= */

  const latestActivity =
    activities.at(-1);

  let weekActivities = activities;

  let weekLabel =
    "Aucune activité disponible";

  if (latestActivity) {
    const latestDate = new Date(
      `${latestActivity.date}T12:00:00`
    );

    const daysSinceMonday =
      (latestDate.getDay() + 6) % 7;

    const weekStart = new Date(latestDate);

    weekStart.setDate(
      latestDate.getDate() -
        daysSinceMonday
    );

    const weekEnd = new Date(weekStart);

    weekEnd.setDate(
      weekStart.getDate() + 6
    );

    weekActivities = activities.filter(
      (activity) => {
        const activityDate = new Date(
          `${activity.date}T12:00:00`
        );

        return (
          activityDate >= weekStart &&
          activityDate <= weekEnd
        );
      }
    );

    weekLabel = `Du ${formatDate(
      weekStart
    )} au ${formatDate(weekEnd)}`;
  }

  const weeklyDuration =
    weekActivities.reduce(
      (total, activity) =>
        total + activity.duration,
      0
    );

  const weeklyDistance =
    weekActivities.reduce(
      (total, activity) =>
        total + activity.distance,
      0
    );

  /*
   * L'objectif hebdomadaire n'est pas fourni
   * par l'endpoint actuel.
   *
   * Ces valeurs reproduisent donc la maquette.
   */
  const weeklyGoal = 6;
  const weeklyCompleted = 4;

  return (
    <ProtectedRoute>
      <div className="dashboard-page">
        <Header />

        <main className="dashboard-main">
          {/* =========================
              UTILISATEUR
              ========================= */}

          <section className="dashboard-user-card">
            <div className="dashboard-user-info">
              <div className="dashboard-profile-picture-wrapper">
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="dashboard-profile-picture"
                />
              </div>

              <div>
                <h1>{user.fullName}</h1>

                <p>
                  Membre depuis le{" "}
                  {formatMemberSince(
                    user.createdAt
                  )}
                </p>
              </div>
            </div>

            <div className="dashboard-total-distance">
              <span className="dashboard-total-distance-label">
                Distance totale parcourue
              </span>

              <div className="dashboard-distance-badge">
                <img
                  src="/icons/distance-outline.png"
                  alt=""
                  aria-hidden="true"
                  className="dashboard-distance-icon"
                />

                <strong>
                  {Math.round(
                    user.totalDistance
                  )}{" "}
                  km
                </strong>
              </div>
            </div>
          </section>

          {/* =========================
              PERFORMANCES
              ========================= */}

          <section className="dashboard-performance-section">
            <h2>
              Vos dernières performances
            </h2>

            <div className="dashboard-charts-grid">
              {/* DISTANCE */}

              <article className="dashboard-chart-card">
                <div className="dashboard-chart-header">
                  <div>
                    <strong className="dashboard-distance-average">
                      {averageDistance.toFixed(
                        1
                      )}{" "}
                      km en moyenne
                    </strong>

                    <p>
                      Total des kilomètres des
                      dernières semaines
                    </p>
                  </div>

                  <div className="dashboard-period">
                    <button
                      type="button"
                      aria-label="Période précédente"
                      onClick={() =>
                        setDistancePeriodOffset(
                          (current) =>
                            current - 1
                        )
                      }
                    >
                      ‹
                    </button>

                    <span>
                      {distancePeriod}
                    </span>

                    <button
                      type="button"
                      aria-label="Période suivante"
                      onClick={() =>
                        setDistancePeriodOffset(
                          (current) =>
                            current + 1
                        )
                      }
                    >
                      ›
                    </button>
                  </div>
                </div>

                <DistanceChart
                  activities={activities}
                  periodOffset={
                    distancePeriodOffset
                  }
                />
              </article>

              {/* FRÉQUENCE CARDIAQUE */}

              <article className="dashboard-chart-card">
                <div className="dashboard-chart-header">
                  <div>
                    <strong className="dashboard-heart-average">
                      {Math.round(
                        averageHeartRate
                      )}{" "}
                      BPM
                    </strong>

                    <p>
                      Fréquence cardiaque
                      moyenne
                    </p>
                  </div>

                  <div className="dashboard-period">
                    <button
                      type="button"
                      aria-label="Période précédente"
                    >
                      ‹
                    </button>

                    <span>
                      {heartRatePeriod}
                    </span>

                    <button
                      type="button"
                      aria-label="Période suivante"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <HeartRateChart
                  activities={activities}
                />

                <div className="dashboard-heart-legend">
                  <span>
                    <i className="legend-dot legend-min" />
                    Min
                  </span>

                  <span>
                    <i className="legend-dot legend-max" />
                    Max BPM
                  </span>

                  <span>
                    <i className="legend-dot legend-average" />
                    Moy. BPM
                  </span>
                </div>
              </article>
            </div>
          </section>

          {/* =========================
              CETTE SEMAINE
              ========================= */}

          <section className="dashboard-week-section">
            <div className="dashboard-week-title">
              <h2>Cette semaine</h2>

              <p>{weekLabel}</p>
            </div>

            <div className="dashboard-week-grid">
              {/* OBJECTIF HEBDOMADAIRE */}

              <article className="dashboard-goal-card">
                <div className="dashboard-goal-heading">
                  <div>
                    <strong className="dashboard-goal-number">
                      x{weeklyCompleted}
                    </strong>

                    <span className="dashboard-goal-target">
                      {" "}
                      sur objectif de{" "}
                      {weeklyGoal}
                    </span>
                  </div>

                  <p>
                    Courses hebdomadaires
                    réalisées
                  </p>
                </div>

                <WeeklyGoalChart
                  completed={
                    weeklyCompleted
                  }
                  goal={weeklyGoal}
                />
              </article>

              {/* STATISTIQUES SEMAINE */}

              <div className="dashboard-week-stats">
                <article className="dashboard-stat-card">
                  <span>
                    Durée d'activité
                  </span>

                  <div>
                    <strong>
                      {weeklyDuration}
                    </strong>

                    <small>
                      {" "}
                      minutes
                    </small>
                  </div>
                </article>

                <article className="dashboard-stat-card dashboard-stat-card-distance">
                  <span>Distance</span>

                  <div>
                    <strong>
                      {weeklyDistance.toFixed(
                        1
                      )}
                    </strong>

                    <small>
                      {" "}
                      kilomètres
                    </small>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
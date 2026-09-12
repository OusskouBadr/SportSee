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
   PÉRIODE DISTANCE
   4 SEMAINES
   ========================= */

function getDistancePeriod(
  activities: { date: string }[],
  periodOffset: number
) {
  if (activities.length === 0) {
    return null;
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
    latestDate.getDate() -
      daysSinceMonday +
      periodOffset * 28
  );

  const start = new Date(currentWeekStart);

  start.setDate(
    currentWeekStart.getDate() - 21
  );

  const end = new Date(currentWeekStart);

  end.setDate(
    currentWeekStart.getDate() + 6
  );

  return {
    start,
    end,
  };
}

/* =========================
   PÉRIODE HEART RATE
   1 SEMAINE
   ========================= */

function getHeartRatePeriod(
  activities: { date: string }[],
  periodOffset: number
) {
  if (activities.length === 0) {
    return null;
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
    latestDate.getDate() -
      daysSinceMonday +
      periodOffset * 28
  );

  const start = new Date(currentWeekStart);
  start.setDate(currentWeekStart.getDate() - 21);

  const end = new Date(currentWeekStart);
  end.setDate(currentWeekStart.getDate() + 6);

  return {
    start,
    end,
  };
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

  /*
   * IMPORTANT :
   * Les hooks restent toujours AVANT les return
   * conditionnels.
   */
  const [
    distancePeriodOffset,
    setDistancePeriodOffset,
  ] = useState(0);

  const [
    heartRatePeriodOffset,
    setHeartRatePeriodOffset,
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
     PÉRIODE DISTANCE
     ========================= */

  const distanceDates =
    getDistancePeriod(
      activities,
      distancePeriodOffset
    );

  const distancePeriod =
    distanceDates
      ? `${formatPeriodDate(
          distanceDates.start
        )} - ${formatPeriodDate(
          distanceDates.end
        )}`
      : "";

  const visibleDistanceActivities =
    distanceDates
      ? activities.filter((activity) => {
          const activityDate = new Date(
            `${activity.date}T12:00:00`
          );

          return (
            activityDate >=
              distanceDates.start &&
            activityDate <=
              distanceDates.end
          );
        })
      : [];

  const averageDistance =
    visibleDistanceActivities.length > 0
      ? visibleDistanceActivities.reduce(
          (total, activity) =>
            total + activity.distance,
          0
        ) /
        visibleDistanceActivities.length
      : 0;

  /* =========================
     PÉRIODE HEART RATE
     ========================= */

  const heartRateDates =
      getHeartRatePeriod(
      activities,
      heartRatePeriodOffset
    );

  const heartRatePeriod =
    heartRateDates
      ? `${formatPeriodDate(
          heartRateDates.start
        )} - ${formatPeriodDate(
          heartRateDates.end
        )}`
      : "";

  const visibleHeartRateActivities =
    heartRateDates
      ? activities.filter((activity) => {
          const activityDate = new Date(
            `${activity.date}T12:00:00`
          );

          return (
            activityDate >= heartRateDates.start &&
            activityDate <= heartRateDates.end
          );
        })
      : [];

  const averageHeartRate =
    visibleHeartRateActivities.length > 0
      ? visibleHeartRateActivities.reduce(
          (total, activity) =>
            total + activity.averageHeartRate,
          0
        ) / visibleHeartRateActivities.length
      : 0;

  /* =========================
     DERNIÈRE SEMAINE
     ========================= */

  const sortedActivities = [
    ...activities,
  ].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );

  const latestActivity =
    sortedActivities.at(-1);

  let weekActivities =
    sortedActivities;

  let weekLabel =
    "Aucune activité disponible";

  if (latestActivity) {
    const latestDate = new Date(
      `${latestActivity.date}T12:00:00`
    );

    const daysSinceMonday =
      (latestDate.getDay() + 6) % 7;

    const weekStart = new Date(
      latestDate
    );

    weekStart.setDate(
      latestDate.getDate() -
        daysSinceMonday
    );

    const weekEnd = new Date(
      weekStart
    );

    weekEnd.setDate(
      weekStart.getDate() + 6
    );

    weekActivities =
      sortedActivities.filter(
        (activity) => {
          const activityDate =
            new Date(
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
   * L'objectif hebdomadaire n'est pas
   * fourni par l'endpoint actuel.
   *
   * Ces deux valeurs reproduisent
   * la maquette Figma.
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
              DERNIÈRES PERFORMANCES
              ========================= */}

          <section className="dashboard-performance-section">
            <h2>
              Vos dernières performances
            </h2>

            <div className="dashboard-charts-grid">
              {/* =====================
                  DISTANCE
                  ===================== */}

              <article className="dashboard-chart-card">
                <div className="dashboard-chart-header">
                  <div>
                    <strong className="dashboard-distance-average">
                      {visibleDistanceActivities.length >
                      0
                        ? `${averageDistance.toFixed(
                            1
                          )} km en moyenne`
                        : "— km en moyenne"}
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

              {/* =====================
                  HEART RATE
                  ===================== */}

              <article className="dashboard-chart-card">
                <div className="dashboard-chart-header">
                  <div>
                    <strong className="dashboard-heart-average">
                      {visibleHeartRateActivities.length > 0
                        ? `${Math.round(averageHeartRate)} BPM`
                        : "— BPM"}
                    </strong>
                    <p>
                      Fréquence cardiaque
                      moyenne
                    </p>
                  </div>

                  <div className="dashboard-period">
                    <button
                      type="button"
                      aria-label="Semaine précédente"
                      onClick={() =>
                        setHeartRatePeriodOffset(
                          (current) =>
                            current - 1
                        )
                      }
                    >
                      ‹
                    </button>

                    <span>
                      {heartRatePeriod}
                    </span>

                    <button
                      type="button"
                      aria-label="Semaine suivante"
                      onClick={() =>
                        setHeartRatePeriodOffset(
                          (current) =>
                            current + 1
                        )
                      }
                    >
                      ›
                    </button>
                  </div>
                </div>

                <HeartRateChart
                  activities={visibleHeartRateActivities}
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
              {/* =====================
                  OBJECTIF
                  ===================== */}

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

              {/* =====================
                  STATS SEMAINE
                  ===================== */}

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
                  <span>
                    Distance
                  </span>

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
const express = require("express");
const jwt = require("jsonwebtoken");

const users = require("./data.json");

const { authenticateToken, generateToken } = require("./middleware");

const SECRET_KEY = "your-secret-key-12345";

const router = express.Router();

const getUserById = (userId) => {
  return users.find((user) => user.id === userId);
};

/**
 * POST /api/login
 * Returns a token for the user
 */
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);

  return res.json({
    token,
    userId: user.id,
  });
});

/**
 * GET /api/user-info
 * Returns user information including profile and statistics
 */
router.get("/api/user-info", authenticateToken, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, SECRET_KEY);

  const user = getUserById(decodedToken.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const runningData = user.runningData;

  const totalDistance = runningData
    .reduce((sum, session) => sum + session.distance, 0)
    .toFixed(1);

  const totalSessions = runningData.length;

  const totalDuration = runningData.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  const userProfile = {
    firstName: user.userInfos.firstName,
    lastName: user.userInfos.lastName,
    createdAt: user.userInfos.createdAt,
    age: user.userInfos.age,
    weight: user.userInfos.weight,
    height: user.userInfos.height,
    profilePicture: user.userInfos.profilePicture,
  };

  return res.json({
    profile: userProfile,
    statistics: {
      totalDistance,
      totalSessions,
      totalDuration,
    },
  });
});

/**
 * GET /api/user-activity
 * Returns running sessions between startWeek and endWeek
 */
router.get("/api/user-activity", authenticateToken, (req, res) => {
  const { startWeek, endWeek } = req.query;

  if (!startWeek || !endWeek) {
    return res
      .status(400)
      .json({ message: "startWeek and endWeek are required" });
  }

  const user = getUserById(req.user.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const startDate = new Date(startWeek);
  const endDate = new Date(endWeek);
  const now = new Date();

  const filteredSessions = user.runningData.filter((session) => {
    const sessionDate = new Date(session.date);

    return (
      sessionDate >= startDate &&
      sessionDate <= endDate &&
      sessionDate <= now
    );
  });

  const sortedSessions = filteredSessions.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return res.json(sortedSessions);
});

/**
 * POST /api/training-plan
 * Generates a personalized 6-week training plan with Mistral AI
 */
router.post("/api/training-plan", authenticateToken, async (req, res) => {
  try {
    if (!process.env.MISTRAL_API_KEY) {
      return res.status(500).json({
        message: "Mistral API key is not configured",
      });
    }

    const { objective, availability } = req.body;

    if (!objective || !availability) {
      return res.status(400).json({
        message: "objective and availability are required",
      });
    }

    const user = getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const availableDays =
      availability.match(
        /lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/gi
      ) || [];

    const normalizedAvailableDays = availableDays.map(
      (day) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
    );

    if (normalizedAvailableDays.length === 0) {
      return res.status(400).json({
        message: "No valid availability day found",
      });
    }

    const recentSessions = user.runningData.slice(-6);

    if (recentSessions.length === 0) {
      return res.status(400).json({
        message: "Not enough activity data to generate a training plan",
      });
    }

    const maxObservedHeartRate = Math.max(
      ...recentSessions.map((session) => session.heartRate.max)
    );

    const longestDistance = Math.max(
      ...recentSessions.map((session) => session.distance)
    );

    const totalRecentDistance = recentSessions.reduce(
      (sum, session) => sum + session.distance,
      0
    );

    const totalRecentDuration = recentSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    const averagePace = totalRecentDuration / totalRecentDistance;

    const averagePaceMinutes = Math.floor(averagePace);
    const averagePaceSeconds = Math.round(
      (averagePace - averagePaceMinutes) * 60
    );

    const averagePaceText = `${averagePaceMinutes}:${averagePaceSeconds
      .toString()
      .padStart(2, "0")} min/km`;

    const sessionsText = recentSessions
      .map(
        (session) =>
          `- ${session.date} : ${session.distance} km, ${session.duration} min, FC min ${session.heartRate.min}, max ${session.heartRate.max}, moyenne ${session.heartRate.average} BPM`
      )
      .join("\n");

    const prompt = `
Crée un plan personnalisé couvrant exactement les 6 prochaines semaines.
Adapte ces 6 semaines à l'échéance indiquée dans l'objectif de l'utilisateur.

OBJECTIF
${objective}

JOURS DISPONIBLES
${normalizedAvailableDays.join(", ")}

Nombre de jours disponibles : ${normalizedAvailableDays.length}

PROFIL
Âge : ${user.userInfos.age} ans
Taille : ${user.userInfos.height} cm
Poids : ${user.userInfos.weight} kg

HISTORIQUE RÉCENT
${sessionsText}

DONNÉES CALCULÉES
- Plus longue distance récente : ${longestDistance} km
- Fréquence cardiaque maximale réellement observée : ${maxObservedHeartRate} BPM
- Allure moyenne récente réellement observée : ${averagePaceText}

RÈGLES OBLIGATOIRES
- Le programme couvre exactement 6 semaines.
- Utilise exactement les jours suivants : ${normalizedAvailableDays.join(", ")}.
- Chaque semaine doit contenir exactement ${normalizedAvailableDays.length} entrées.
- N'ajoute et n'oublie aucun jour.
- Si une séance doit être remplacée pour éviter une surcharge, affiche ce jour avec "Repos".
- Affiche toutes les semaines de 1 à 6 sans en résumer ni en omettre.
- Adapte la progression aux performances récentes.
- Évite les augmentations brutales de distance ou d'intensité.
- Les allures doivent rester cohérentes avec l'allure moyenne observée de ${averagePaceText}.
- Ne recommande jamais une fréquence cardiaque supérieure à ${maxObservedHeartRate} BPM.
- N'utilise jamais un pourcentage de fréquence cardiaque maximale théorique.
- Si tu proposes une zone cardiaque, base-toi uniquement sur les valeurs observées.
- N'invente aucune blessure, pathologie ou donnée médicale.
- Les conseils alimentaires doivent rester simples, généraux et prudents.
- Analyse l'échéance mentionnée dans l'objectif.
- Si l'événement a lieu pendant les 6 semaines, réduis la charge avant l'événement puis prévois récupération et reprise progressive après celui-ci.
- Si l'objectif est situé au-delà des 6 semaines, précise que le programme représente les 6 premières semaines de préparation.
- La semaine 6 doit être plus légère si elle se situe encore avant l'événement.

FORMAT OBLIGATOIRE

### Semaine 1
- Jour : type de séance | distance ou durée | allure/intensité
- Jour : type de séance | distance ou durée | allure/intensité
Conseil : une phrase courte.

Répète cette structure jusqu'à :

### Semaine 6

Puis termine par :

### Remarque
Une ou deux phrases maximum.
`;

    const mistralResponse = await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "ministral-3b-latest",
          temperature: 0.2,
          max_tokens: 2200,
          messages: [
            {
              role: "system",
              content:
                "Tu es l'assistant SportSee spécialisé dans la création prudente de plans de course à pied. Respecte strictement les contraintes fournies et n'invente aucune donnée utilisateur.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!mistralResponse.ok) {
      const error = await mistralResponse.json();

      return res.status(mistralResponse.status).json({
        message: "Mistral API error",
        error,
      });
    }

    const data = await mistralResponse.json();

    const trainingPlan = data.choices?.[0]?.message?.content;

    if (!trainingPlan) {
      return res.status(502).json({
        message: "Invalid response from Mistral API",
      });
    }

    return res.json({
      trainingPlan,
    });
  } catch (error) {
    console.error("Training plan error:", error);

    return res.status(500).json({
      message: "Unable to generate training plan",
    });
  }
});

module.exports = router;
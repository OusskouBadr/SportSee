const express = require("express");
const jwt = require("jsonwebtoken");

const users = require("./data.json");

const SECRET_KEY = "your-secret-key-12345"; // In a real app, this would be in environment variables

const getUserById = (userId) => {
  return users.find((user) => user.id === userId);
};

const router = express.Router();

const { authenticateToken, generateToken } = require("./middleware");

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

  const runningData = user.runningData;

  const startDate = new Date(startWeek);
  const endDate = new Date(endWeek);
  const now = new Date();

  const filteredSessions = runningData.filter((session) => {
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

    const availableDays =
      availability.match(
        /lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/gi
      ) || [];

    const normalizedAvailableDays = availableDays.map(
      (day) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
    );

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

    const recentSessions = user.runningData.slice(-6);

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
Adapte ces 6 semaines à l'échéance précisée dans l'objectif de l'utilisateur.

OBJECTIF DE L'UTILISATEUR
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
- Ces 6 semaines constituent la prochaine étape vers l'objectif, même si l'objectif final est prévu dans plus de 6 semaines.
- Utilise uniquement les jours indiqués dans JOURS DISPONIBLES.
- Prévois une séance pour chaque jour disponible, sauf si une journée de récupération est nécessaire : dans ce cas indique explicitement "Repos".
- N'ajoute aucun autre jour.
- Affiche toutes les semaines de 1 à 6. Ne résume et n'omets aucune semaine.
- La progression doit être adaptée aux performances récentes.
- Évite les augmentations brutales de distance.
- Ne dépasse jamais ${maxObservedHeartRate} BPM dans les recommandations.
- Ne présente jamais une fréquence cardiaque calculée ou inventée comme une donnée utilisateur.
- La semaine 6 doit être plus légère que les semaines précédentes.
- Les conseils alimentaires doivent rester simples, généraux et prudents.
- N'invente aucune blessure, pathologie ou donnée médicale.
- Si l'objectif est trop éloigné pour être préparé entièrement en 6 semaines, indique que ce programme représente uniquement les 6 premières semaines de préparation.
- Les allures recommandées doivent rester cohérentes avec l'allure moyenne observée de ${averagePaceText}.
- N'invente pas d'allure arbitrairement beaucoup plus lente ou beaucoup plus rapide que l'historique.
- N'utilise jamais un pourcentage de fréquence cardiaque maximale théorique.
- Si tu proposes une zone de fréquence cardiaque, base-toi uniquement sur les valeurs réellement observées.
- Utilise exactement les jours suivants : ${normalizedAvailableDays.join(", ")}.
- Chaque semaine doit contenir exactement ${normalizedAvailableDays.length} entrées, une pour chacun de ces jours.
- N'ajoute aucun autre jour.
- N'oublie aucun des jours disponibles.
- Respecte l'ordre des jours fournis.
- Si une séance doit être remplacée par du repos pour éviter une surcharge, affiche quand même ce jour et indique explicitement "Repos".
- Le programme doit toujours couvrir exactement 6 semaines.
- Analyse la durée indiquée dans l'objectif utilisateur.
- Si l'événement sportif a lieu avant la fin des 6 semaines, adapte le programme à cette échéance.
- Les semaines avant l'événement servent à la préparation.
- La semaine contenant l'événement doit réduire la charge avant la course.
- Les semaines situées après l'événement doivent être consacrées à la récupération puis à une reprise progressive.
- Ne continue jamais à présenter les semaines après la date de l'événement comme des semaines de préparation à cette course.
- Si l'objectif se situe au-delà de 6 semaines, indique que le programme représente les 6 premières semaines de préparation.

FORMAT OBLIGATOIRE

### Semaine 1
- Jour : type de séance | distance ou durée | allure/intensité
- Jour : type de séance | distance ou durée | allure/intensité
Conseil : une phrase courte.

Répète exactement cette structure jusqu'à :

### Semaine 6

Puis termine par une section très courte :

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
                "Tu es l'assistant SportSee. Tu construis des plans de course prudents et tu respectes strictement toutes les contraintes fournies. Tu ne dois jamais omettre une semaine demandée ni inventer de données utilisateur.",
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

    return res.json({
      trainingPlan: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Training plan error:", error);

    return res.status(500).json({
      message: "Unable to generate training plan",
    });
  }
});

module.exports = router;
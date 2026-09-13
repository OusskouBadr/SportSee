# SportSee

SportSee est une application de suivi de performances sportives développée avec React.

L'application permet à un utilisateur de se connecter, consulter son tableau de bord sportif, visualiser ses performances à travers différents graphiques et accéder à ses statistiques personnelles.

## Fonctionnalités

- Authentification avec JWT
- Routes protégées
- Déconnexion
- Tableau de bord utilisateur
- Données récupérées depuis une API Node.js
- Graphique des distances avec Recharts
- Graphique de fréquence cardiaque avec Recharts
- Objectif hebdomadaire sous forme de donut
- Navigation entre différentes périodes
- Page profil
- Gestion des états de chargement et des erreurs
- Affichage adapté à une résolution minimale de 1024 × 768

## Technologies utilisées

### Frontend

- React
- TypeScript
- React Router
- Context API
- Recharts
- Fetch API
- CSS

cd frontend
npm install
npm run dev

### Backend

- Node.js
- API REST
- JWT
- Docker

cd backend
npm install
npm start

## Architecture frontend

Les appels HTTP sont séparés des composants React.

```text
API
 ↓
Services
 ↓
Hooks
 ↓
Adapters
 ↓
Composants React
 ↓
Recharts

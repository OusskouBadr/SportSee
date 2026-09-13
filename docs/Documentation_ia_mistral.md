# Documentation d'études de l'IA dans SportSee

## Objectif

L'objectif est de tester l'intégration de l'API Mistral afin de générer un plan d'entraînement personnalisé sur 6 semaines à partir des données sportives de l'utilisateur.

Le plan doit prendre en compte :
- l'objectif sportif ;
- les disponibilités ;
- les séances précédentes ;
- les distances, durées et fréquences cardiaques.

## API choisie

L'API utilisée est Mistral.

Les tests sont réalisés avec Postman et le modèle :

`ministral-3b-latest`

L'endpoint utilisé est :

`POST /v1/chat/completions`

La clé API est stockée dans une variable Postman :

`{{mistralApiKey}}`

Elle n'est jamais écrite directement dans les requêtes.

## Tests réalisés

### Vérification de la clé

Requête :

`GET /v1/models`

Résultat : `200 OK`

La clé API et l'authentification fonctionnent correctement.

### Test du chat

Le modèle `ministral-3b-latest` a répondu correctement à une première requête simple.

Résultat : `200 OK`

### Limite rencontrée

Un premier test avec `mistral-small-latest` a retourné :

`429 Rate limit exceeded`

Cette erreur montre qu'il faudra prévoir une gestion des quotas et du nombre de requêtes.

### Premier prompt SportSee

Un premier plan d'entraînement sur 6 semaines a été généré.

Le résultat était globalement exploitable mais présentait plusieurs problèmes :
- la réponse était trop longue et a été coupée ;
- certaines contraintes n'étaient pas respectées ;
- certaines intensités proposées étaient trop élevées par rapport aux données fournies.

Le prompt doit donc être amélioré pour mieux encadrer les réponses de l'IA.

## Amélioration du prompt

Une seconde version du prompt a donc ajouté des règles plus précises :

- exactement 3 séances par semaine ;
- uniquement les jours demandés ;
- ajout de dates réelles ;
- progression plus modérée ;
- ne pas dépasser les fréquences cardiaques observées ;
- réponse plus courte et plus structurée.

La température a également été réduite afin d'obtenir des réponses plus stables et moins créatives.

L'objectif est d'obtenir un plan plus cohérent avec les données réellement fournies par l'utilisateur.

## Résultat du prompt amélioré

La seconde version du prompt donne un résultat plus satisfaisant.

Améliorations observées :
- réponse complète, sans coupure ;
- exactement 3 séances par semaine ;
- progression plus modérée ;
- format plus court et plus lisible ;
- meilleure prise en compte des données fournies.

La réponse reste cependant imparfaite. Certaines dates peuvent être incohérentes avec les jours annoncés et certains conseils sont encore trop génériques.

Cela montre qu'un prompt plus précis améliore fortement le résultat, mais qu'une validation des données générées reste nécessaire avant de les afficher à l'utilisateur.

## Faisabilité de l'intégration

L'intégration d'une IA dans SportSee est techniquement réalisable.

Le prototype montre qu'il est possible d'envoyer les données sportives de l'utilisateur à l'API Mistral et de générer un plan d'entraînement personnalisé.

Pour une intégration réelle dans l'application, il faudra principalement :

- appeler l'API Mistral depuis le backend afin de protéger la clé API ;
- structurer et limiter les données envoyées ;
- vérifier les réponses avant de les afficher ;
- gérer les erreurs, quotas et coûts de l'API.

Une première version fonctionnelle pourrait être développée en quelques jours, puis améliorée progressivement grâce aux retours utilisateurs et à l'amélioration des prompts.

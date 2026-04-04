# SOTRA SAE – Documentation API Déclaration de Panne

> **À destination du développeur backend en charge de l'API de réception**  
> Version 1.0 – Avril 2026 | Confidentiel

---

## Table des matières

1. [Contexte du projet](#1-contexte-du-projet)
2. [Flux de soumission – Vue d'ensemble](#2-flux-de-soumission--vue-densemble)
3. [Endpoint attendu](#3-endpoint-attendu)
4. [Format des données envoyées (Body JSON)](#4-format-des-données-envoyées-body-json)
5. [Exemple d'appel HTTP complet](#5-exemple-dappel-http-complet)
6. [Actions requises de votre côté](#6-actions-requises-de-votre-côté)
7. [Stockage local offline – détail technique](#7-stockage-local-offline--détail-technique)

---

## 1. Contexte du projet

L'application **SOTRA SAE** est une Progressive Web App (PWA) mobile-first destinée aux conducteurs et agents de terrain de la SOTRA (Société des Transports Abidjanais). Elle permet la **déclaration en temps réel d'une panne de véhicule** depuis le terrain.



---

## 2. Flux de soumission – Vue d'ensemble

### 2.1 Étapes lors d'une déclaration

Voici le déroulé exact côté client au moment où l'agent soumet une déclaration :

1. L'agent remplit le formulaire (**type de panne**, **numéro de véhicule**, **ligne**)
2. La **position GPS** est récupérée automatiquement au chargement via `navigator.geolocation`. Si elle n'est pas encore disponible à la soumission, une nouvelle tentative est lancée
3. Un objet `PanneData` est construit avec un **identifiant unique** (timestamp-based) et l'heure ISO 8601 courante
4. **Si en ligne** → requête `POST` envoyée immédiatement à l'API
5. **Si hors ligne** (ou si la requête échoue) → l'objet est stocké en `localStorage` sous la clé `sotra_pannes_offline`
6. Dès que la **connexion est rétablie** (événement `online` du navigateur), toutes les pannes en attente sont relues et envoyées une par une

### 2.2 Scénarios de synchronisation

| Scénario | Comportement client | Statut affiché |
|---|---|---|
| Connexion disponible | POST immédiat vers l'API | *Panne envoyée avec succès !* |
| Hors ligne | Stockage `localStorage` | *Stockée hors ligne – envoi auto dès reconnexion* |
| Reconnexion réseau | Synchronisation automatique | *Données synchronisées !* |
| Erreur HTTP (non-2xx) | Stockage `localStorage` | Même comportement que hors ligne |

---

## 3. Endpoint attendu

### 3.1 Configuration actuelle (à remplacer)

Dans le fichier `lib/panne-config.ts` :

```ts
export const API_ENDPOINT = "https://YOUR_API_ENDPOINT_HERE"
```

> ⚠️ **Nous avons besoin de l'URL complète** à utiliser en production. Nous la remplacerons dans ce fichier.

### 3.2 Spécification de l'appel HTTP

| Propriété | Valeur |
|---|---|
| Méthode HTTP | `POST` |
| URL | **À définir par le développeur backend** |
| `Content-Type` | `application/json` |
| Authentification | Non implémentée côté client pour l'instant – à préciser si nécessaire |
| Réponse succès | HTTP `200` ou `201` (tout code **2xx** est accepté) |
| Réponse erreur | Tout code non-2xx déclenche le stockage offline |

> **Note :** L'application n'analyse pas le corps de la réponse HTTP. Seul `response.ok` est vérifié. Vous êtes libre de retourner le format de réponse de votre choix.

---

## 4. Format des données envoyées (Body JSON)

### 4.1 Structure complète

```json
{
  "id":             "panne-1712345678901",
  "type_panne":     "Problème moteur",
  "gps_position": {
    "latitude":  5.3364,
    "longitude": -4.0267
  },
  "vehicle_number": "SOTRA-123",
  "line":           "01",
  "time":           "2026-04-04T10:25:00.000Z"
}
```

### 4.2 Description de chaque champ

| Champ | Type JSON | Obligatoire | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Identifiant unique généré côté client. Format : `"panne-{timestamp}"` (ex. `panne-1712345678901`). Le timestamp est en millisecondes UTC. |
| `type_panne` | `string` | ✅ | Libellé du type de panne sélectionné par l'agent. Voir liste complète en [section 4.3](#43-valeurs-possibles--type_panne). |
| `gps_position` | `object` | ✅ | Objet contenant la position géographique du véhicule au moment de la déclaration. |
| `gps_position.latitude` | `number` | ✅ | Latitude en degrés décimaux (WGS 84). Valeur `0` si la géolocalisation n'a pas pu être obtenue. |
| `gps_position.longitude` | `number` | ✅ | Longitude en degrés décimaux (WGS 84). Valeur `0` si la géolocalisation n'a pas pu être obtenue. |
| `vehicle_number` | `string` | ✅ | Numéro de véhicule saisi manuellement par l'agent. Texte libre, souvent préfixé `SOTRA-`. |
| `line` | `string` | ✅ | Code court de la ligne de bus (ex. `"01"`, `"82"`). Voir liste complète en [section 4.4](#44-valeurs-possibles--line-code-de-ligne). |
| `time` | `string` (ISO 8601) | ✅ | Date et heure de la déclaration au format ISO 8601 UTC. Générée avec `new Date().toISOString()`. |

### 4.3 Valeurs possibles – `type_panne`

> Le champ contient le **libellé** (label), pas la clé interne. Si vous préférez recevoir la clé (ex. `"moteur"`), nous pouvons adapter le code côté client.

| Valeur envoyée (`type_panne`) | Clé interne (`value`) |
|---|---|
| `Problème moteur` | `moteur` |
| `Problème de freins` | `freins` |
| `Pneu crevé / endommagé` | `pneu` |
| `Panne électrique` | `electrique` |
| `Climatisation en panne` | `climatisation` |
| `Panne de carburant` | `carburant` |
| `Problème de transmission` | `transmission` |
| `Problème de direction` | `direction` |
| `Autre` | `autre` |

### 4.4 Valeurs possibles – `line` (code de ligne)

| Code (`line`) | Libellé complet |
|---|---|
| `01` | Ligne 01 – Abobo / Plateau |
| `02` | Ligne 02 – Yopougon / Treichville |
| `03` | Ligne 03 – Cocody / Adjamé |
| `04` | Ligne 04 – Marcory / Plateau |
| `05` | Ligne 05 – Koumassi / Adjamé |
| `08` | Ligne 08 – Port-Bouët / Plateau |
| `21` | Ligne 21 – Abobo / Adjamé |
| `22` | Ligne 22 – Yopougon / Adjamé |
| `23` | Ligne 23 – Cocody / Riviera |
| `24` | Ligne 24 – Bingerville / Plateau |
| `25` | Ligne 25 – Anyama / Adjamé |
| `81` | Ligne 81 – Express Abobo |
| `82` | Ligne 82 – Express Yopougon |

---

## 5. Exemple d'appel HTTP complet

### 5.1 Requête

```http
POST https://YOUR_API_ENDPOINT_HERE HTTP/1.1
Content-Type: application/json

{
  "id": "panne-1712232300000",
  "type_panne": "Panne électrique",
  "gps_position": { "latitude": 5.3600, "longitude": -4.0083 },
  "vehicle_number": "SOTRA-456",
  "line": "22",
  "time": "2026-04-04T10:25:00.000Z"
}
```

### 5.2 Code client – extrait de `hooks/use-offline-sync.ts`

```ts
const response = await fetch(API_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(panne),
});

if (response.ok) {
  // succès → panne retirée de la file offline
} else {
  // échec → panne conservée en localStorage pour retry
}
```

---

## 6. Actions requises de votre côté

Pour finaliser l'intégration, nous avons besoin des informations suivantes :

| Information attendue | Détail |
|---|---|
| **URL endpoint production** | L'URL complète (`https://...`) à renseigner dans `API_ENDPOINT` |
| **URL endpoint staging / test** | Si disponible, pour nos tests d'intégration |
| **Authentification** | Préciser si un token, une clé API ou un autre mécanisme est requis |
| **Liste des véhicules enregistrés** | Numéros déjà en base afin de mettre à jour les suggestions dans l'interface |
| **Liste des lignes actives** | Si elle diffère de notre liste (section 4.4), transmettre la liste officielle |
| **Types de pannes** | Si vous souhaitez une taxonomie différente de celle de la section 4.3 |
| **Contraintes CORS** | Préciser si des en-têtes `Access-Control-Allow-Origin` spécifiques sont nécessaires |

---

## 7. Stockage local offline – détail technique

Les pannes non envoyées sont stockées dans le `localStorage` du navigateur sous la clé :

```
"sotra_pannes_offline"
```

Le format est un **tableau JSON** d'objets `PanneData` :

```json
[
  { "id": "panne-1712232300000", "type_panne": "...", ... },
  { "id": "panne-1712232399999", "type_panne": "...", ... }
]
```

**Logique de synchronisation :**

- À chaque reconnexion réseau, la liste est parcourue entièrement
- Pour chaque panne : si le POST réussit (2xx) → retirée de la liste locale
- Si le POST échoue → conservée pour la prochaine tentative
- Il n'y a **pas de mécanisme de déduplication côté client** → l'API doit gérer d'éventuels doublons via le champ `id`

---

*© 2026 SOTRA – Société des Transports Abidjanais | Document confidentiel à usage interne*

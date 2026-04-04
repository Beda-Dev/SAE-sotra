// Configuration modulaire pour le formulaire de déclaration de panne SAE
// Modifiez ces valeurs pour personnaliser le formulaire

export const API_ENDPOINT = "https://gmao-project.odoo.com/sotra_gmao/api/panne"

// Types de pannes disponibles
export const TYPES_PANNES = [
  { value: "moteur", label: "Problème moteur" },
  { value: "freins", label: "Problème de freins" },
  { value: "pneu", label: "Pneu crevé / endommagé" },
  { value: "electrique", label: "Panne électrique" },
  { value: "climatisation", label: "Climatisation en panne" },
  { value: "carburant", label: "Panne de carburant" },
  { value: "transmission", label: "Problème de transmission" },
  { value: "direction", label: "Problème de direction" },
  { value: "autre", label: "Autre" },
]

// Lignes de bus disponibles
export const LIGNES_BUS = [
  { value: "01", label: "Ligne 01 - Abobo / Plateau" },
  { value: "02", label: "Ligne 02 - Yopougon / Treichville" },
  { value: "03", label: "Ligne 03 - Cocody / Adjamé" },
  { value: "04", label: "Ligne 04 - Marcory / Plateau" },
  { value: "05", label: "Ligne 05 - Koumassi / Adjamé" },
  { value: "08", label: "Ligne 08 - Port-Bouët / Plateau" },
  { value: "21", label: "Ligne 21 - Abobo / Adjamé" },
  { value: "22", label: "Ligne 22 - Yopougon / Adjamé" },
  { value: "23", label: "Ligne 23 - Cocody / Riviera" },
  { value: "24", label: "Ligne 24 - Bingerville / Plateau" },
  { value: "25", label: "Ligne 25 - Anyama / Adjamé" },
  { value: "81", label: "Ligne 81 - Express Abobo" },
  { value: "82", label: "Ligne 82 - Express Yopougon" },
]

// Préfixes de véhicules suggérés
export const PREFIXES_VEHICULES = [
  "SOTRA-",
  "BUS-",
  "VH-",
]

// Messages de l'application
export const MESSAGES = {
  success: "Panne déclarée avec succès !",
  offline: "Vous êtes hors ligne. La panne sera envoyée automatiquement dès que la connexion sera rétablie.",
  error: "Erreur lors de l'envoi. Veuillez réessayer.",
  syncing: "Synchronisation en cours...",
  synced: "Données synchronisées !",
  gpsError: "Impossible de récupérer la position GPS.",
  gpsLoading: "Récupération de la position...",
}

// Clé de stockage local pour les pannes hors ligne
export const STORAGE_KEY = "sotra_pannes_offline"

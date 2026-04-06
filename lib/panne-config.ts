// Configuration modulaire pour le formulaire de déclaration de panne SAE
// Modifiez ces valeurs pour personnaliser le formulaire

export const API_ENDPOINT = "https://gmao-project.odoo.com/sotra_gmao/api/panne"

// Types de pannes disponibles
export const TYPES_PANNES = [
  { value: "moteur", label: "Moteur" },
  { value: "boite-vitesse", label: "Boîte de vitesse" },
  { value: "suspension", label: "Suspension" },
  { value: "circuit-freinage", label: "Circuit de freinage" },
  { value: "circuit-electrique", label: "Circuit électrique" },
  { value: "pont", label: "Pont" },
  { value: "carrosserie", label: "Carrosserie" },
  { value: "direction", label: "Direction" },
  { value: "autre", label: "Autres (à préciser)" },
]

// Bus disponibles avec leurs lignes associées
export const BUS_LIST = [
  { value: "BUS-0005", label: "BUS-0005", ligne: "Ligne 2 — Adjamé ↔ Treichville" },
  { value: "BUS-0006", label: "BUS-0006", ligne: "Ligne 3 — Adjamé ↔ Marcory" },
  { value: "BUS-0008", label: "BUS-0008", ligne: "Ligne 4 — Adjamé ↔ Koumassi" },
  { value: "BUS-0009", label: "BUS-0009", ligne: "Ligne 4 — Adjamé ↔ Koumassi" },
  { value: "BUS-0010", label: "BUS-0010", ligne: "Ligne 5 — Adjamé ↔ Port-Bouët" },
  { value: "BUS-0012", label: "BUS-0012", ligne: "Ligne 7 — Adjamé ↔ Cocody Riviera" },
  { value: "BUS-0013", label: "BUS-0013", ligne: "Ligne 7 — Adjamé ↔ Cocody Riviera" },
  { value: "BUS-0014", label: "BUS-0014", ligne: "Ligne 9 — Adjamé ↔ Bingerville" },
  { value: "BUS-0015", label: "BUS-0015", ligne: "Ligne 9 — Adjamé ↔ Bingerville" },
  { value: "BUS-0016", label: "BUS-0016", ligne: "Ligne 10 — Adjamé ↔ Anyama" },
  { value: "BUS-0017", label: "BUS-0017", ligne: "Ligne 11 — Adjamé ↔ Attécoubé" },
  { value: "BUS-0018", label: "BUS-0018", ligne: "Ligne 41 — Cocody ↔ Plateau" },
  { value: "BUS-0019", label: "BUS-0019", ligne: "Ligne 41 — Cocody ↔ Plateau" },
  { value: "BUS-0020", label: "BUS-0020", ligne: "Ligne 42 — Cocody ↔ Treichville" },
  { value: "BUS-0021", label: "BUS-0021", ligne: "Ligne 43 — Cocody ↔ Adjamé" },
  { value: "BUS-0022", label: "BUS-0022", ligne: "Ligne 44 — Riviera ↔ Plateau" },
  { value: "BUS-0023", label: "BUS-0023", ligne: "Ligne 45 — Bingerville ↔ Plateau" },
  { value: "BUS-0025", label: "BUS-0025", ligne: "Ligne 12 — Abobo ↔ Plateau" },
  { value: "BUS-0027", label: "BUS-0027", ligne: "Ligne 12 — Abobo ↔ Plateau" },
  { value: "BUS-0028", label: "BUS-0028", ligne: "Ligne 13 — Abobo ↔ Treichville" },
  { value: "BUS-0029", label: "BUS-0029", ligne: "Ligne 13 — Abobo ↔ Treichville" },
  { value: "BUS-0030", label: "BUS-0030", ligne: "Ligne 14 — Abobo ↔ Koumassi" },
  { value: "BUS-0031", label: "BUS-0031", ligne: "Ligne 14 — Abobo ↔ Koumassi" },
  { value: "BUS-0032", label: "BUS-0032", ligne: "Ligne 15 — Abobo ↔ Marcory" },
  { value: "BUS-0034", label: "BUS-0034", ligne: "Ligne 17 — Abobo ↔ Anyama" },
  { value: "BUS-0035", label: "BUS-0035", ligne: "Ligne 52 — Express Abobo ↔ Plateau" },
  { value: "BUS-0037", label: "BUS-0037", ligne: "Ligne 21 — Yopougon ↔ Plateau" },
  { value: "BUS-0038", label: "BUS-0038", ligne: "Ligne 21 — Yopougon ↔ Plateau" },
  { value: "BUS-0042", label: "BUS-0042", ligne: "Ligne 23 — Yopougon ↔ Adjamé" },
  { value: "BUS-0043", label: "BUS-0043", ligne: "Ligne 24 — Yopougon ↔ Koumassi" },
  { value: "BUS-0045", label: "BUS-0045", ligne: "Ligne 25 — Yopougon ↔ Marcory" },
  { value: "BUS-0046", label: "BUS-0046", ligne: "Ligne 26 — Yopougon ↔ Cocody" },
  { value: "BUS-0047", label: "BUS-0047", ligne: "Ligne 27 — Yopougon Niangon ↔ Plateau" },
  { value: "BUS-0048", label: "BUS-0048", ligne: "Ligne 28 — Yopougon Selmer ↔ Plateau" },
  { value: "BUS-0049", label: "BUS-0049", ligne: "Ligne 51 — Express Yopougon ↔ Plateau" },
  { value: "BUS-0050", label: "BUS-0050", ligne: "Ligne 31 — Koumassi ↔ Plateau" },
  { value: "BUS-0052", label: "BUS-0052", ligne: "Ligne 31 — Koumassi ↔ Plateau" },
  { value: "BUS-0053", label: "BUS-0053", ligne: "Ligne 32 — Koumassi ↔ Treichville" },
  { value: "BUS-0054", label: "BUS-0054", ligne: "Ligne 32 — Koumassi ↔ Treichville" },
  { value: "BUS-0056", label: "BUS-0056", ligne: "Ligne 53 — Express Koumassi ↔ Plateau" },
  { value: "BUS-0057", label: "BUS-0057", ligne: "Ligne 35 — Marcory ↔ Plateau" },
  { value: "BUS-0058", label: "BUS-0058", ligne: "Ligne 35 — Marcory ↔ Plateau" },
  { value: "BUS-0059", label: "BUS-0059", ligne: "Ligne 36 — Marcory ↔ Adjamé" },
  { value: "BUS-0060", label: "BUS-0060", ligne: "Ligne 33 — Port-Bouët ↔ Plateau" },
  { value: "BUS-0064", label: "BUS-0064", ligne: "Ligne 38 — Port-Bouët ↔ Adjamé" },
]

// Helper pour obtenir la ligne associée à un bus
export const getLineForBus = (busNumber: string): string => {
  const bus = BUS_LIST.find(b => b.value === busNumber)
  return bus ? bus.ligne : ""
}

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

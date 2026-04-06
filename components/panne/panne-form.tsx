"use client"

import { useState, useEffect, useCallback } from "react"
import { Bus, Route, AlertTriangle, Send, Loader2, MapPin, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SelectField } from "./select-field"
import { InputField } from "./input-field"
import { StatusIndicator } from "./status-indicator"
import { ConfirmationScreen } from "./confirmation-screen"
import { HistoryScreen } from "./history-screen"
import { useGPS } from "@/hooks/use-gps"
import { useOfflineSync, type PanneData } from "@/hooks/use-offline-sync"
import { useHistory } from "@/hooks/use-history"
import { TYPES_PANNES, BUS_LIST, getLineForBus } from "@/lib/panne-config"

type View = "form" | "confirmation" | "history"

export function PanneForm() {
  const [view, setView] = useState<View>("form")
  const [typePanne, setTypePanne] = useState("")
  const [busNumber, setBusNumber] = useState("")
  const [ligne, setLigne] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmitted, setLastSubmitted] = useState<PanneData | null>(null)
  const [lastSubmitStatus, setLastSubmitStatus] = useState<"sent" | "pending">("sent")
  const [gpsWarning, setGpsWarning] = useState(false)

  const { position, isLoading: gpsLoading, getPosition } = useGPS()
  const { isOnline, pendingCount, isSyncing, lastStatus, submitPanne, clearStatus } = useOfflineSync()
  const { history, addToHistory, updateStatus } = useHistory()

  // Debug les changements de view et history
  useEffect(() => {
    console.log(`👀 [RENDER] view=${view}, lastSubmitted=${lastSubmitted ? "OK" : "NULL"}, history.length=${history.length}, pendingCount=${pendingCount}`)
  }, [view, lastSubmitted, history.length, pendingCount])

  // Alert quand l'historique change
  useEffect(() => {
    if (history.length > 0) {
      console.log(`📚 [DEBUG] Histoire a ${history.length} entrée(s):`)
      history.forEach((entry, idx) => {
        console.log(`   [${idx}] ${entry.id} - ${entry.type_panne} (${entry.status})`)
      })
    }
  }, [history])

  // GPS auto au chargement
  useEffect(() => {
    console.log("📍 [GPS] Demande de position GPS...")
    getPosition()
  }, [getPosition])

  // Remplir automatiquement la ligne quand un bus est sélectionné
  useEffect(() => {
    if (busNumber) {
      const autoLigne = getLineForBus(busNumber)
      setLigne(autoLigne)
      console.log(`🚍 [BUS] Sélection du bus ${busNumber} → ligne ${autoLigne}`)
    }
  }, [busNumber])

  // Effacer le statut après 5 secondes
  useEffect(() => {
    if (lastStatus) {
      const timeout = setTimeout(() => clearStatus(), 5000)
      return () => clearTimeout(timeout)
    }
  }, [lastStatus, clearStatus])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!typePanne || !busNumber || !ligne) return

    console.log("📋 [FORM] Validation du formulaire...")

    const hasGPS = position && (position.latitude !== 0 || position.longitude !== 0)

    // Avertissement GPS mais on laisse soumettre
    if (!hasGPS) {
      console.warn("⚠️  [GPS] Pas de position GPS valide")
      setGpsWarning(true)
    } else {
      console.log(`✅ [GPS] Position GPS: ${position.latitude}, ${position.longitude}`)
    }

    console.log("📤 [FORM] Préparation de la soumission...")
    setIsSubmitting(true)

    const panneData: PanneData = {
      id: `panne-${Date.now()}`,
      type_panne: TYPES_PANNES.find((t) => t.value === typePanne)?.label || typePanne,
      gps_position: position
        ? { latitude: position.latitude, longitude: position.longitude }
        : { latitude: 0, longitude: 0 },
      vehicle_number: busNumber,
      line: ligne,
      time: new Date().toISOString(),
    }

    console.log(`🚀 [FORM] Envoi de la panne...`)
    const resultPanne = await submitPanne(panneData)

    if (!resultPanne) {
      // Erreur lors de l'envoi - données sauvegardées localement
      console.log("⏸️  [FORM] Panne en attente - Montrer confirmation quand même")
    }

    // Enregistrement dans l'historique TOUJOURS
    const historyStatus = resultPanne ? "sent" : "pending"
    console.log(`📚 [HISTORY] Ajout à l'historique - Statut: ${historyStatus}`)
    addToHistory(panneData, historyStatus)

    // Utiliser la panne retournée si disponible, sinon utiliser la panne d'origine
    const finalPanne = resultPanne || panneData
    setLastSubmitted(finalPanne)
    setLastSubmitStatus(historyStatus)
    console.log(`✅ [FORM] lastSubmitted défini et view sera confirmatio avec status=${historyStatus}`)

    // Réinitialisation
    console.log("🔄 [FORM] Réinitialisation du formulaire")
    setTypePanne("")
    setBusNumber("")
    setLigne("")
    setGpsWarning(false)
    setIsSubmitting(false)

    console.log("✅ [FORM] Passage à l'écran de confirmation")
    setView("confirmation")
  }, [typePanne, busNumber, ligne, position, submitPanne, addToHistory])

  const handleNewDeclaration = useCallback(() => {
    setView("form")
    setLastSubmitted(null)
    // Relancer le GPS pour la prochaine déclaration
    getPosition()
  }, [getPosition])

  // Écoute des synchros réussies pour mettre à jour l'historique
  useEffect(() => {
    if (lastStatus === "success" && history.length > 0) {
      // Marquer les déclarations en attente comme envoyées
      history
        .filter((e) => e.status === "pending")
        .forEach((e) => updateStatus(e.id, "sent"))
    }
  }, [lastStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  const isFormValid = typePanne && busNumber && ligne

  // ─── Vue Confirmation ───────────────────────────────────────────────────────
  if (view === "confirmation" && lastSubmitted) {
    return (
      <ConfirmationScreen
        panne={lastSubmitted}
        status={lastSubmitStatus}
        onNewDeclaration={handleNewDeclaration}
        onViewHistory={() => setView("history")}
      />
    )
  }

  // ─── Vue Historique ─────────────────────────────────────────────────────────
  if (view === "history") {
    return (
      <HistoryScreen
        history={history}
        onBack={() => setView(lastSubmitted ? "confirmation" : "form")}
        onClear={() => {
          try {
            localStorage.removeItem("sotra_history")
          } catch {}
          window.location.reload()
        }}
      />
    )
  }

  // ─── Vue Formulaire ─────────────────────────────────────────────────────────
  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-xl pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-secondary rounded-lg">
              <AlertTriangle className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Déclaration de Panne SAE</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                SOTRA - Côte d&apos;Ivoire
              </CardDescription>
            </div>
          </div>
          {/* Bouton historique */}
          {history.length > 0 && (
            <button
              onClick={() => setView("history")}
              title="Voir l'historique"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md text-sm font-medium transition-colors shrink-0"
            >
              <History className="h-4 w-4" />
              <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 min-w-fit">
                {history.length}
              </span>
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-5">
        <StatusIndicator
          isOnline={isOnline}
          pendingCount={pendingCount}
          isSyncing={isSyncing}
          lastStatus={lastStatus}
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type de panne */}
          <SelectField
            id="type-panne"
            label="Type de panne"
            placeholder="Sélectionnez le type de panne"
            options={TYPES_PANNES}
            value={typePanne}
            onChange={setTypePanne}
            icon={AlertTriangle}
          />

          {/* Bus */}
          <SelectField
            id="bus-number"
            label="Bus"
            placeholder="Sélectionnez le bus"
            options={BUS_LIST}
            value={busNumber}
            onChange={setBusNumber}
            icon={Bus}
          />

          {/* Ligne (auto-remplie) */}
          <div className="space-y-1.5">
            <label htmlFor="ligne" className="block text-sm font-medium text-foreground">
              Ligne <span className="text-green-600 text-xs ml-1">(automatique)</span>
            </label>
            <div className="relative">
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-input bg-background text-foreground">
                <Route className="h-4 w-4 text-foreground/60 shrink-0" />
                <span className={ligne ? "text-foreground" : "text-foreground/50"}>
                  {ligne || "La ligne s'affichera après la sélection du bus"}
                </span>
              </div>
            </div>
          </div>

          {/* Statut GPS */}
          <div className="space-y-1">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              position
                ? "bg-green-50 text-green-700"
                : gpsLoading
                ? "bg-blue-50 text-blue-700"
                : "bg-amber-50 text-amber-700"
            }`}>
              <MapPin className="h-4 w-4 shrink-0" />
              {gpsLoading ? (
                <span>Récupération de la position GPS...</span>
              ) : position ? (
                <span>GPS : {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}</span>
              ) : (
                <span>Position GPS non disponible — la déclaration sera envoyée sans localisation</span>
              )}
              {!position && !gpsLoading && (
                <button
                  type="button"
                  onClick={getPosition}
                  className="ml-auto underline text-xs shrink-0"
                >
                  Réessayer
                </button>
              )}
            </div>

            {/* Avertissement GPS bloquant affiché si tentative de soumission sans GPS */}
            {gpsWarning && !position && (
              <p className="text-xs text-amber-600 px-1">
                ⚠ Soumission sans GPS — assurez-vous d'avoir activé la géolocalisation pour une localisation précise.
              </p>
            )}
          </div>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full h-14 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Déclarer la panne
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
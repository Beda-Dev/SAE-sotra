"use client"

import { useState, useEffect } from "react"
import { Bus, Route, AlertTriangle, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SelectField } from "./select-field"
import { InputField } from "./input-field"
import { StatusIndicator } from "./status-indicator"
import { useGPS } from "@/hooks/use-gps"
import { useOfflineSync, type PanneData } from "@/hooks/use-offline-sync"
import { TYPES_PANNES, LIGNES_BUS } from "@/lib/panne-config"

export function PanneForm() {
  const [typePanne, setTypePanne] = useState("")
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [ligne, setLigne] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { position, getPosition } = useGPS()
  const { isOnline, pendingCount, isSyncing, lastStatus, submitPanne, clearStatus } = useOfflineSync()

  // Récupérer automatiquement la position GPS au chargement
  useEffect(() => {
    getPosition()
  }, [getPosition])

  // Effacer le statut après 5 secondes
  useEffect(() => {
    if (lastStatus) {
      const timeout = setTimeout(() => clearStatus(), 5000)
      return () => clearTimeout(timeout)
    }
  }, [lastStatus, clearStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!typePanne || !vehicleNumber || !ligne) {
      return
    }

    // Récupérer la position GPS au moment de la soumission si pas encore disponible
    if (!position) {
      getPosition()
    }

    setIsSubmitting(true)

    const panneData: PanneData = {
      id: `panne-${Date.now()}`,
      type_panne: TYPES_PANNES.find((t) => t.value === typePanne)?.label || typePanne,
      gps_position: position || { latitude: 0, longitude: 0 },
      vehicle_number: vehicleNumber,
      line: ligne,
      time: new Date().toISOString(),
    }

    await submitPanne(panneData)

    // Réinitialiser le formulaire
    setTypePanne("")
    setVehicleNumber("")
    setLigne("")
    setIsSubmitting(false)
  }

  const isFormValid = typePanne && vehicleNumber && ligne

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-xl pb-6">
        <div className="flex items-center gap-3">
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
      </CardHeader>

      <CardContent className="pt-6 space-y-5">
        {/* Indicateurs de statut */}
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

          {/* Numéro du véhicule */}
          <InputField
            id="vehicle-number"
            label="Numéro du véhicule"
            placeholder="Ex: SOTRA-123"
            value={vehicleNumber}
            onChange={setVehicleNumber}
            icon={Bus}
          />

          {/* Ligne */}
          <SelectField
            id="ligne"
            label="Ligne"
            placeholder="Sélectionnez la ligne"
            options={LIGNES_BUS}
            value={ligne}
            onChange={setLigne}
            icon={Route}
          />

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

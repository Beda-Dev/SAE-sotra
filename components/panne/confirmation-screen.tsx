"use client"

import { CheckCircle2, Clock, MapPin, Bus, Route, AlertTriangle, Plus, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PanneData } from "@/hooks/use-offline-sync"
import { LIGNES_BUS } from "@/lib/panne-config"

interface ConfirmationScreenProps {
  panne: PanneData
  status: "sent" | "pending"
  onNewDeclaration: () => void
  onViewHistory: () => void
}

export function ConfirmationScreen({
  panne,
  status,
  onNewDeclaration,
  onViewHistory,
}: ConfirmationScreenProps) {
  const isSent = status === "sent"
  const ligneName = LIGNES_BUS.find((l) => l.value === panne.line)?.label ?? panne.line
  const hasGPS = panne.gps_position.latitude !== 0 || panne.gps_position.longitude !== 0

  const formattedTime = new Intl.DateTimeFormat("fr-CI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(panne.time))

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <CardHeader
        className={cn(
          "rounded-t-xl pb-6 text-white",
          isSent ? "bg-green-600" : "bg-amber-500"
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={cn(
              "p-3 rounded-full",
              isSent ? "bg-green-500" : "bg-amber-400"
            )}
          >
            {isSent ? (
              <CheckCircle2 className="h-10 w-10 text-white" />
            ) : (
              <Clock className="h-10 w-10 text-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              {isSent ? "Panne déclarée !" : "Déclaration enregistrée"}
            </CardTitle>
            <p className="text-sm mt-1 opacity-90">
              {isSent
                ? "Votre déclaration a été transmise avec succès."
                : "Hors ligne – envoi automatique dès reconnexion."}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Référence */}
        <div className="bg-muted rounded-lg px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Référence</p>
          <p className="font-mono text-sm font-semibold text-foreground">{panne.id}</p>
        </div>

        {/* Détails de la déclaration */}
        <div className="space-y-3">
          <DetailRow
            icon={<AlertTriangle className="h-4 w-4 text-primary" />}
            label="Type de panne"
            value={panne.type_panne}
          />
          <DetailRow
            icon={<Bus className="h-4 w-4 text-primary" />}
            label="Véhicule"
            value={panne.vehicle_number}
          />
          <DetailRow
            icon={<Route className="h-4 w-4 text-primary" />}
            label="Ligne"
            value={ligneName}
          />
          <DetailRow
            icon={<Clock className="h-4 w-4 text-primary" />}
            label="Heure de déclaration"
            value={formattedTime}
          />
          <DetailRow
            icon={<MapPin className="h-4 w-4 text-primary" />}
            label="Position GPS"
            value={
              hasGPS
                ? `${panne.gps_position.latitude.toFixed(5)}, ${panne.gps_position.longitude.toFixed(5)}`
                : "Non disponible"
            }
            valueClassName={!hasGPS ? "text-amber-600" : undefined}
          />
        </div>

        {/* Warning GPS manquant */}
        {!hasGPS && (
          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>La position GPS n'a pas pu être récupérée. L'équipe de maintenance devra localiser le véhicule manuellement.</span>
          </div>
        )}

        {/* Warning hors ligne */}
        {!isSent && (
          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <Clock className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Cette déclaration sera automatiquement envoyée dès que la connexion sera rétablie.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={onNewDeclaration}
            className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouvelle déclaration
          </Button>
          <Button
            variant="outline"
            onClick={onViewHistory}
            className="w-full h-12 text-base font-medium border-2"
          >
            <History className="mr-2 h-5 w-5" />
            Voir l'historique
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DetailRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-medium text-foreground truncate", valueClassName)}>
          {value}
        </p>
      </div>
    </div>
  )
}
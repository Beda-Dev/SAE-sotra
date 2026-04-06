"use client"

import { CheckCircle2, Clock, MapPin, Bus, Route, AlertTriangle, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { HistoryEntry } from "@/hooks/use-history"
import { BUS_LIST } from "@/lib/panne-config"

interface HistoryScreenProps {
  history: HistoryEntry[]
  onBack: () => void
  onClear: () => void
}

export function HistoryScreen({ history, onBack, onClear }: HistoryScreenProps) {
  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-xl pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/20 -ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1">
            <CardTitle className="text-lg font-bold">Historique</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-sm">
              {history.length} déclaration{history.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="text-primary-foreground hover:bg-primary-foreground/20 -mr-2"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 px-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="p-4 bg-muted rounded-full">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Aucune déclaration pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {history.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const isSent = entry.status === "sent"
  const ligneName = BUS_LIST.find((l) => l.value === entry.line)?.label ?? entry.line
  const hasGPS = entry.gps_position.latitude !== 0 || entry.gps_position.longitude !== 0

  const formattedTime = new Intl.DateTimeFormat("fr-CI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(entry.time))

  return (
    <div className={cn(
      "rounded-lg border p-3 space-y-2",
      isSent ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
    )}>
      {/* Header de la carte */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn(
            "p-1 rounded-full shrink-0",
            isSent ? "bg-green-100" : "bg-amber-100"
          )}>
            {isSent ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-amber-600" />
            )}
          </div>
          <span className={cn(
            "text-xs font-semibold",
            isSent ? "text-green-700" : "text-amber-700"
          )}>
            {isSent ? "Envoyée" : "En attente"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{formattedTime}</span>
      </div>

      {/* Détails */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <InfoItem icon={<AlertTriangle className="h-3 w-3" />} value={entry.type_panne} />
        <InfoItem icon={<Bus className="h-3 w-3" />} value={entry.vehicle_number} />
        <InfoItem icon={<Route className="h-3 w-3" />} value={ligneName} />
        <InfoItem
          icon={<MapPin className="h-3 w-3" />}
          value={hasGPS ? `${entry.gps_position.latitude.toFixed(3)}…` : "GPS N/A"}
          className={!hasGPS ? "text-amber-600" : undefined}
        />
      </div>

      {/* Référence */}
      <p className="text-xs font-mono text-muted-foreground truncate">{entry.id}</p>
    </div>
  )
}

function InfoItem({
  icon,
  value,
  className,
}: {
  icon: React.ReactNode
  value: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-foreground min-w-0", className)}>
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  )
}
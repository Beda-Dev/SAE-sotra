"use client"

import { Wifi, WifiOff, Cloud, CloudOff, CheckCircle2, AlertCircle, Loader2, HardDrive } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  isOnline: boolean
  pendingCount: number
  isSyncing: boolean
  lastStatus: "success" | "offline" | "error" | "storage_full" | null
}

export function StatusIndicator({ isOnline, pendingCount, isSyncing, lastStatus }: StatusIndicatorProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Indicateur de connexion */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
          isOnline
            ? "bg-green-100 text-green-800"
            : "bg-orange-100 text-orange-800"
        )}
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>En ligne</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Hors ligne</span>
          </>
        )}
      </div>

      {/* Pannes en attente */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-800">
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Synchronisation en cours...</span>
            </>
          ) : (
            <>
              <CloudOff className="h-4 w-4" />
              <span>{pendingCount} panne{pendingCount > 1 ? "s" : ""} en attente</span>
            </>
          )}
        </div>
      )}

      {/* Statut de la dernière action */}
      {lastStatus && (
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium animate-in fade-in duration-300",
            lastStatus === "success" && "bg-green-100 text-green-800",
            lastStatus === "offline" && "bg-blue-100 text-blue-800",
            lastStatus === "error" && "bg-red-100 text-red-800",
            lastStatus === "storage_full" && "bg-red-100 text-red-800"
          )}
        >
          {lastStatus === "success" && (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Panne envoyée avec succès !</span>
            </>
          )}
          {lastStatus === "offline" && (
            <>
              <Cloud className="h-4 w-4" />
              <span>Stockée hors ligne — envoi automatique dès reconnexion</span>
            </>
          )}
          {lastStatus === "error" && (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>Erreur lors de l&apos;envoi</span>
            </>
          )}
          {lastStatus === "storage_full" && (
            <>
              <HardDrive className="h-4 w-4" />
              <span>Stockage local plein (100 pannes en attente). Reconnectez-vous pour libérer de l&apos;espace.</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
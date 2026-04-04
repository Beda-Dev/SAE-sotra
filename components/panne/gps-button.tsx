"use client"

import { MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GPSPosition } from "@/hooks/use-gps"

interface GPSButtonProps {
  position: GPSPosition | null
  isLoading: boolean
  error: string | null
  onGetPosition: () => void
}

export function GPSButton({ position, isLoading, error, onGetPosition }: GPSButtonProps) {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={onGetPosition}
        disabled={isLoading}
        className={cn(
          "w-full h-12 text-base font-medium border-2 transition-all",
          position
            ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
            : "border-primary/30 hover:border-primary hover:bg-primary/5"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Récupération en cours...
          </>
        ) : position ? (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Position récupérée
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-5 w-5" />
            Récupérer ma position GPS
          </>
        )}
      </Button>

      {position && (
        <div className="px-3 py-2 bg-muted rounded-lg text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Lat: {position.lat}, Lng: {position.lng}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

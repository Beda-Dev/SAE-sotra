"use client"

import { useState, useCallback } from "react"

export interface GPSPosition {
  latitude: number
  longitude: number
}

export function useGPS() {
  const [position, setPosition] = useState<GPSPosition | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.")
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        setIsLoading(false)
      },
      (err) => {
        let errorMessage = "Impossible de récupérer la position GPS."
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée."
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible."
            break
          case err.TIMEOUT:
            errorMessage = "Délai de récupération dépassé."
            break
        }
        
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  const clearPosition = useCallback(() => {
    setPosition(null)
    setError(null)
  }, [])

  return {
    position,
    isLoading,
    error,
    getPosition,
    clearPosition,
  }
}

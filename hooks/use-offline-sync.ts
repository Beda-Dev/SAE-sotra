"use client"

import { useState, useEffect, useCallback } from "react"
import { API_ENDPOINT, STORAGE_KEY, MESSAGES } from "@/lib/panne-config"

export interface PanneData {
  id: string
  type_panne: string
  gps_position: {
    latitude: number
    longitude: number
  }
  vehicle_number: string
  line: string
  time: string
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastStatus, setLastStatus] = useState<"success" | "offline" | "error" | null>(null)

  // Vérifier le statut de connexion
  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingData()
    }
    
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    // Charger le nombre de pannes en attente
    loadPendingCount()
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadPendingCount = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const data = stored ? JSON.parse(stored) : []
      setPendingCount(data.length)
    } catch {
      setPendingCount(0)
    }
  }, [])

  const savePanneLocally = useCallback((panne: PanneData) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const data = stored ? JSON.parse(stored) : []
      data.push(panne)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setPendingCount(data.length)
    } catch (error) {
      console.error("Erreur de stockage local:", error)
    }
  }, [])

  const syncPendingData = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const data: PanneData[] = stored ? JSON.parse(stored) : []
      
      if (data.length === 0) return
      
      setIsSyncing(true)
      const remaining: PanneData[] = []
      
      for (const panne of data) {
        try {
          const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(panne),
          })
          
          if (!response.ok) {
            remaining.push(panne)
          }
        } catch {
          remaining.push(panne)
        }
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining))
      setPendingCount(remaining.length)
      
      if (remaining.length === 0) {
        setLastStatus("success")
      }
    } catch (error) {
      console.error("Erreur de synchronisation:", error)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  const submitPanne = useCallback(async (panne: PanneData): Promise<boolean> => {
    if (!isOnline) {
      savePanneLocally(panne)
      setLastStatus("offline")
      return false
    }
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(panne),
      })
      
      if (response.ok) {
        setLastStatus("success")
        return true
      } else {
        savePanneLocally(panne)
        setLastStatus("offline")
        return false
      }
    } catch {
      savePanneLocally(panne)
      setLastStatus("offline")
      return false
    }
  }, [isOnline, savePanneLocally])

  return {
    isOnline,
    pendingCount,
    isSyncing,
    lastStatus,
    submitPanne,
    syncPendingData,
    clearStatus: () => setLastStatus(null),
  }
}

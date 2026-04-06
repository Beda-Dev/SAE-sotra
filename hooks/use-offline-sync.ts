"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { API_ENDPOINT, STORAGE_KEY } from "@/lib/panne-config"

export interface PanneData {
  id: string
  type_panne: string
  gps_position: { latitude: number; longitude: number }
  vehicle_number: string
  line: string
  time: string
  panne_id?: number
  panne_ref?: string
}

export interface SubmitResult {
  success: boolean
  panne_id?: number
  panne_ref?: string
  message?: string
}

// Vérifie la connectivité réelle (pas seulement navigator.onLine)
async function checkRealConnectivity(): Promise<boolean> {
  console.log("🔌 [API] Vérification connectivité - GET /api/ping")
  try {
    const response = await fetch("/api/ping", {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })
    const isOnline = response.ok
    console.log(`✅ [API] Réponse ping: ${response.status} - En ligne: ${isOnline}`)
    return isOnline
  } catch (error) {
    console.error("❌ [API] Erreur vérification connectivité:", error)
    return false
  }
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastStatus, setLastStatus] = useState<"success" | "offline" | "error" | null>(null)

  // Verrou contre les appels concurrents
  const syncLockRef = useRef(false)

  const loadPendingCount = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const data = stored ? JSON.parse(stored) : []
      setPendingCount(data.length)
      if (data.length > 0) {
        console.log(`📦 [STORAGE] ${data.length} panne(s) en attente de synchronisation`)
      }
    } catch {
      setPendingCount(0)
    }
  }, [])

  const savePanneLocally = useCallback((panne: PanneData) => {
    try {
      console.log("💾 [STORAGE] Sauvegarde locale - Panne ID:", panne.id)
      const stored = localStorage.getItem(STORAGE_KEY)
      const data: PanneData[] = stored ? JSON.parse(stored) : []
      // Déduplication côté client par id
      if (!data.find((p) => p.id === panne.id)) {
        data.push(panne)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setPendingCount(data.length)
        console.log(`✅ [STORAGE] Panne sauvegardée. Total en attente: ${data.length}`)
      } else {
        console.log("⚠️  [STORAGE] Panne déjà en attente (déduplication)")
      }
    } catch (error) {
      console.error("❌ [STORAGE] Erreur de stockage local:", error)
    }
  }, [])

  const syncPendingData = useCallback(async () => {
    // Protection contre les appels concurrents
    if (syncLockRef.current) return
    syncLockRef.current = true

    console.log("🔄 [SYNC] Début synchronisation des pannes en attente...")
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const data: PanneData[] = stored ? JSON.parse(stored) : []
      if (data.length === 0) {
        console.log("ℹ️  [SYNC] Aucune panne en attente")
        return
      }

      console.log(`📤 [SYNC] ${data.length} panne(s) à synchroniser`)
      setIsSyncing(true)
      const remaining: PanneData[] = []

      for (const panne of data) {
        try {
          console.log(`📡 [API] POST ${API_ENDPOINT}`)
          console.log(`   → Panne ID: ${panne.id}, Type: ${panne.type_panne}, Véhicule: ${panne.vehicle_number}`)
          
          const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(panne),
            signal: AbortSignal.timeout(10000),
          })

          if (response.ok) {
            console.log(`✅ [API] Panne ${panne.id} synchronisée (${response.status})`)
            // Écriture atomique après chaque succès
            const currentStored = localStorage.getItem(STORAGE_KEY)
            const currentData: PanneData[] = currentStored ? JSON.parse(currentStored) : []
            const updated = currentData.filter((p) => p.id !== panne.id)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            setPendingCount(updated.length)
            console.log(`💾 [STORAGE] Panne supprimée du stockage. Restantes: ${updated.length}`)
          } else {
            console.warn(`⚠️  [API] Erreur ${response.status} pour panne ${panne.id}`)
            remaining.push(panne)
          }
        } catch (error) {
          console.error(`❌ [API] Erreur envoi panne ${panne.id}:`, error)
          remaining.push(panne)
        }
      }

      if (remaining.length === 0 && data.length > 0) {
        setLastStatus("success")
        console.log("🎉 [SYNC] Toutes les pannes synchronisées avec succès!")
      } else if (remaining.length > 0) {
        console.log(`⚠️  [SYNC] ${remaining.length} panne(s) restantes en attente`)
      }
    } catch (error) {
      console.error("❌ [SYNC] Erreur de synchronisation:", error)
    } finally {
      setIsSyncing(false)
      syncLockRef.current = false
      console.log("🔄 [SYNC] Fin synchronisation")
    }
  }, [])

  // Vérification périodique toutes les 30 secondes
  useEffect(() => {
    console.log("🚀 [APP] Application démarrée - Initialisation useOfflineSync")
    loadPendingCount()

    const checkAndSync = async () => {
      console.log("⏱️  [PERIODIC] Vérification de connectivité périodique...")
      const reallyOnline = await checkRealConnectivity()
      setIsOnline(reallyOnline)
      if (reallyOnline) {
        await syncPendingData()
      } else {
        console.log("📴 [PERIODIC] Mode hors ligne - Pas de synchronisation")
      }
    }

    const handleOnline = () => {
      console.log("🟢 [EVENT] Événement 'online' détecté - Vérification et sync...")
      checkAndSync()
    }
    const handleOffline = () => {
      console.log("🔴 [EVENT] Événement 'offline' détecté")
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Vérification initiale
    console.log("✅ [APP] Vérification initiale de connectivité...")
    checkAndSync()

    // Polling toutes les 30 secondes
    console.log("⏲️  [APP] Démarrage du polling périodique (toutes les 30s)")
    const interval = setInterval(checkAndSync, 30_000)

    return () => {
      console.log("🛑 [APP] Arrêt de useOfflineSync")
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [loadPendingCount, syncPendingData])

  const submitPanne = useCallback(
    async (panne: PanneData): Promise<PanneData | null> => {
      console.log("📝 [FORM] Nouvelle panne soumise")
      console.log(`   → ID: ${panne.id}`)
      console.log(`   → Type: ${panne.type_panne}`)
      console.log(`   → Véhicule: ${panne.vehicle_number}`)
      console.log(`   → Ligne: ${panne.line}`)
      console.log(`   → GPS: Lat ${panne.gps_position.latitude}, Lon ${panne.gps_position.longitude}`)
      console.log(`   → Heure: ${panne.time}`)
      
      const reallyOnline = await checkRealConnectivity()
      setIsOnline(reallyOnline)

      if (!reallyOnline) {
        console.log("📴 [API] Mode hors ligne détecté - Sauvegarde locale")
        savePanneLocally(panne)
        setLastStatus("offline")
        return null
      }

      try {
        console.log(`📡 [API] POST ${API_ENDPOINT}`)
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(panne),
          signal: AbortSignal.timeout(10000),
        })

        if (response.ok) {
          const responseData: SubmitResult = await response.json()
          console.log(`✅ [API] Panne envoyée avec succès (${response.status})`)
          console.log(`   → panne_id: ${responseData.panne_id}`)
          console.log(`   → panne_ref: ${responseData.panne_ref}`)
          console.log(`   → message: ${responseData.message}`)
          
          setLastStatus("success")
          
          // Mettre à jour la panne avec les données du serveur
          const updatedPanne: PanneData = {
            ...panne,
            panne_id: responseData.panne_id,
            panne_ref: responseData.panne_ref,
          }
          
          // Important: bien vider le storage car envoi réussi
          try {
            const stored = localStorage.getItem(STORAGE_KEY)
            const data: PanneData[] = stored ? JSON.parse(stored) : []
            const updated = data.filter((p) => p.id !== panne.id)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            setPendingCount(updated.length)
            console.log(`💾 [STORAGE] Panne supprimée du storage après succès. Restantes: ${updated.length}`)
          } catch (e) {
            console.error("⚠️  [STORAGE] Erreur nettoyage storage:", e)
          }
          
          return updatedPanne
        } else {
          console.warn(`⚠️  [API] Erreur serveur ${response.status} - Sauvegarde locale`)
          savePanneLocally(panne)
          setLastStatus("offline")
          return null
        }
      } catch (error) {
        console.error("❌ [API] Erreur d'envoi - Sauvegarde locale:", error)
        savePanneLocally(panne)
        setLastStatus("offline")
        return null
      }
    },
    [savePanneLocally]
  )

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
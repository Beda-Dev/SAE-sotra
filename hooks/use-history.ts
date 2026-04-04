"use client"

import { useState, useCallback, useEffect } from "react"
import type { PanneData } from "@/hooks/use-offline-sync"

export interface HistoryEntry extends PanneData {
  status: "sent" | "pending"
  sentAt?: string
}

const HISTORY_KEY = "sotra_history"
const MAX_HISTORY = 20

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    console.log("📚 [HISTORY] Chargement de l'historique au démarrage...")
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) {
        const entries = JSON.parse(stored)
        console.log(`✅ [HISTORY] ${entries.length} entrée(s) restaurée(s)`)
        entries.forEach((e: HistoryEntry) => {
          console.log(`   → Panne ${e.id}: ${e.type_panne} (${e.status})`)
        })
        setHistory(entries)
      } else {
        console.log("ℹ️  [HISTORY] Aucun historique trouvé")
      }
    } catch (error) {
      console.error("❌ [HISTORY] Erreur chargement:", error)
      setHistory([])
    }
  }, [])

  const addToHistory = useCallback((panne: PanneData, status: "sent" | "pending") => {
    try {
      console.log(`📝 [HISTORY] Ajout d'une entrée - Panne ${panne.id}, Statut: ${status}`)
      const stored = localStorage.getItem(HISTORY_KEY)
      const existing: HistoryEntry[] = stored ? JSON.parse(stored) : []

      // Évite les doublons
      const filtered = existing.filter((e) => e.id !== panne.id)

      const entry: HistoryEntry = {
        ...panne,
        status,
        sentAt: new Date().toISOString(),
      }

      const updated = [entry, ...filtered].slice(0, MAX_HISTORY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      setHistory(updated)
      console.log(`✅ [HISTORY] Entrée ajoutée. Total: ${updated.length}/${MAX_HISTORY}`)
    } catch (error) {
      console.error("❌ [HISTORY] Erreur ajout:", error)
    }
  }, [])

  const updateStatus = useCallback((id: string, status: "sent" | "pending") => {
    try {
      console.log(`🔄 [HISTORY] Mise à jour du statut de ${id} → ${status}`)
      const stored = localStorage.getItem(HISTORY_KEY)
      const existing: HistoryEntry[] = stored ? JSON.parse(stored) : []
      const updated = existing.map((e) => (e.id === id ? { ...e, status } : e))
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      setHistory(updated)
      console.log(`✅ [HISTORY] Statut mis à jour`)
    } catch (error) {
      console.error("❌ [HISTORY] Erreur mise à jour:", error)
    }
  }, [])

  return { history, addToHistory, updateStatus }
}
"use client"

import { useEffect } from "react"
import { PanneForm } from "@/components/panne/panne-form"

export default function Home() {
  useEffect(() => {
    console.log("%c🚀 ╔════════════════════════════════════════╗", "color: #00aa00; font-weight: bold; font-size: 14px")
    console.log("%c🚀 ║  SOTRA SAE - Application Démarrée  ║", "color: #00aa00; font-weight: bold; font-size: 14px")
    console.log("%c🚀 ╚════════════════════════════════════════╝", "color: #00aa00; font-weight: bold; font-size: 14px")
    console.log("%c📋 Console Logs Actifs:", "color: #0066cc; font-weight: bold")
    console.log("%c✓ API Calls  ✓ GPS  ✓ Storage  ✓ History  ✓ Sync", "color: #0066cc; font-family: monospace")
    console.log("")
    console.log("%cℹ️  Ouvrez la console pour suivre le flux complet:", "color: #666; font-style: italic")
    console.log("%cFormulaire → GPS → API → Historique → Sync", "color: #666; font-family: monospace; font-style: italic")
  }, [])

  return (
    <main className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo SOTRA */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-lg">
            <span className="text-2xl font-bold text-primary-foreground">SOTRA</span>
            <span className="text-sm font-medium text-secondary">SAE</span>
          </div>
        </div>

        {/* Formulaire de déclaration */}
        <PanneForm />

        {/* Footer */}
        <footer className="text-center mt-6 text-sm text-muted-foreground">
          <p>© 2026 SOTRA - Société des Transports Abidjanais</p>
          <p className="mt-1">Système d&apos;Aide à l&apos;Exploitation</p>
        </footer>
      </div>
    </main>
  )
}

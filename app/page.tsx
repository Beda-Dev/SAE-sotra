import { PanneForm } from "@/components/panne/panne-form"

export default function Home() {
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

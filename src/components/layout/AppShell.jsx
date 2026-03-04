import { BottomNav } from './BottomNav'

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <main className="flex-1 max-w-lg mx-auto w-full pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

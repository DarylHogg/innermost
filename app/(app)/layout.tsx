import AppNav from './app-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-zinc-100 min-h-screen sticky top-0">
        <AppNav />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-5 py-8 md:px-10 md:py-10 max-w-3xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-zinc-100 z-10">
        <AppNav mobile />
      </nav>
    </div>
  )
}

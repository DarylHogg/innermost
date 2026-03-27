export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-[#FAFAF8] px-4 py-16">
      {children}
    </div>
  )
}

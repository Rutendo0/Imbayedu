export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen admin-theme">
      {children}
    </div>
  )
}


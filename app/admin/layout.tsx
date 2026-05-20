import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .adm-scroll { padding-top: 56px; }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', background: '#efe9df' }}>
        <AdminSidebar />
        <div className="adm-scroll" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </>
  )
}

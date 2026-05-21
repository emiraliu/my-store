import ProductForm from '../ProductForm'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

export default function NewProductPage() {
  return (
    <div style={{ fontFamily: F.body, color: '#000000' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '14px 28px',
        borderBottom: '0.5px solid rgba(0,0,0,0.10)',
        background: '#f5f5f5',
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6e6e6e' }}>
          Admin <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          Products <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <strong style={{ color: '#000000', fontWeight: 500 }}>New</strong>
        </div>
      </div>

      <div style={{ padding: '28px 28px 60px', maxWidth: 600 }}>
        <h1 style={{
          fontFamily: F.display,
          fontSize: 38, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em',
          margin: '0 0 28px',
        }}>
          Add product<em style={{ fontStyle: 'italic', color: '#000000' }}>.</em>
        </h1>
        <ProductForm />
      </div>
    </div>
  )
}

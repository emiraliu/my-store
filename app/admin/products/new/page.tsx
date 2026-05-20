import ProductForm from '../ProductForm'

const F = {
  display: "var(--font-cormorant), 'Times New Roman', serif",
  body:    "var(--font-dm-sans), system-ui, sans-serif",
  mono:    "var(--font-dm-mono), monospace",
}

export default function NewProductPage() {
  return (
    <div style={{ fontFamily: F.body, color: '#2c2520' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '14px 28px',
        borderBottom: '0.5px solid rgba(44,37,32,0.10)',
        background: '#efe9df',
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b5e52' }}>
          Admin <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          Products <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
          <strong style={{ color: '#2c2520', fontWeight: 500 }}>New</strong>
        </div>
      </div>

      <div style={{ padding: '28px 28px 60px', maxWidth: 600 }}>
        <h1 style={{
          fontFamily: F.display,
          fontSize: 38, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em',
          margin: '0 0 28px',
        }}>
          Add product<em style={{ fontStyle: 'italic', color: '#b5704d' }}>.</em>
        </h1>
        <ProductForm />
      </div>
    </div>
  )
}

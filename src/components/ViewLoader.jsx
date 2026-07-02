export default function ViewLoader() {
  return (
    <div
      className="view-loader"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}
    >
      Loading...
    </div>
  );
}

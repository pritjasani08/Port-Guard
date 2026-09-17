// ============================================================
// PORTGUARD AI — LOADING STATE COMPONENT
// ============================================================

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="loading-state">
      <div className="loading-state__spinner" />
      <span className="loading-state__text">{message}</span>
    </div>
  );
}

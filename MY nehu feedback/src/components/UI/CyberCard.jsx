export function CyberCard({ children, className = '', style }) {
  return (
    <div className={`cyber-card${className ? ` ${className}` : ''}`} style={style}>
      <div className="hud-corner-tl" /><div className="hud-corner-tr" />
      <div className="hud-corner-bl" /><div className="hud-corner-br" />
      {children}
    </div>
  );
}

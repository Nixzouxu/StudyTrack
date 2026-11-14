const ticks = Array.from({ length: 24 }, (_, i) => i);

// cincin jam buat hiasan, dipakai di background dan panel masuk
export default function Rings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="188" className="r-line" />
      <circle cx="200" cy="200" r="140" className="r-line r-dash" />
      <circle cx="200" cy="200" r="92" className="r-line" />
      {ticks.map((i) => (
        <line
          key={i}
          className="r-line"
          x1="200"
          y1={i % 6 === 0 ? 26 : 36}
          x2="200"
          y2="50"
          transform={`rotate(${i * 15} 200 200)`}
        />
      ))}
    </svg>
  );
}
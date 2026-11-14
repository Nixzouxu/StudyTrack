// jam 24 jam buat bagian hero, satu putaran penuh = 24 jam sisa waktu
// jarum dan angkanya gerak ikut scroll (diatur di useScenes)
// cincinnya ada tiga, yang tampil tergantung kondisi: normal, segera, atau terlambat
const ticks = Array.from({ length: 24 }, (_, i) => i);

export default function Dial() {
  return (
    <div className="dial" data-state="normal">
      <svg viewBox="0 0 400 400" className="dial-svg" aria-hidden="true">
        <circle className="ring ring-normal" cx="200" cy="200" r="188" />
        <circle className="ring ring-soon" cx="200" cy="200" r="188" />
        <circle className="ring ring-late" cx="200" cy="200" r="188" />
        <circle className="inner" cx="200" cy="200" r="132" />
        {ticks.map((i) => {
          const major = i % 6 === 0;
          return (
            <line
              key={i}
              className={major ? "tick major" : "tick"}
              x1="200"
              y1={major ? 30 : 38}
              x2="200"
              y2="50"
              transform={`rotate(${i * 15} 200 200)`}
            />
          );
        })}
        <g className="dial-hand">
          <line x1="200" y1="92" x2="200" y2="58" />
          <circle cx="200" cy="58" r="9" />
        </g>
      </svg>
      <div className="readout">
        <span className="readout-label mono">NORMAL</span>
        <span className="readout-time mono">30:00:00</span>
        <span className="readout-note">sisa waktu</span>
      </div>
    </div>
  );
}
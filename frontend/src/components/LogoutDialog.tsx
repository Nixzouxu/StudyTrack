import { useEffect, useRef } from "react";
import { playModalIn, playModalOut } from "../lib/motion";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// popup konfirmasi keluar, pakai dialog bawaan browser
// fokus awalnya di tombol Tetap di sini biar nggak kepencet
export default function LogoutDialog({ open, onCancel, onConfirm }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const stay = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      stay.current?.focus();
      playModalIn(panel.current);
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
      onClose={onCancel}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-panel logout-panel" ref={panel}>
        <span className="m-glow" aria-hidden="true" />
        <svg className="m-dial m-item" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="28" className="m-ring" />
          <g className="m-hand">
            <line x1="32" y1="32" x2="32" y2="12" />
          </g>
          <circle cx="32" cy="32" r="3" className="m-hub" />
        </svg>
        <h2 id="logout-title" className="m-item">Keluar dari StudyTrack?</h2>
        <p id="logout-desc" className="m-item muted">
          Tugasmu tetap tersimpan dan akan muncul lagi saat kamu masuk kembali.
        </p>
        <div className="modal-actions m-item">
          <button type="button" className="btn btn-ghost" onClick={() => playModalOut(panel.current, onConfirm)}>
            Ya, keluar
          </button>
          <button type="button" className="btn btn-primary" ref={stay} onClick={onCancel}>
            Tetap di sini
          </button>
        </div>
      </div>
    </dialog>
  );
}
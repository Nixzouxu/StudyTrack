import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Course } from "../types";
import { api } from "../api";
import { keIsoDenganZona } from "../lib/waktu";
import { playModalIn } from "../lib/motion";

interface Props {
  open: boolean;
  courses: Course[];
  onClose: () => void;
  onCreated: () => void;
}

// form tambah tugas, pakai dialog bawaan browser
// fokus dan tombol Esc sudah diurus browser
export default function TaskDialog({ open, courses, onClose, onCreated }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLFormElement>(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [deadline, setDeadline] = useState("");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      playModalIn(panel.current);
    }
    if (!open && d.open) d.close();
  }, [open]);

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/tasks", {
        method: "POST",
        body: JSON.stringify({
          judul,
          deskripsi,
          deadline: keIsoDenganZona(deadline),
          mata_kuliah_id: Number(courseId)
        })
      });
      setJudul("");
      setDeskripsi("");
      setDeadline("");
      toast.success("Tugas ditambahkan");
      onCreated();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby="dlg-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form className="modal-panel form" ref={panel} onSubmit={submit}>
        <div className="m-item">
          <p className="label">Tugas baru</p>
          <h2 id="dlg-title">Tambah tugas</h2>
        </div>
        <div className="field m-item">
          <label htmlFor="mk">Mata kuliah</label>
          <select id="mk" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
            <option value="">Pilih mata kuliah</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.kode})
              </option>
            ))}
          </select>
        </div>
        <div className="field m-item">
          <label htmlFor="judul">Judul tugas</label>
          <input id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} required />
        </div>
        <div className="field m-item">
          <label htmlFor="desk">Deskripsi (opsional)</label>
          <input id="desk" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
        </div>
        <div className="field m-item">
          <label htmlFor="dl">Deadline</label>
          <input id="dl" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="modal-actions m-item">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary">
            Simpan tugas
          </button>
        </div>
      </form>
    </dialog>
  );
}
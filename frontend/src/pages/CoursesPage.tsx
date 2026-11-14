import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Course } from "../types";
import { api } from "../api";
import { useRevealOnce } from "../lib/motion";
import PageHeader from "../components/PageHeader";

export default function CoursesPage() {
  const root = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [kode, setKode] = useState("");
  const [dosen, setDosen] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setCourses(await api<Course[]>("/courses"));
    } finally {
      setLoaded(true);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  useRevealOnce(root, loaded);

  async function submit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/courses", { method: "POST", body: JSON.stringify({ name, kode, dosen }) });
      setName("");
      setKode("");
      setDosen("");
      toast.success("Mata kuliah ditambahkan");
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function remove(c: Course) {
    if (!confirm(`Hapus ${c.name}? Tugas di dalamnya ikut terhapus.`)) return;
    try {
      await api(`/courses/${c.id}`, { method: "DELETE" });
      toast.success("Mata kuliah dihapus");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="page" ref={root}>
      <PageHeader label="Semester berjalan" title="Mata Kuliah" />

      <form className="card form add-course reveal-item" onSubmit={submit}>
        <p className="label">Tambah mata kuliah</p>
        <div className="form-row">
          <div className="field">
            <label htmlFor="c-name">Nama</label>
            <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="c-kode">Kode (contoh: CS 186)</label>
            <input id="c-kode" value={kode} onChange={(e) => setKode(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="c-dosen">Dosen pengampu</label>
            <input id="c-dosen" value={dosen} onChange={(e) => setDosen(e.target.value)} required />
          </div>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary form-submit">
          Tambah mata kuliah
        </button>
      </form>

      {loaded && courses.length === 0 && (
        <div className="card empty reveal-item">
          <p className="empty-title">Belum ada mata kuliah</p>
          <p className="muted">Mulai dari mata kuliah yang sedang kamu ambil semester ini.</p>
        </div>
      )}

      <ul className="grid">
        {courses.map((c) => (
          <li key={c.id} className="card course reveal-item" data-kode={c.kode}>
            <span className="kode">{c.kode}</span>
            <h3 className="course-name">{c.name}</h3>
            <p className="muted small">{c.dosen}</p>
            <button className="btn btn-text danger course-del" onClick={() => remove(c)} aria-label={`Hapus: ${c.name}`}>
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
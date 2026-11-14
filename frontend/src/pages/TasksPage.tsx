import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Course, Task } from "../types";
import { api } from "../api";
import { indeksPemisah } from "../lib/ringkasan";
import { useRevealOnce } from "../lib/motion";
import TaskCard from "../components/TaskCard";
import TaskDialog from "../components/TaskDialog";
import SummaryStrip from "../components/SummaryStrip";
import PageHeader from "../components/PageHeader";
import { PlusIcon } from "../components/Icons";

const hariIni = () =>
  new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

export default function TasksPage() {
  const root = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const [t, c] = await Promise.all([api<{ tasks: Task[] }>("/tasks"), api<Course[]>("/courses")]);
      setTasks(t.tasks);
      setCourses(c);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoaded(true);
    }
  }, []);

  // kategori tergantung waktu, jadi data diambil ulang tiap 60 detik dan pas tab dibuka lagi
  // animasi masuknya cuma sekali, jadi refresh tidak mengganggu
  useEffect(() => {
    load();
    const timer = setInterval(load, 60_000);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  useRevealOnce(root, loaded);

  async function toggle(task: Task) {
    const status = task.status === "selesai" ? "belum" : "selesai";
    try {
      await api(`/tasks/${task.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success(status === "selesai" ? "Ditandai selesai" : "Dikembalikan ke belum");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function remove(task: Task) {
    if (!confirm(`Hapus tugas "${task.judul}"?`)) return;
    try {
      await api(`/tasks/${task.id}`, { method: "DELETE" });
      toast.success("Tugas dihapus");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const pemisah = indeksPemisah(tasks);

  return (
    <div className="page" ref={root}>
      <PageHeader label={hariIni()} title="Daftar Tugas">
        <button className="btn btn-primary" onClick={() => setDialogOpen(true)}>
          <PlusIcon /> Tambah tugas
        </button>
      </PageHeader>

      {error && <p className="error" role="alert">{error}</p>}

      {!loaded ? (
        <div className="list" aria-busy="true">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="card empty reveal-item">
          <p className="empty-title">Belum ada tugas</p>
          <p className="muted">
            {courses.length === 0
              ? "Tambahkan mata kuliah dulu di tab Mata Kuliah, lalu buat tugas pertamamu."
              : "Catat tugas pertamamu supaya tidak ada deadline yang terlewat."}
          </p>
          {courses.length > 0 && (
            <button className="btn btn-primary" onClick={() => setDialogOpen(true)}>
              Tambah tugas
            </button>
          )}
        </div>
      ) : (
        <>
          <SummaryStrip tasks={tasks} />
          <ul className="list">
            {tasks.map((t, i) => (
              <Fragment key={t.id}>
                {i === pemisah && <li className="divider label reveal-item" aria-hidden="true">Tugas lainnya</li>}
                <TaskCard task={t} onToggle={toggle} onDelete={remove} />
              </Fragment>
            ))}
          </ul>
        </>
      )}

      <TaskDialog open={dialogOpen} courses={courses} onClose={() => setDialogOpen(false)} onCreated={load} />
    </div>
  );
}
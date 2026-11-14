import type { Task } from "../types";

// hitung jumlah tugas per kategori buat ringkasan
// cuma baca kategori dari backend
export function hitungRingkasan(tasks: Pick<Task, "kategori">[]) {
  return {
    total: tasks.length,
    mendekati: tasks.filter((t) => t.kategori === "mendekati_deadline").length,
    overdue: tasks.filter((t) => t.kategori === "overdue").length
  };
}
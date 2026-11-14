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
// cari posisi pemisah tugas lainnya, yaitu tugas pertama setelah kelompok mendekati deadline
// backend sudah mengurutkan, jadi tinggal cari yang pertama bukan mendekati
// hasilnya -1 kalau pemisah tidak perlu ditampilkan
export function indeksPemisah(tasks: Pick<Task, "kategori">[]): number {
  const adaMendekati = tasks.some((t) => t.kategori === "mendekati_deadline");
  if (!adaMendekati) return -1;
  return tasks.findIndex((t) => t.kategori !== "mendekati_deadline");
}
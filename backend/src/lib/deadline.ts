// logika kategori deadline
// fungsinya murni (nggak akses database dan jam sistem) jadi gampang dites pakai waktu yang dibekukan

// batas mendekati deadline 24 jam, sengaja nggak bisa diubah (sesuai catatan F01)
export const NEAR_DEADLINE_MS = 24 * 60 * 60 * 1000;

export type Kategori = "normal" | "mendekati_deadline" | "overdue";

export interface TugasRow {
  id: number;
  judul: string;
  deskripsi: string;
  deadline: Date;
  status: "belum" | "selesai";
  mata_kuliah_id: number;
  created_at: Date;
  mata_kuliah: string;
  kode: string;
}

export type TugasBerkategori = TugasRow & { kategori: Kategori; sisa_detik: number };

// aturan kategori:
// - tugas selesai dianggap normal
// - lewat deadline = overdue
// - sisa kurang dari 24 jam = mendekati deadline
// - selain itu normal (tepat 24 jam masih normal)
export function kategori(deadline: Date, status: "belum" | "selesai", now: Date): Kategori {
  if (status === "selesai") return "normal";
  const sisa = deadline.getTime() - now.getTime();
  if (sisa < 0) return "overdue";
  if (sisa < NEAR_DEADLINE_MS) return "mendekati_deadline";
  return "normal";
}

// tambah kategori sama sisa_detik (minus kalau sudah overdue)
export function annotate(task: TugasRow, now: Date): TugasBerkategori {
  return {
    ...task,
    kategori: kategori(task.deadline, task.status, now),
    sisa_detik: Math.trunc((task.deadline.getTime() - now.getTime()) / 1000)
  };
}
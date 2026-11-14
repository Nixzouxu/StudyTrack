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
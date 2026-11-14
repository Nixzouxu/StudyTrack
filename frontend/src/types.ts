export type Kategori = "normal" | "mendekati_deadline" | "overdue";

export interface Course {
  id: number;
  name: string;
  kode: string;
  dosen: string;
}

export interface Task {
  id: number;
  judul: string;
  deskripsi: string;
  deadline: string;
  status: "belum" | "selesai";
  mata_kuliah_id: number;
  created_at: string;
  mata_kuliah: string;
  kode: string;
  kategori: Kategori;
  sisa_detik: number;
}

export interface User {
  id: number;
  nama: string;
  email: string;
}
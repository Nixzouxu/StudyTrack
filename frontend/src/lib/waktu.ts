import type { Kategori } from "../types";

// ubah detik jadi teks singkat, contoh 5 jam 30 menit
export function formatDurasi(detik: number): string {
  const menit = Math.floor(detik / 60);
  if (menit < 1) return "kurang dari 1 menit";
  const hari = Math.floor(menit / 1440);
  const jam = Math.floor((menit % 1440) / 60);
  const mnt = menit % 60;
  if (hari > 0) return `${hari} hari ${jam} jam`;
  if (jam > 0) return `${jam} jam ${mnt} menit`;
  return `${mnt} menit`;
}
// teks penanda di card, kategorinya sudah dihitung backend
export function labelPenanda(kategori: Kategori, sisaDetik: number): string | null {
  if (kategori === "mendekati_deadline") return `Segera: sisa ${formatDurasi(sisaDetik)}`;
  if (kategori === "overdue") return `Terlambat ${formatDurasi(-sisaDetik)}`;
  return null;
}
// nilai datetime-local dikirim ke backend dalam format ISO lengkap dengan zona waktu
export function keIsoDenganZona(nilaiInput: string): string {
  return new Date(nilaiInput).toISOString();
}
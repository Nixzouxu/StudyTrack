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
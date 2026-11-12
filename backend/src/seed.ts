import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { pool } from "./db.js";

// kosongin semua tabel lalu isi data contoh dari soal
// akun demo: demo@studytrack.test / demo1234
export async function resetAndSeed(): Promise<void> {
  await pool.query("TRUNCATE tugas, mata_kuliah, users RESTART IDENTITY CASCADE");
  const hash = await bcrypt.hash("demo1234", 10);
  await pool.query("INSERT INTO users (nama, email, password_hash) VALUES ('Demo', 'demo@studytrack.test', $1)", [hash]);
  await pool.query(`INSERT INTO mata_kuliah (user_id, name, kode, dosen) VALUES
    (1, 'Database Systems', 'CS 186', 'Dosen A'),
    (1, 'Data Structures', 'CS 61B', 'Dosen B'),
    (1, 'Software Engineering', 'CS 169', 'Dosen C')`);
  // deadline pakai offset WIB (+07), created_at diisi manual biar urutannya tetap: ID 3 paling baru, lalu 2, lalu 1
  await pool.query(`INSERT INTO tugas (judul, deadline, status, mata_kuliah_id, created_at) VALUES
    ('Lab 4: Query Optimization Report', '2026-07-03 23:59+07', 'belum', 1, '2026-06-20 00:00+07'),
    ('Project 3: BSTMap Implementation', '2026-07-02 10:00+07', 'belum', 2, '2026-06-21 00:00+07'),
    ('Sprint 2: Backend API Integration', '2026-07-06 23:59+07', 'belum', 3, '2026-06-22 00:00+07')`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  resetAndSeed().then(() => {
    console.log("seed selesai");
    return pool.end();
  });
}
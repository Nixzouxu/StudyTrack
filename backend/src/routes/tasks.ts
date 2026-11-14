import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { annotate, sortTasks, type TugasRow } from "../lib/deadline.js";

const router = Router();
// semua route tugas harus login
router.use(requireAuth);

// waktu patokan pakai jam server, ?now= cuma jalan kalau bukan production
// dipakai buat testing dan demo
function resolveNow(query: Record<string, unknown>): Date {
  if (process.env.NODE_ENV !== "production" && typeof query.now === "string") {
    const t = new Date(query.now);
    if (!Number.isNaN(t.getTime())) return t;
  }
  return new Date();
}

// ambil semua tugas milik user yang login, dari semua mata kuliah (F04)
// tiap tugas ditambah kategori (normal, mendekati_deadline, atau overdue)
// dan sisa_detik (minus kalau sudah overdue)
// yang mendekati deadline ditaruh paling atas
router.get("/", async (req, res) => {
  const now = resolveNow(req.query);
  const { rows } = await pool.query<TugasRow>(
    `SELECT t.id, t.judul, t.deskripsi, t.deadline, t.status, t.mata_kuliah_id, t.created_at,
            mk.name AS mata_kuliah, mk.kode
       FROM tugas t
       JOIN mata_kuliah mk ON mk.id = t.mata_kuliah_id
      WHERE mk.user_id = $1`,
    [res.locals.userId]
  );
  const tasks = sortTasks(rows.map((r) => annotate(r, now)));
  res.json({ server_time: now.toISOString(), tasks });
});

// deadline tanpa zona waktu bisa ambigu, jadi ditolak
const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/;

// tambah tugas, body: judul, deskripsi (boleh kosong), deadline, mata_kuliah_id
// deadline harus format ISO 8601 pakai zona waktu, contoh 2026-07-03T23:59:00+07:00
router.post("/", async (req, res) => {
  const { judul, deskripsi = "", deadline, mata_kuliah_id } = req.body ?? {};
  if (!judul || !String(judul).trim()) return res.status(400).json({ error: "Judul wajib diisi." });
  if (typeof deadline !== "string" || !HAS_ZONE.test(deadline) || Number.isNaN(new Date(deadline).getTime())) {
    return res.status(400).json({ error: "Deadline harus berformat ISO 8601 dengan zona waktu." });
  }
  const own = await pool.query("SELECT 1 FROM mata_kuliah WHERE id = $1 AND user_id = $2", [
    mata_kuliah_id,
    res.locals.userId
  ]);
  if (own.rowCount === 0) return res.status(404).json({ error: "Mata kuliah tidak ditemukan." });
  const { rows } = await pool.query(
    `INSERT INTO tugas (judul, deskripsi, deadline, mata_kuliah_id) VALUES ($1, $2, $3, $4)
     RETURNING id, judul, deskripsi, deadline, status, mata_kuliah_id, created_at`,
    [String(judul).trim(), deskripsi, deadline, mata_kuliah_id]
  );
  res.status(201).json(rows[0]);
});
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
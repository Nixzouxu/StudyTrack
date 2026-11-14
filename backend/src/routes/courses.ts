import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
// semua route mata kuliah harus login
router.use(requireAuth);

// daftar mata kuliah milik user
router.get("/", async (_req, res) => {
  const { rows } = await pool.query("SELECT id, name, kode, dosen FROM mata_kuliah WHERE user_id = $1 ORDER BY id", [
    res.locals.userId
  ]);
  res.json(rows);
});

// tambah mata kuliah, body: name, kode, dosen
router.post("/", async (req, res) => {
  const { name, kode, dosen } = req.body ?? {};
  if (!name || !kode || !dosen) return res.status(400).json({ error: "Nama, kode, dan dosen wajib diisi." });
  const { rows } = await pool.query(
    "INSERT INTO mata_kuliah (user_id, name, kode, dosen) VALUES ($1, $2, $3, $4) RETURNING id, name, kode, dosen",
    [res.locals.userId, name, kode, dosen]
  );
  res.status(201).json(rows[0]);
});

// hapus mata kuliah, tugas di dalamnya ikut kehapus (ON DELETE CASCADE)
router.delete("/:id", async (req, res) => {
  const r = await pool.query("DELETE FROM mata_kuliah WHERE id = $1 AND user_id = $2", [req.params.id, res.locals.userId]);
  if (r.rowCount === 0) return res.status(404).json({ error: "Mata kuliah tidak ditemukan." });
  res.status(204).end();
});

export default router;
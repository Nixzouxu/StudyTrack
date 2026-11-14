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
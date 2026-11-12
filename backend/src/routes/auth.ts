import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { requireAuth, secret } from "../middleware/auth.js";

const router = Router();
const sign = (id: number) => jwt.sign({ sub: id }, secret(), { expiresIn: "7d" });

// daftar akun baru, body: nama, email, password
router.post("/register", async (req, res) => {
  const { nama, email, password } = req.body ?? {};
  if (!nama || !email || !password) return res.status(400).json({ error: "Nama, email, dan password wajib diisi." });
  if (String(password).length < 6) return res.status(400).json({ error: "Password minimal 6 karakter." });
  const hash = await bcrypt.hash(String(password), 10);
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (nama, email, password_hash) VALUES ($1, lower($2), $3) RETURNING id, nama, email",
      [nama, email, hash]
    );
    res.status(201).json({ token: sign(rows[0].id), user: rows[0] });
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: "Email sudah terdaftar." });
    throw e;
  }
});
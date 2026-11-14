import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const secret = () => process.env.JWT_SECRET ?? "dev-secret";

// cek token JWT, kalau valid id user disimpan di res.locals buat dipakai handler berikutnya
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Silakan login terlebih dahulu." });
  try {
    const payload = jwt.verify(token, secret()) as unknown as { sub: number };
    res.locals.userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: "Token tidak valid atau kedaluwarsa." });
  }
}
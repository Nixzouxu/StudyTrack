import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRoutes);
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  });
  return app;
}
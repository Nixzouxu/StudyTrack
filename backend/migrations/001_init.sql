-- skema awal StudyTrack sesuai soal

CREATE TYPE status_tugas AS ENUM ('belum', 'selesai');

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  nama          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
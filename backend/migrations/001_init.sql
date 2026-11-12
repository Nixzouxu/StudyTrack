-- skema awal StudyTrack sesuai soal

CREATE TYPE status_tugas AS ENUM ('belum', 'selesai');

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  nama          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mata_kuliah (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name    TEXT NOT NULL,
  kode    TEXT NOT NULL,
  dosen   TEXT NOT NULL
);
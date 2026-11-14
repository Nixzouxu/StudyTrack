import { test } from "node:test";
import assert from "node:assert/strict";
import { annotate, sortTasks, type TugasRow } from "../src/lib/deadline.js";

// data contoh dari soal, deadline WIB (+07), created_at: T3 paling baru, lalu T2, lalu T1
const seed = (): TugasRow[] => [
  { id: 1, judul: "Lab 4", deadline: new Date("2026-07-03T23:59:00+07:00"), status: "belum", mata_kuliah_id: 1, created_at: new Date("2026-06-20T00:00:00+07:00"), mata_kuliah: "Database Systems", kode: "CS 186", deskripsi: "" },
  { id: 2, judul: "Project 3", deadline: new Date("2026-07-02T10:00:00+07:00"), status: "belum", mata_kuliah_id: 2, created_at: new Date("2026-06-21T00:00:00+07:00"), mata_kuliah: "Data Structures", kode: "CS 61B", deskripsi: "" },
  { id: 3, judul: "Sprint 2", deadline: new Date("2026-07-06T23:59:00+07:00"), status: "belum", mata_kuliah_id: 3, created_at: new Date("2026-06-22T00:00:00+07:00"), mata_kuliah: "Software Engineering", kode: "CS 169", deskripsi: "" }
];
const run = (tasks: TugasRow[], nowWib: string) => {
  const now = new Date(`${nowWib}:00+07:00`);
  return sortTasks(tasks.map((t) => annotate(t, now)));
};
const kat = (r: ReturnType<typeof run>) => Object.fromEntries(r.map((t) => [t.id, t.kategori]));
const ids = (r: ReturnType<typeof run>) => r.map((t) => t.id);

test("1 positif: T2 sisa 2 jam mendekati dan paling atas", () => {
  const r = run(seed(), "2026-07-02T08:00");
  assert.deepEqual(kat(r), { 2: "mendekati_deadline", 1: "normal", 3: "normal" });
  assert.deepEqual(ids(r), [2, 3, 1]);
});

test("2 negatif: tidak ada tugas di bawah 24 jam, urutan lama dipertahankan", () => {
  const r = run(seed(), "2026-06-30T12:00");
  assert.ok(r.every((t) => t.kategori === "normal"));
  assert.deepEqual(ids(r), [3, 2, 1]);
});

test("3 positif: overdue tetap tampil dengan kategori berbeda", () => {
  const r = run(seed(), "2026-07-02T12:00");
  assert.deepEqual(kat(r), { 2: "overdue", 1: "normal", 3: "normal" });
  assert.equal(r.length, 3);
  assert.ok(r.find((t) => t.id === 2)!.sisa_detik < 0);
});
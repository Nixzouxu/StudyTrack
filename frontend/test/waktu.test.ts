import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDurasi, labelPenanda, porsiSisa24Jam } from "../src/lib/waktu";

test("formatDurasi untuk menit, jam, dan hari", () => {
  assert.equal(formatDurasi(30), "kurang dari 1 menit");
  assert.equal(formatDurasi(45 * 60), "45 menit");
  assert.equal(formatDurasi(5 * 3600 + 30 * 60), "5 jam 30 menit");
  assert.equal(formatDurasi(2 * 86400 + 3 * 3600), "2 hari 3 jam");
});

test("penanda sesuai kategori", () => {
    assert.equal(labelPenanda("mendekati_deadline", 7200), "Segera: sisa 2 jam 0 menit");
    assert.equal(labelPenanda("overdue", -3600), "Terlambat 1 jam 0 menit");
    assert.equal(labelPenanda("normal", 999999), null);
  });

  import { hitungRingkasan, indeksPemisah } from "../src/lib/ringkasan";

const k = (kategori: "normal" | "mendekati_deadline" | "overdue") => ({ kategori });

test("ringkasan menghitung per kategori", () => {
  const r = hitungRingkasan([k("mendekati_deadline"), k("mendekati_deadline"), k("overdue"), k("normal")]);
  assert.deepEqual(r, { total: 4, mendekati: 2, overdue: 1 });
});

test("pemisah ada tepat setelah kelompok mendekati", () => {
  assert.equal(indeksPemisah([k("mendekati_deadline"), k("mendekati_deadline"), k("normal"), k("overdue")]), 2);
  assert.equal(indeksPemisah([k("normal"), k("overdue")]), -1);
  assert.equal(indeksPemisah([k("mendekati_deadline")]), -1);
});
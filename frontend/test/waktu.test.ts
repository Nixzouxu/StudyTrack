import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDurasi, labelPenanda, porsiSisa24Jam } from "../src/lib/waktu";

test("formatDurasi untuk menit, jam, dan hari", () => {
  assert.equal(formatDurasi(30), "kurang dari 1 menit");
  assert.equal(formatDurasi(45 * 60), "45 menit");
  assert.equal(formatDurasi(5 * 3600 + 30 * 60), "5 jam 30 menit");
  assert.equal(formatDurasi(2 * 86400 + 3 * 3600), "2 hari 3 jam");
});
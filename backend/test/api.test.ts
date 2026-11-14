import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createApp } from "../src/app.js";
import { migrate } from "../src/migrate.js";
import { resetAndSeed } from "../src/seed.js";
import { pool } from "../src/db.js";

let server: Server;
let base: string;
let token: string;

const api = (path: string, init: RequestInit = {}, tok: string | null = token) =>
  fetch(base + path, {
    ...init,
    headers: { "content-type": "application/json", ...(tok ? { authorization: `Bearer ${tok}` } : {}), ...init.headers }
  });
const list = async (now: string) => ((await (await api(`/api/tasks?now=${encodeURIComponent(now)}`)).json()) as any).tasks;

before(async () => {
  await migrate();
  await resetAndSeed();
  server = createApp().listen(0);
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
  const r = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: "demo@studytrack.test", password: "demo1234" }) }, null);
  token = ((await r.json()) as any).token;
});

after(async () => {
  server.close();
  await pool.end();
});

test("endpoint skenario 1: T2 mendekati dan paling atas", async () => {
  const t = await list("2026-07-02T08:00:00+07:00");
  assert.deepEqual(t.map((x: any) => [x.id, x.kategori]), [[2, "mendekati_deadline"], [3, "normal"], [1, "normal"]]);
  assert.equal(t[0].mata_kuliah, "Data Structures");
});

test("endpoint skenario 7: lintas mata kuliah, urutan 1, 3, 2", async () => {
  const t = await list("2026-07-03T00:00:00+07:00");
  assert.deepEqual(t.map((x: any) => x.id), [1, 3, 2]);
  assert.equal(t[2].kategori, "overdue");
  assert.ok(t[2].sisa_detik < 0);
});

test("skenario 8 lewat endpoint: tandai selesai menghilangkan penanda", async () => {
    const r = await api("/api/tasks/2/status", { method: "PATCH", body: JSON.stringify({ status: "selesai" }) });
    assert.equal(r.status, 200);
    const t = await list("2026-07-02T08:00:00+07:00");
    assert.ok(t.every((x: any) => x.kategori === "normal"));
    await api("/api/tasks/2/status", { method: "PATCH", body: JSON.stringify({ status: "belum" }) });
  });
  
  test("skenario 10: user lain tidak melihat dan tidak bisa mengubah tugas user pertama", async () => {
    const reg = await api("/api/auth/register", { method: "POST", body: JSON.stringify({ nama: "B", email: "b@x.test", password: "abcd1234" }) }, null);
    const tokB = ((await reg.json()) as any).token;
    const r = await api("/api/tasks", {}, tokB);
    assert.deepEqual(((await r.json()) as any).tasks, []);
    const patch = await api("/api/tasks/1/status", { method: "PATCH", body: JSON.stringify({ status: "selesai" }) }, tokB);
    assert.equal(patch.status, 404);
  });
  
  test("tanpa token ditolak", async () => {
    assert.equal((await api("/api/tasks", {}, null)).status, 401);
  });
  
  test("tugas baru dengan deadline 3 jam lagi muncul paling atas (zona waktu benar)", async () => {
    const deadline = new Date(Date.now() + 3 * 3600 * 1000).toISOString();
    const c = await api("/api/tasks", { method: "POST", body: JSON.stringify({ judul: "Baru", deadline, mata_kuliah_id: 1 }) });
    assert.equal(c.status, 201);
    const t = ((await (await api("/api/tasks")).json()) as any).tasks;
    assert.equal(t[0].judul, "Baru");
    assert.equal(t[0].kategori, "mendekati_deadline");
  });
  
  test("deadline tanpa zona waktu ditolak", async () => {
    const c = await api("/api/tasks", { method: "POST", body: JSON.stringify({ judul: "X", deadline: "2026-07-03T23:59", mata_kuliah_id: 1 }) });
    assert.equal(c.status, 400);
  });
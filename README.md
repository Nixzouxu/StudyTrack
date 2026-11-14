# StudyTrack

## Backend

Node.js, TypeScript, Express, dan PostgreSQL.

Cara menjalankan:

```bash
docker compose up -d
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

Akun demo: demo@studytrack.test / demo1234

Fitur reminder tugas: tugas yang sisa waktunya kurang dari 24 jam diberi kategori mendekati_deadline dan ditaruh paling atas. Tugas yang lewat deadline diberi kategori overdue. Tugas yang sudah selesai tidak ditandai.

Menjalankan test:

```bash
cd backend
npm test
```
## Frontend

React, Vite, dan TypeScript.

Cara menjalankan (backend harus sudah jalan):

```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173. Request ke /api diteruskan ke backend di port 4000.

Test:

```bash
cd frontend
npm test
```
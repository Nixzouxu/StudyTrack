import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import type { User } from "./types";
import { api, getToken, setToken } from "./api";
import LandingPage from "./pages/LandingPage";
import TasksPage from "./pages/TasksPage";
import CoursesPage from "./pages/CoursesPage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(Boolean(getToken()));
  const [tab, setTab] = useState<"tugas" | "matkul">("tugas");

  // kalau ada token tersimpan, cek ke /auth/me buat ambil sesi
  useEffect(() => {
    if (!getToken()) return;
    api<User>("/auth/me")
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setChecking(false));
  }, []);

  // dipanggil dari api.ts kalau token ditolak server
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  function logout() {
    setToken(null);
    setUser(null);
  }

  if (checking) return <p className="muted" style={{ textAlign: "center", marginTop: 48 }}>Memuat...</p>;

  return (
    <>
      {user ? (
        <>
          <header className="topbar">
            <span className="brand">StudyTrack</span>
            <nav className="tabs" aria-label="Menu utama">
              <button className="tab" aria-current={tab === "tugas" ? "page" : undefined} onClick={() => setTab("tugas")}>
                Tugas
              </button>
              <button className="tab" aria-current={tab === "matkul" ? "page" : undefined} onClick={() => setTab("matkul")}>
                Mata Kuliah
              </button>
            </nav>
            <div className="user">
              <span className="muted">{user.nama}</span>
              <button className="btn btn-ghost btn-sm" onClick={logout}>
                Keluar
              </button>
            </div>
          </header>
          <main>{tab === "tugas" ? <TasksPage /> : <CoursesPage />}</main>
        </>
      ) : (
        <LandingPage onLogin={setUser} />
      )}
      <Toaster position="bottom-center" theme="system" closeButton />
    </>
  );
}
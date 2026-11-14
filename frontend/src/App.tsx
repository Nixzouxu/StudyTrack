import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import type { User } from "./types";
import { api, getToken, setToken } from "./api";
import LandingPage from "./pages/LandingPage";
import TasksPage from "./pages/TasksPage";
import CoursesPage from "./pages/CoursesPage";
import AppBackdrop from "./components/AppBackdrop";
import LogoutDialog from "./components/LogoutDialog";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(Boolean(getToken()));
  const [tab, setTab] = useState<"tugas" | "matkul">("tugas");
  const [logoutOpen, setLogoutOpen] = useState(false);

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
    setLogoutOpen(false);
    setToken(null);
    setUser(null);
    window.scrollTo(0, 0);
    toast.success("Kamu sudah keluar");
  }

  if (checking) return <p className="muted" style={{ textAlign: "center", marginTop: 48 }}>Memuat...</p>;

  return (
    <>
      {user ? (
        <div className="app">
          <AppBackdrop />
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
              <button className="btn btn-ghost btn-sm" onClick={() => setLogoutOpen(true)}>
                Keluar
              </button>
            </div>
          </header>
          <main key={tab} className="page-enter">
            {tab === "tugas" ? <TasksPage /> : <CoursesPage />}
          </main>
          <LogoutDialog open={logoutOpen} onCancel={() => setLogoutOpen(false)} onConfirm={logout} />
        </div>
      ) : (
        <LandingPage onLogin={setUser} />
      )}
      <Toaster position="bottom-center" theme="system" closeButton />
    </>
  );
}